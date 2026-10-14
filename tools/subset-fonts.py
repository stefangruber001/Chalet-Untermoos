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

def upright_forever(font):
    """Fraunces keeps its "wonky" leaning h/m/n/s/& as default glyphs and swaps in the upright
    forms through an rvrn feature variation (WONK=0 or small optical sizes). Pinning WONK=0 with the
    instancer leaves that rule conditioned on small optical sizes only, so large headings would turn
    wonky again. Make the upright forms the default glyphs and drop the feature variations."""
    gsub = font["GSUB"].table
    fv = getattr(gsub, "FeatureVariations", None)
    if not fv:
        return
    swap = {}
    for rec in fv.FeatureVariationRecord:
        for st in rec.FeatureTableSubstitution.SubstitutionRecord:
            for li in st.Feature.LookupListIndex:
                for sub in gsub.LookupList.Lookup[li].SubTable:
                    swap.update(getattr(sub, "mapping", {}) or {})
    for table in font["cmap"].tables:
        table.cmap = {cp: swap.get(g, g) for cp, g in table.cmap.items()}
    gsub.FeatureVariations = None
    if gsub.Version > 0x00010000:
        gsub.Version = 0x00010000
    assert "h" not in swap or font.getBestCmap()[ord("h")] == swap["h"]


JOBS = [
    # (source file inside package, output name, axis limits)
    # Display serif Fraunces (roman only): softness and "wonky" letters pinned (SOFT 30, WONK 0),
    # weights 360–600, optical size capped at 36: large headings keep the sturdier hairlines of the
    # mid-size cut (H crossbar ~40 % of the stem instead of ~30 % at opsz 72) – readability first.
    ("fraunces/files/fraunces-latin-full-normal.woff2", "fraunces.woff2", {"wght": (360, 600), "opsz": (9, 36), "SOFT": 30, "WONK": 0}),
    ("albert-sans/files/albert-sans-latin-wght-normal.woff2", "albert-sans.woff2", {"wght": (380, 700)}),
]
# Latin-ext subset files are merged in by using the latin-ext source as well where needed.
EXT = {
    "fraunces.woff2": "fraunces/files/fraunces-latin-ext-full-normal.woff2",
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
        if name.startswith("fraunces"):
            upright_forever(font)
        out = OUT / (name.replace(".woff2", f"{variant}.woff2"))
        font.flavor = "woff2"
        font.save(out)
        print(f"{out.name}: {out.stat().st_size/1024:.1f} KB")
