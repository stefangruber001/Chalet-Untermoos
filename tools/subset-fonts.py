"""Subset + axis-limit the self-hosted variable fonts (OFL) for fast loading.

Run: python3 tools/subset-fonts.py   (needs: pip install fonttools brotli)
Sources come from node_modules/@fontsource-variable/*; output goes to public/fonts/.
"""
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools import subset

ROOT = Path(__file__).resolve().parent.parent
NM = ROOT / "node_modules" / "@fontsource-variable"
OUT = ROOT / "public" / "fonts"
OUT.mkdir(parents=True, exist_ok=True)

# Latin + Latin Ext-A (DE/EN/NL/FR/IT/ES/PL/CS), typographic punctuation, €, arrows, primes (coordinates).
UNICODES = (
    list(range(0x20, 0x7F)) + list(range(0xA0, 0x180)) +
    [0x131, 0x152, 0x153, 0x192, 0x2C6, 0x2DC] + list(range(0x2000, 0x2070)) +
    [0x20AC, 0x2122, 0x2190, 0x2191, 0x2192, 0x2193, 0x2197, 0x2212, 0x2248, 0x2264, 0x2265, 0x2116]
)

JOBS = [
    # (source file inside package, output name, axis limits)
    # Display serif Bodoni Moda: full optical-size axis (headlines use high-contrast cuts, leads the text cut).
    ("bodoni-moda/files/bodoni-moda-latin-standard-normal.woff2", "bodoni-moda-normal.woff2", {"wght": (400, 700)}),
    ("bodoni-moda/files/bodoni-moda-latin-standard-italic.woff2", "bodoni-moda-italic.woff2", {"wght": (400, 700)}),
    ("albert-sans/files/albert-sans-latin-wght-normal.woff2", "albert-sans.woff2", {"wght": (380, 700)}),
]
# Latin-ext subset files are merged in by using the latin-ext source as well where needed.
EXT = {
    "bodoni-moda-normal.woff2": "bodoni-moda/files/bodoni-moda-latin-ext-standard-normal.woff2",
    "bodoni-moda-italic.woff2": "bodoni-moda/files/bodoni-moda-latin-ext-standard-italic.woff2",
    "albert-sans.woff2": "albert-sans/files/albert-sans-latin-ext-wght-normal.woff2",
}

for src, name, limits in JOBS:
    for variant, path in (("", src), ("-ext", EXT[name])):
        font = TTFont(NM / path)
        opts = subset.Options()
        opts.flavor = "woff2"
        opts.layout_features = ["*"]
        opts.name_IDs = ["*"]
        opts.notdef_outline = True
        opts.glyph_names = False
        sub = subset.Subsetter(options=opts)
        sub.populate(unicodes=UNICODES)
        sub.subset(font)
        font = instancer.instantiateVariableFont(font, limits)
        out = OUT / (name.replace(".woff2", f"{variant}.woff2"))
        font.flavor = "woff2"
        font.save(out)
        print(f"{out.name}: {out.stat().st_size/1024:.1f} KB")
