#!/usr/bin/env python3
"""
Jonli Algebra — build.py

Har bir N/data.json faylini o'qib, umumiy build/dars-template.html shabloni
bilan birlashtiradi va N/index.html ni qayta yaratadi.

Nega kerak: loyihamiz internetsiz (file://) ishlashi shart, shuning uchun
index.html data.json'ni fetch() bilan o'qiy olmaydi (CORS). Shu sababli
build vaqtida JSON index.html ICHIGA joylashtiriladi (<script type="application/json">),
lekin siz hali ham N/data.json faylini alohida, sof JSON sifatida tahrirlaysiz.

Ishlatish:
    python3 build/build.py            # o'zgargan/barcha darslarni qayta quradi
    python3 build/build.py 1          # faqat 1-darsni quradi (lessons/math/9/1)
"""
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TEMPLATE_PATH = ROOT / "build" / "dars-template.html"
# Hozircha faqat 9-sinf algebra. Kelajakda boshqa fan/sinf qo'shilsa,
# shu yerga ro'yxat qilinadi (masalan LESSONS_ROOTS = [.../math/9, .../geometry/9]).
LESSONS_ROOT = ROOT / "lessons" / "math" / "9"
TOKEN = "__DARS_DATA_JSON__"


def build_lesson(folder: Path, template: str) -> bool:
    data_path = folder / "data.json"
    if not data_path.exists():
        return False

    try:
        data = json.loads(data_path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as e:
        print(f"  ✗ {folder.name}/data.json — JSON xato: {e}")
        return False

    # Qayta ixcham JSON qilib chiqaramiz (formatlash farqi ahamiyatsiz);
    # </script> ketma-ketligini xavfsiz qochiramiz (JSON matn ichida chiqib qolsa ham).
    json_text = json.dumps(data, ensure_ascii=False, separators=(",", ":"))
    json_text = json_text.replace("</", "<\\/")

    html = template.replace(TOKEN, json_text)
    (folder / "index.html").write_text(html, encoding="utf-8")
    print(f"  ✓ {folder.name}/index.html yangilandi ({folder.name}/data.json asosida)")
    return True


def main():
    template = TEMPLATE_PATH.read_text(encoding="utf-8")

    if len(sys.argv) > 1:
        targets = [LESSONS_ROOT / arg for arg in sys.argv[1:]]
    else:
        targets = sorted(
            (p for p in LESSONS_ROOT.iterdir() if p.is_dir() and p.name.isdigit()),
            key=lambda p: int(p.name),
        )

    built = 0
    for folder in targets:
        if build_lesson(folder, template):
            built += 1

    print(f"\nJami: {built} ta dars build qilindi.")


if __name__ == "__main__":
    main()
