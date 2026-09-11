#!/usr/bin/env python3
"""
Builds the before/after pair for the homepage comparison slider.

  assets/images/Van gogh images/  ->  artifacts/ptta-demo/public/compare/

The four `vangogh-colored_*` renders share one camera and differ only in their
key light, which is what makes this possible: they are pixel-registered, so
they can be combined the way a multi-light photographic setup would be, rather
than one of them being picked and brightened.

What the pipeline does, and why:

  1. Crops each render to the relief slab. The slab is the canvas, so the crop
     maps the render onto the painting's own frame.

  2. Shifts by (DX, DY). The sculptor's face sits slightly higher than the
     painted one; correcting it more than doubles edge correlation measured
     over the face (0.159 -> 0.372). This is what keeps the nose and eyes
     continuous when the slider seam runs down the middle of the face.

  3. Mixes the four lights in LINEAR space, not gamma space. Light adds
     linearly; blending encoded sRGB would muddy the midtones. Lighting the
     relief from both sides removes the dead shadow on the ear-less side of
     the face without flattening the form.

  4. Moves the palette partway toward the painting's, boosts local contrast on
     luminance only, then anchors exposure partway to the painting's levels.
     Every one of these is partial on purpose: taken to 100% the relief matches
     the painting so well that it stops looking like a physical object, which
     defeats the whole point of the comparison.

A photometric-stereo version of this was tried and rejected: recovering true
surface normals from the four lights and relighting them gave a brighter,
technically more dimensional image that read as artificial. Straight mixing of
the captured lights holds on to the photographic quality, which matters more
here than physical correctness.

Re-run after adding renders:  python3 assets/build-compare-assets.py
"""

from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parent
SRC = ROOT / "images" / "Van gogh images"
DST = ROOT.parent / "artifacts" / "ptta-demo" / "public" / "compare"

PAINTING = SRC / "actual-painting" / "Van Gogh Self Portrait.webp"
LIGHTS = {
    "ul": "vangogh-colored_01-upper-left.png",   # fills the viewer's-left cheek
    "ur": "vangogh-colored_02-upper-right.png",  # key
    "top": "vangogh-colored_03-top-raking.png",  # even top fill
    "side": "vangogh-colored_04-side-right.png",  # raking, ridge detail
}

TARGET = (800, 972)                   # the painting's native size
SLAB = (284, 202, 999, 1089)          # relief slab in the 1280x1280 renders
DX, DY = 2, 7                         # face-optimised offset, in output pixels

WEIGHTS = {"ul": 1.0, "ur": 1.0, "top": 0.6, "side": 0.45}
COLOR_MATCH = 0.45                    # toward the painting's palette
LOCAL_CONTRAST = 0.75                 # unsharp amount on luminance
TONE_MATCH = 0.55                     # toward the painting's levels

LUM = np.array([0.2126, 0.7152, 0.0722], dtype=np.float32)


def to_linear(x):
    t = x / 255.0
    return np.where(t <= 0.04045, t / 12.92, ((t + 0.055) / 1.055) ** 2.4)


def to_srgb(y):
    t = np.clip(y, 0.0, 1.0)
    return np.where(t <= 0.0031308, t * 12.92, 1.055 * np.power(t, 1 / 2.4) - 0.055) * 255.0


def load_aligned(path):
    """Crop to the slab, shifted by (DX, DY), resampled at subpixel accuracy."""
    sx = (SLAB[2] - SLAB[0]) / TARGET[0]
    sy = (SLAB[3] - SLAB[1]) / TARGET[1]
    box = (SLAB[0] - DX * sx, SLAB[1] - DY * sy, SLAB[2] - DX * sx, SLAB[3] - DY * sy)
    im = Image.open(path).convert("RGB").resize(TARGET, Image.LANCZOS, box=box)
    return np.asarray(im).astype(np.float32)


def main():
    DST.mkdir(parents=True, exist_ok=True)

    painting = np.asarray(
        Image.open(PAINTING).convert("RGB").resize(TARGET, Image.LANCZOS)
    ).astype(np.float32)
    paint_lum = painting @ LUM

    lit = {k: to_linear(load_aligned(SRC / f)) for k, f in LIGHTS.items()}
    img = to_srgb(
        sum(lit[k] * w for k, w in WEIGHTS.items()) / sum(WEIGHTS.values())
    )

    # Palette, partway toward the painting's per-channel mean and spread.
    out = img.copy()
    for ch in range(3):
        a, b = img[..., ch], painting[..., ch]
        matched = (a - a.mean()) * (b.std() / max(a.std(), 1e-3)) + b.mean()
        out[..., ch] = a * (1 - COLOR_MATCH) + matched * COLOR_MATCH
    img = np.clip(out, 0, 255)

    # Local contrast on luminance only, so the ridges read without colour fringing.
    lum = img @ LUM
    blur = np.asarray(
        Image.fromarray(np.clip(lum, 0, 255).astype(np.uint8)).filter(
            ImageFilter.GaussianBlur(2.2)
        )
    ).astype(np.float32)
    sharpened = np.clip(lum + LOCAL_CONTRAST * (lum - blur), 1, None)
    img = np.clip(img * np.where(lum > 1.0, sharpened / np.maximum(lum, 1e-3), 1.0)[..., None], 0, 255)

    # Exposure, anchored partway onto the painting's 5th/95th percentiles.
    lum = img @ LUM
    lo, hi = np.percentile(lum, 5), np.percentile(lum, 95)
    LO, HI = np.percentile(paint_lum, 5), np.percentile(paint_lum, 95)
    t = np.clip((lum - lo) / (hi - lo), 0, 1)
    med = np.clip((np.percentile(lum, 50) - lo) / (hi - lo), 1e-4, 1 - 1e-4)
    tgt = np.clip((np.percentile(paint_lum, 50) - LO) / (HI - LO), 1e-4, 1 - 1e-4)
    full = LO + (HI - LO) * np.power(t, np.log(tgt) / np.log(med))
    blended = lum * (1 - TONE_MATCH) + full * TONE_MATCH
    img = np.clip(img * np.where(lum > 1.0, blended / np.maximum(lum, 1e-3), 1.0)[..., None], 0, 255)

    opts = dict(quality=88, optimize=True, progressive=True)
    Image.fromarray(painting.astype(np.uint8)).save(DST / "vangogh-painting.jpg", **opts)
    Image.fromarray(img.astype(np.uint8)).save(DST / "vangogh-relief.jpg", **opts)

    print(f"wrote {DST/'vangogh-painting.jpg'}")
    print(f"wrote {DST/'vangogh-relief.jpg'}")
    print(f"relief mean luminance {(img@LUM).mean():.1f} (painting {paint_lum.mean():.1f})")


if __name__ == "__main__":
    main()
