#!/usr/bin/env python3
"""
Jonli Algebra — data.json schema validatori.

Nega kerak: build.py hozircha faqat json.loads() qiladi — bu SINTAKSIS
tekshiruvi (qavslar to'g'rimi), SEMANTIKA emas (kerakli maydon bormi,
turi to'g'rimi, sahna.type ro'yxatda bormi, rasm fayli haqiqatan
diskda bormi). Shu fayl semantikani tekshiradi.

38 ta darsda bitta odam qo'lda yozadigan JSON'da eng ko'p uchraydigan xatolar:
  - maydon nomini xato yozish (masalan "titel" o'rniga "title")
  - "next"/"prev" ichida "href" yoki "label" unutilishi
  - "sahna.type" yozilgan, lekin unga mos js/sahna-*.js hali yozilmagan
  - "kitob.sahifalar"/"doska.masalalar" ichidagi "img" yo'liga mos PNG fayl
    lessons/.../N/png/ papkasida yo'q
  - "savollar[].togri" indeks variantlar uzunligidan katta/manfiy

Bu fayl mustaqil modul — build.py undan import qiladi, lekin
alohida ham ishlaydi: `python3 build/lesson_schema.py lessons/math/9/1`
"""
from __future__ import annotations
import re
import sys
from pathlib import Path


class SchemaError(Exception):
    """Bitta aniq xato — xabar odam o'qiganda darhol tushunadigan bo'lishi shart."""
    pass


# Har bir dars uchun yoqib/o'chirib bo'ladigan feature'lar ro'yxati.
# data.json'da "features": {"picker": false} deb yozilsa, shu feature
# aynan SHU darsda o'chadi — boshqa darslarga ta'sir qilmaydi (default:
# yozilmasa ham hammasi yoqilgan).
#
# qiymat "html"  -> build.py shablondan <!--#feature:NOM-->...<!--/feature:NOM-->
#                   blokini butunlay kesib tashlaydi
# qiymat "js"    -> HTML'da kesiladigan statik blok yo'q, feature o'zi
#                   #dars-data'dan features.NOM'ni o'qib, false bo'lsa hech
#                   narsa qurmaydi (masalan board.js — header'ga dinamik
#                   tugma qo'shadigan feature)
#
# Yangi o'chirib bo'ladigan feature qo'shsangiz: shu yerga qator qo'shing,
# "html" bo'lsa dars-template.html'da mos joyni <!--#feature:NOM--> bilan
# o'rang, "js" bo'lsa js/features/NOM.js ichida featureEnabled() xilidagi
# tekshiruv yozing (board.js'ga qarang, namuna sifatida).
FEATURE_TOGGLES = {
    "agenda": "html",
    "picker": "html",
    "classtimer": "html",
    "xulosaBoard": "html",
    "board": "js",
}


def _require(cond, msg):
    if not cond:
        raise SchemaError(msg)


def _req_type(value, types, path):
    _require(isinstance(value, types), f"{path} — noto'g'ri tur (kutilgan: {types}, kelgan: {type(value).__name__})")


def _req_keys(d, keys, path):
    _req_type(d, dict, path)
    for k in keys:
        _require(k in d, f"{path}.{k} — yo'q (majburiy maydon)")


# ---- sahna.type registry ----
# js/sahna-<type>.js faylida `window.KA_SAHNA["<type>"] = ...` deb yozilgan
# bo'lishi shart. Bu funksiya diskdan haqiqiy ro'yxatni o'qiydi — qo'lda
# ro'yxat yuritish shart emas, shu bilan ikkita manba sinxron bo'lishdan qutuladi.
SAHNA_TYPE_RE = re.compile(r'window\.KA_SAHNA\[\s*["\']([a-zA-Z0-9\-_]+)["\']\s*\]\s*=')


def discover_sahna_types(js_dir: Path) -> set[str]:
    found = set()
    for f in js_dir.glob("sahna-*.js"):
        text = f.read_text(encoding="utf-8")
        for m in SAHNA_TYPE_RE.finditer(text):
            found.add(m.group(1))
    return found


def validate_lesson(data: dict, folder: Path, js_dir: Path) -> list[str]:
    """Xatolar ro'yxatini qaytaradi (bo'sh = to'g'ri). Istisno tashlamaydi —
    build.py bir darsda ko'p xatoni birdan ko'rsatishi uchun."""
    errors: list[str] = []

    def check(fn):
        try:
            fn()
        except SchemaError as e:
            errors.append(str(e))

    # --- majburiy top-level maydonlar (dars-render.js ularsiz portlaydi yoki jim ishlamaydi) ---
    check(lambda: _req_keys(data, ["id", "bob", "paragraf", "title", "lead", "agenda"], "dars"))

    def check_id():
        _req_type(data.get("id"), (int,), "dars.id")
    check(check_id)

    def check_bob():
        bob = data.get("bob")
        _req_keys(bob, ["roman", "nom"], "dars.bob")
        _req_type(bob["roman"], (str,), "dars.bob.roman")
        _req_type(bob["nom"], (str,), "dars.bob.nom")
    check(check_bob)

    for key in ("paragraf", "title", "lead"):
        def _c(k=key):
            _req_type(data.get(k), (str,), f"dars.{k}")
        check(_c)

    # --- prev/next: null bo'lishi mumkin, lekin object bo'lsa href+label shart ---
    for nav_key in ("prev", "next"):
        def _c(k=nav_key):
            v = data.get(k, "MISSING")
            _require(v != "MISSING", f"dars.{k} — yo'q (null bo'lsa ham maydon shart, oxirgi/birinchi darsda null qo'ying)")
            if v is not None:
                _req_keys(v, ["href", "label"], f"dars.{k}")
        check(_c)

    # --- agenda: list of {min, name} ---
    def check_agenda():
        ag = data.get("agenda")
        _req_type(ag, (list,), "dars.agenda")
        _require(len(ag) > 0, "dars.agenda — bo'sh bo'lmasligi kerak")
        for i, step in enumerate(ag):
            _req_keys(step, ["min", "name"], f"dars.agenda[{i}]")
            _req_type(step["min"], (int, float), f"dars.agenda[{i}].min")
            _req_type(step["name"], (str,), f"dars.agenda[{i}].name")
    check(check_agenda)

    # --- sahna (bor bo'lsa) — type registry'da bo'lishi SHART ---
    def check_sahna():
        sahna = data.get("sahna")
        if sahna is None:
            return
        _req_keys(sahna, ["type", "vars"], "dars.sahna")
        _req_type(sahna["type"], (str,), "dars.sahna.type")
        known = discover_sahna_types(js_dir)
        _require(
            sahna["type"] in known,
            f"dars.sahna.type = \"{sahna['type']}\" — js/sahna-*.js fayllarida bunday tur RO'YXATDAN O'TKAZILMAGAN. "
            f"Mavjud turlar: {sorted(known) or '(hech qanday)'}. "
            f"Yechim: js/sahna-{sahna['type']}.js yozing va oxirida "
            f"window.KA_SAHNA[\"{sahna['type']}\"] = function(stage, cfg) {{...}} qo'shing."
        )
        _req_type(sahna["vars"], (dict,), "dars.sahna.vars")
        for vname, v in sahna["vars"].items():
            _req_keys(v, ["min", "max", "step", "value"], f"dars.sahna.vars.{vname}")
    check(check_sahna)

    # --- savollar: har birida togri indeks variantlar ichida bo'lishi shart ---
    def check_savollar():
        savollar = data.get("savollar")
        if savollar is None:
            return
        _req_type(savollar, (list,), "dars.savollar")
        for i, q in enumerate(savollar):
            _req_keys(q, ["savol", "variantlar", "togri"], f"dars.savollar[{i}]")
            _req_type(q["variantlar"], (list,), f"dars.savollar[{i}].variantlar")
            _require(len(q["variantlar"]) >= 2, f"dars.savollar[{i}].variantlar — kamida 2 ta variant kerak")
            togri = q["togri"]
            _req_type(togri, (int,), f"dars.savollar[{i}].togri")
            _require(
                0 <= togri < len(q["variantlar"]),
                f"dars.savollar[{i}].togri = {togri} — variantlar ro'yxati chegarasidan tashqarida "
                f"(0..{len(q['variantlar']) - 1} oralig'ida bo'lishi kerak)"
            )
    check(check_savollar)

    # --- features: faqat FEATURE_TOGGLES'da ro'yxatdan o'tgan nomlar,
    # qiymat true/false bo'lishi shart (masalan "off" yoki 0 yozib xato
    # qilmaslik uchun) ---
    def check_features():
        feats = data.get("features")
        if feats is None:
            return
        _req_type(feats, (dict,), "dars.features")
        for name, val in feats.items():
            _require(
                name in FEATURE_TOGGLES,
                f"dars.features.{name} — noma'lum feature nomi. "
                f"Mavjudlari: {sorted(FEATURE_TOGGLES)}"
            )
            _req_type(val, (bool,), f"dars.features.{name}")
    check(check_features)

    # --- rasm fayllari haqiqatan diskda bormi (kitob.sahifalar + doska.masalalar) ---
    def check_images():
        img_paths = []
        kitob = data.get("kitob")
        if kitob:
            for i, p in enumerate(kitob.get("sahifalar", [])):
                _req_keys(p, ["img", "bet", "width", "height"], f"dars.kitob.sahifalar[{i}]")
                img_paths.append((f"dars.kitob.sahifalar[{i}].img", p["img"]))
        doska = data.get("doska")
        if doska:
            for i, m in enumerate(doska.get("masalalar", [])):
                _req_keys(m, ["img", "alt", "width", "height", "caption"], f"dars.doska.masalalar[{i}]")
                img_paths.append((f"dars.doska.masalalar[{i}].img", m["img"]))
                is_static = "static" in m
                if not is_static:
                    _require("steps" in m, f"dars.doska.masalalar[{i}] — na 'static' na 'steps' bor (bittasi shart)")
        for path_label, rel in img_paths:
            full = folder / rel
            _require(full.is_file(), f"{path_label} = \"{rel}\" — fayl topilmadi: {full}")
    check(check_images)

    return errors


def main():
    if len(sys.argv) < 2:
        print("Ishlatish: python3 lesson_schema.py <dars-papkasi>")
        sys.exit(1)
    folder = Path(sys.argv[1]).resolve()
    js_dir = folder.parents[3] / "js" if len(folder.parents) >= 3 else Path("js")
    # fallback: try to find repo root by walking up for a "js" dir
    probe = folder
    for _ in range(6):
        if (probe / "js").is_dir():
            js_dir = probe / "js"
            break
        probe = probe.parent

    import json
    data = json.loads((folder / "data.json").read_text(encoding="utf-8"))
    errors = validate_lesson(data, folder, js_dir)
    if errors:
        print(f"✗ {folder.name} — {len(errors)} ta xato:")
        for e in errors:
            print(f"    - {e}")
        sys.exit(1)
    print(f"✓ {folder.name} — schema to'g'ri")


if __name__ == "__main__":
    main()
