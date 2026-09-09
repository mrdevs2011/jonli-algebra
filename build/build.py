#!/usr/bin/env python3
"""
Jonli Algebra — build.py (v2, mustahkamlangan)

Har bir N/data.json faylini o'qib, umumiy build/dars-template.html shabloni
bilan birlashtiradi va N/index.html ni qayta yaratadi.

Nega kerak: loyihamiz internetsiz (file://) ishlashi shart, shuning uchun
index.html data.json'ni fetch() bilan o'qiy olmaydi (CORS). Shu sababli
build vaqtida JSON index.html ICHIGA joylashtiriladi (<script type="application/json">),
lekin siz hali ham N/data.json faylini alohida, sof JSON sifatida tahrirlaysiz.

v2'da nima o'zgardi (poydevor mustahkamlash):
  - data.json endi FAQAT sintaksis emas, SEMANTIKA bo'yicha ham tekshiriladi
    (lesson_schema.py) — noto'g'ri/yetishmayotgan maydon, ro'yxatdan
    o'tmagan sahna.type, mavjud bo'lmagan rasm fayli — hammasi build
    vaqtida, browserda emas, terminalda ko'rinadi.
  - data.json yo'q bo'lsa endi JIM emas — aniq xato bilan to'xtaydi.
  - Har bir darsning natijasi (✓/✗) va xato tafsiloti chiqadi, oxirida
    umumiy hisobot: nechta muvaffaqiyatli, nechta xato bilan.
  - Exit code: biror dars xato bersa 1 (CI/pre-commit buni ushlab oladi).

Ishlatish:
    python3 build/build.py            # barcha darslarni qayta quradi
    python3 build/build.py 1          # faqat 1-darsni quradi (lessons/math/9/1)
    python3 build/build.py --strict   # ogohlantirishlarni ham xato deb hisoblaydi (hozircha barchasi qattiq)
"""
import json
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from lesson_schema import validate_lesson, discover_sahna_types, FEATURE_TOGGLES  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
TEMPLATE_PATH = ROOT / "build" / "dars-template.html"
JS_DIR = ROOT / "js"
FEATURES_SRC_DIR = JS_DIR / "features"
FEATURES_BUNDLE = JS_DIR / "features.js"
# Hozircha faqat 9-sinf algebra. Kelajakda boshqa fan/sinf qo'shilsa,
# shu yerga ro'yxat qilinadi (masalan LESSONS_ROOTS = [.../math/9, .../geometry/9]).
LESSONS_ROOT = ROOT / "lessons" / "math" / "9"
TOKEN = "__DARS_DATA_JSON__"

# Har biri build/dars-template.html'da <!--#feature:NOM-->...<!--/feature:NOM-->
# bilan o'ralgan bo'lishi shart. data.json'da "features": {"NOM": false}
# desangiz, shu blok build vaqtida HTML'dan butunlay kesib tashlanadi
# (comment sifatida yashirilmaydi — shu darsning index.html'ida umuman yo'q
# bo'ladi). Yozilmagan feature — default yoqilgan.
FEATURE_BLOCK_RE = {
    name: re.compile(
        r"<!--#feature:" + re.escape(name) + r"-->(.*?)<!--/feature:" + re.escape(name) + r"-->",
        re.DOTALL,
    )
    for name in FEATURE_TOGGLES
}


def build_features_bundle() -> int:
    """js/features/*.js fayllarini BITTA js/features.js ichiga yig'adi.

    Nega kerak: har darsda BIR XIL ishlaydigan utility'lar (picker,
    classtimer, xulosa-board, progress va h.k.) bor. Ularni har safar
    dars-template.html'da alohida <script> qatori sifatida ulash — 10 ta
    feature bo'lganda 10 ta qator degani. Buning o'rniga: yangi utility
    yozilsa, faqat js/features/<nomi>.js sifatida qo'shiladi — build.py
    uni AVTOMATIK js/features.js ichiga qo'shadi, shablonga tegish shart
    emas (u faqat bitta <script src="js/features.js"> qatoriga ega).

    js/features.js — BUILD QILINGAN fayl, qo'lda tahrirlanmaydi (xuddi
    index.html kabi). Manba — js/features/*.js.

    Har bir manba fayl allaqachon o'z ichida (function(){...})() bilan
    o'ralgan (IIFE) va global nom to'qnashuvi yo'q — shuning uchun
    tartibsiz concat xavfsiz.
    """
    if not FEATURES_SRC_DIR.is_dir():
        return 0
    files = sorted(FEATURES_SRC_DIR.glob("*.js"))
    parts = [
        "/**\n"
        " * js/features.js — BUILD QILINGAN FAYL. Qo'lda tahrirlanmaydi.\n"
        " *\n"
        " * Manba: js/features/*.js — yangi umumiy funksiya (har darsda bir xil\n"
        " * ishlaydigan narsa) qo'shish uchun O'SHA papkaga yangi fayl qo'shing\n"
        " * va `python3 build/build.py` ishga tushiring. Shablonga (dars-template.html)\n"
        " * tegish shart emas — u faqat shu bitta bundle faylni ulaydi.\n"
        " */\n"
    ]
    for f in files:
        parts.append(f"\n/* ---- manba: js/features/{f.name} ---- */\n")
        parts.append(f.read_text(encoding="utf-8"))
    bundle_text = "".join(parts)
    FEATURES_BUNDLE.write_text(bundle_text, encoding="utf-8")
    return len(files)


class BuildFailure(Exception):
    """Bitta darsni build qilishda xato — main() buni yig'ib, oxirida hisobot beradi."""
    pass


def build_lesson(folder: Path, template: str) -> None:
    """Muvaffaqiyatli bo'lsa hech narsa qaytarmaydi, xato bo'lsa BuildFailure tashlaydi.
    Jim ютиш YO'Q — har doim yo ✓ chiqadi, yo aniq sabab bilan portlaydi."""
    data_path = folder / "data.json"
    if not data_path.exists():
        raise BuildFailure(f"{folder.name}/data.json — fayl topilmadi")

    try:
        data = json.loads(data_path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as e:
        raise BuildFailure(f"{folder.name}/data.json — JSON sintaksis xato: {e}")

    # --- SEMANTIKA tekshiruvi (schema) — build.py endi bunga ham javobgar ---
    errors = validate_lesson(data, folder, JS_DIR)
    if errors:
        detail = "\n".join(f"      - {e}" for e in errors)
        raise BuildFailure(f"{folder.name}/data.json — {len(errors)} ta schema xatosi:\n{detail}")

    # Qayta ixcham JSON qilib chiqaramiz (formatlash farqi ahamiyatsiz);
    # </script> ketma-ketligini xavfsiz qochiramiz (JSON matn ichida chiqib qolsa ham).
    json_text = json.dumps(data, ensure_ascii=False, separators=(",", ":"))
    json_text = json_text.replace("</", "<\\/")

    html = template.replace(TOKEN, json_text)

    # --- feature on/off: data.json.features.<nom> === false bo'lgan
    # bloklarni HTML'dan butunlay kesib tashlaymiz (board.js kabi JS orqali
    # qo'shiladigan feature'lar bu yerda emas, o'zi #dars-data'dan o'qiydi;
    # lesson_schema.py FEATURE_TOGGLES orqali qaysi nom "html" yoki "js"
    # turida ekanini biladi, shu yerda faqat "html" turlarini kesamiz).
    features_cfg = data.get("features") or {}
    off = [name for name, val in features_cfg.items() if val is False]
    for name in off:
        pattern = FEATURE_BLOCK_RE.get(name)
        if pattern is None:
            continue  # schema allaqachon buni xato deb belgilagan bo'lardi
        if FEATURE_TOGGLES[name] != "html":
            continue  # "js" turi (masalan "board") — HTML'da kesiladigan narsa yo'q
        html, n = pattern.subn("", html)
        if n == 0:
            raise BuildFailure(
                f"{folder.name} — features.{name}=false, lekin shablonda "
                f"<!--#feature:{name}--> markeri topilmadi (dars-template.html buzilganmi?)"
            )

    (folder / "index.html").write_text(html, encoding="utf-8")
    off_note = f" (o'chirilgan: {', '.join(off)})" if off else ""
    print(f"  ✓ {folder.name}/index.html yangilandi ({folder.name}/data.json asosida){off_note}")


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    template = TEMPLATE_PATH.read_text(encoding="utf-8")

    n_features = build_features_bundle()
    if n_features:
        print(f"js/features.js yangilandi ({n_features} ta manba fayldan: js/features/*.js)\n")

    if args:
        targets = [LESSONS_ROOT / arg for arg in args]
    else:
        targets = sorted(
            (p for p in LESSONS_ROOT.iterdir() if p.is_dir() and p.name.isdigit()),
            key=lambda p: int(p.name),
        )

    known_types = discover_sahna_types(JS_DIR)
    print(f"Ro'yxatdan o'tgan sahna turlari: {sorted(known_types) or '(hech qanday)'}\n")

    built = 0
    failed = []
    for folder in targets:
        try:
            build_lesson(folder, template)
            built += 1
        except BuildFailure as e:
            print(f"  ✗ {e}\n")
            failed.append(folder.name)

    print(f"\nJami: {built} ta dars build qilindi, {len(failed)} ta xato bilan.")
    if failed:
        print(f"Xatoli darslar: {', '.join(failed)}")
        sys.exit(1)


if __name__ == "__main__":
    main()
