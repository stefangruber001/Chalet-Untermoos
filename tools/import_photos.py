"""Copy the owner's photos into src/assets/photos/<slot>.jpg (auto-rotated, max 2560 px, sRGB JPEG q88).

Run: python3 tools/import_photos.py <folder-with-originals> [slot ...]   (no slots = all)
Astro then generates AVIF/WebP in all needed widths at build time.
"""
import json, sys
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
src_dir = Path(sys.argv[1])
out_dir = ROOT / 'src' / 'assets' / 'photos'
out_dir.mkdir(parents=True, exist_ok=True)
mapping = json.loads((ROOT / 'tools' / 'photo-map.json').read_text())
only = set(sys.argv[2:])
for slot, spec in mapping.items():
    if slot.startswith('_') or (only and slot not in only):
        continue
    f = src_dir / spec['src']
    if not f.exists():
        print('missing', slot, f.name); continue
    im = ImageOps.exif_transpose(Image.open(f)).convert('RGB')
    if 'crop' in spec:
        l, t, r, b = spec['crop']; w, h = im.size
        im = im.crop((int(l * w), int(t * h), int(r * w), int(b * h)))
    im.thumbnail((2560, 2560), Image.LANCZOS)
    out = out_dir / f'{slot}.jpg'
    im.save(out, 'JPEG', quality=88, optimize=True, progressive=True)
    print(f'{slot:15s} {im.size[0]}x{im.size[1]}  {out.stat().st_size // 1024} KB')
