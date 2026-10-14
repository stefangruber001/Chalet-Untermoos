"""Turn the owner's CAD floor plans (docs/plans/*.pdf) into light, brand-styled SVG data.

Run: python3 tools/build_plans.py   (needs poppler's pdftocairo)
Output: src/data/plans.json – per floor: viewBox + merged path strings per layer.
Removes the decorative tree, lamp symbols and the CAD text (labels are re-set in the site's fonts).
"""
import json, re, subprocess, tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
FLOORS = {
    'eg': ('docs/plans/Bauernhaus_Erdgeschoss.pdf', (92, 380, 476, 672)),
    'og': ('docs/plans/Bauernhaus_Obergeschoss.pdf', (92, 352, 476, 672)),
}
WALL = 'rgb(38.696289%, 39.109802%, 39.793396%)'
BLUE = 'rgb(0%, 35.888672%, 72.264099%)'
FURN = {'rgb(46.09375%, 46.09375%, 46.09375%)', 'rgb(0%, 0%, 0%)', 'rgb(59.764099%, 59.764099%, 59.764099%)'}
DROP = {'rgb(86.71875%, 86.71875%, 0%)', 'rgb(95.701599%, 81.25%, 8.203125%)', 'rgb(50%, 50%, 50%)'}

def apply(d, m):
    a, b, c, dd, e, f = m
    out = []
    toks = re.findall(r'[MLZ]|-?\d+\.?\d*', d)
    i = 0
    while i < len(toks):
        t = toks[i]
        if t in 'MLZ':
            out.append(t); i += 1
            continue
        x, y = float(toks[i]), float(toks[i + 1]); i += 2
        out.append(f"{a*x + c*y + e:.1f} {b*x + dd*y + f:.1f}")
    return ' '.join(out)

def inside(d, box):
    nums = list(map(float, re.findall(r'-?\d+\.?\d*', d)))
    xs, ys = nums[0::2], nums[1::2]
    x0, y0, x1, y1 = box
    return min(xs) >= x0 - 1 and max(xs) <= x1 + 1 and min(ys) >= y0 - 1 and max(ys) <= y1 + 1

result = {}
for key, (pdf, box) in FLOORS.items():
    with tempfile.TemporaryDirectory() as tmp:
        svg = Path(tmp) / 'p.svg'
        subprocess.run(['pdftocairo', '-svg', str(ROOT / pdf), str(svg)], check=True)
        s = svg.read_text()
    layers = {'wall': [], 'door': [], 'furn': []}
    for attrs in re.findall(r'<path ([^>]*)/>', s):
        dm = re.search(r' d="([^"]+)"', attrs)
        if not dm:
            continue
        d = dm.group(1)
        tm = re.search(r'transform="matrix\(([^)]+)\)"', attrs)
        if tm:
            d = apply(d, [float(v) for v in tm.group(1).split(',')])
        else:
            d = apply(d, [1, 0, 0, 1, 0, 0])
        fill = re.search(r'fill="([^"]+)"', attrs)
        stroke = re.search(r'stroke="([^"]+)"', attrs)
        fill = fill.group(1) if fill else None
        stroke = stroke.group(1) if stroke else None
        if not inside(d, box):
            continue
        if fill == WALL:
            layers['wall'].append(d)
        elif stroke == BLUE:
            layers['door'].append(d)
        elif stroke in FURN or fill == 'rgb(46.09375%, 46.09375%, 46.09375%)':
            layers['furn'].append(d)
        # blue fills = CAD text, DROP = tree + lamp symbols, light-grey fills = tree foliage → removed
    x0, y0, x1, y1 = box
    result[key] = {
        'viewBox': f"{x0} {y0} {x1 - x0} {y1 - y0}",
        **{k: ' '.join(v) for k, v in layers.items()},
    }
    print(key, {k: len(v) for k, v in layers.items()}, 'chars', sum(len(' '.join(v)) for v in layers.values()))

out = ROOT / 'src' / 'data' / 'plans.json'
out.write_text(json.dumps(result))
print('written', out, out.stat().st_size // 1024, 'KB')
