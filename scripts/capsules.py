# Steam capsules and library art from the start screenshot and the app icon.
# Run: python3 scripts/capsules.py  (needs Pillow and the DejaVu Sans Bold font)
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import os

ROOT = os.path.join(os.path.dirname(__file__), "..")
SRC = os.path.join(ROOT, "store", "screenshots", "steam", "01-start.png")
ICON = os.path.join(ROOT, "store", "icon-1024.png")
OUT = os.path.join(ROOT, "store", "steam")
FONT = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
SUB_FONT = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"

def cover(img, w, h, focus=0.5):
    s = max(w / img.width, h / img.height)
    im = img.resize((round(img.width * s), round(img.height * s)), Image.LANCZOS)
    x = round((im.width - w) * focus)
    y = (im.height - h) // 2
    return im.crop((x, y, x + w, y + h))

def shade(img, top=0.35, bottom=0.85):
    # darken the picture toward the bottom so the title stays readable
    w, h = img.size
    grad = Image.new("L", (1, h))
    for y in range(h):
        t = y / max(1, h - 1)
        grad.putpixel((0, y), int(255 * (top + (bottom - top) * t)))
    mask = grad.resize((w, h))
    dark = Image.new("RGB", (w, h), (15, 20, 36))
    return Image.composite(dark, img, mask)

def fit(d, text, path, size, max_w):
    # shrink the font until the line fits the width
    while size > 8:
        f = ImageFont.truetype(path, size)
        if d.textlength(text, font=f) <= max_w:
            return f
        size -= 2
    return ImageFont.truetype(path, size)

def title(img, text, sub, size, pad):
    d = ImageDraw.Draw(img)
    w, h = img.size
    max_w = w - 2 * pad
    f = fit(d, text, FONT, size, max_w)
    fs = fit(d, sub, SUB_FONT, max(12, size // 3), max_w) if sub else None
    sub_h = fs.size + 4 if fs else 0
    y = h - pad - sub_h - f.size - (f.size // 4 if fs else 0)
    d.text((pad, y), text, font=f, fill=(242, 180, 90))
    if fs:
        d.text((pad, h - pad - sub_h), sub, font=fs, fill=(233, 230, 242))
    return img

def capsule(w, h, name, focus, size, sub=None, icon=True, out=None):
    base = shade(cover(Image.open(SRC).convert("RGB"), w, h, focus))
    if icon:
        ic = Image.open(ICON).convert("RGBA").resize((round(h * 0.42),) * 2, Image.LANCZOS)
        base.paste(ic, (w - ic.width - round(h * 0.05), round(h * 0.05)), ic)
    pad = round(h * 0.07)
    title(base, "Birth Lottery", sub, round(h * 0.15), pad)
    base.save(os.path.join(out or OUT, name))
    print(name, base.size)

capsule(460, 215, "capsule-header-460x215.png", 0.5, 30, "Four babies are born every second. One is you.")
capsule(231, 87, "capsule-small-231x87.png", 0.5, 14, icon=False)
capsule(616, 353, "capsule-main-616x353.png", 0.5, 40, "Four babies are born every second. One is you.")
capsule(920, 430, "capsule-large-920x430.png", 0.5, 56, "Four babies are born every second. One is you.")
capsule(1232, 706, "capsule-hero-1232x706.png", 0.5, 76, "Four babies are born every second. One is you.")
capsule(3840, 1240, "library-hero-3840x1240.png", 0.5, 150, "Four babies are born every second. One is you.", icon=False)
capsule(600, 900, "library-capsule-600x900.png", 0.5, 56, "Four babies are born every second. One is you.")

# баннер Google Play 1024×500
PLAY = os.path.join(ROOT, "store", "play")
os.makedirs(PLAY, exist_ok=True)
capsule(1024, 500, "feature-graphic-1024x500.png", 0.5, 62, "Four babies are born every second. One is you.", out=PLAY)
