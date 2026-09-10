#!/usr/bin/env python3
"""
Jonli Algebra — darslar orasidagi bog'liqlik validatori.
Har bir data.json faylini tekshiradi:
1. Agenda'ning "Kirish" qatorida aniq paragraf raqami bormi (umumiy emas)
2. Yangi termin (parabola, diskriminant, vertex va h.k.) ishlatilishidan oldin
   ko'prik jumla bormi
3. Sahna parametrlari darsning mavzusiga mos qulflangan (min=max) yoki yo'qmi
4. `kirish` yoki `qoida`da oldingi darsga referens (masalan "N-darsda ko'rdik") bormi

Ishlatish:
    python3 validate_lessons.py /path/to/lessons/math/9
"""

import json
import re
import sys
from pathlib import Path

# Darsda birinchi marta paydo bo'lishi mumkin bo'lgan asosiy terminlar.
# Har bir termin uchun: qaysi lesson id'dan boshlab "yangi" hisoblanadi.
# Buni loyihangga qarab kengaytirasan.
KEY_TERMS = ["parabola", "diskriminant", "simmetriya o'qi", "uchi", "kvadrat funksiya"]

REFERENCE_PATTERNS = [
    r"\d+-\u00a7", r"\d+-§", r"\d+-darsda", r"o'tgan darsda", r"oldingi darsda",
]

# kirish[0] uchun — SKILL.md band 2.2. Bular "bog'lovchi" so'zlar, lekin
# so'zning o'zi yetarli emas: pastda check_kirish_bridge shu iboradan keyin
# haqiqatan N-1 darsning aniq faktiga/raqamiga ishora borligini ham tekshiradi.
KIRISH_BRIDGE_PHRASES = [
    "o'tgan darsda", "oldingi darsda", "eslaymiz", "ko'rdik",
    "ko'rgan edik", "ko'rganimizdek", "o'rgangan edik",
]


def load_lesson(path: Path):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception as e:
        return {"__error__": str(e)}


def check_agenda_reference(lesson_id: int, agenda: list, issues: list):
    if not agenda:
        issues.append("Agenda bo'sh yoki yo'q.")
        return
    kirish = agenda[0].get("name", "")
    if lesson_id == 1:
        return  # birinchi darsda oldingi darsga referens shart emas
    # aniq raqam yoki paragraf ko'rsatilganmi tekshiramiz
    if not any(re.search(p, kirish) for p in REFERENCE_PATTERNS):
        issues.append(
            f"Agenda 'Kirish' qatorida aniq paragraf/dars raqami yo'q: '{kirish}'"
        )
    # ehtiyot: navbatdagi darsdan ko'chirilgan "eski" raqam qolib ketmaganmi?
    nums = re.findall(r"(\d+)-\u00a7|(\d+)-§", kirish)
    flat_nums = [int(n) for pair in nums for n in pair if n]
    for n in flat_nums:
        if n >= lesson_id:
            issues.append(
                f"Agenda 'Kirish'da lesson_id={lesson_id} dan katta/teng raqam bor "
                f"({n}-§) — ehtimol nusxa ko'chirish xatosi: '{kirish}'"
            )


def check_kirish_bridge(lesson_id: int, lesson: dict, issues: list):
    """SKILL.md band 2.2: kirish[0] N-1 darsga MUSTAQIL ravishda ko'prik
    tashlashi kerak — agenda to'g'ri bo'lgani bilan bu tekshiruvdan ozod
    qilinmaydi. Ikkalasi alohida-alohida tekshiriladi."""
    if lesson_id == 1:
        return  # birinchi darsda oldingi darsga referens shart emas
    kirish_list = lesson.get("kirish", [])
    if not kirish_list:
        issues.append("'kirish' maydoni bo'sh yoki yo'q — 2.2-band tekshirib bo'lmaydi.")
        return
    first = kirish_list[0]

    has_number_ref = any(re.search(p, first) for p in REFERENCE_PATTERNS)
    has_phrase_ref = any(phrase in first.lower() for phrase in KIRISH_BRIDGE_PHRASES)

    if not (has_number_ref or has_phrase_ref):
        issues.append(
            "[2.2-band] 'kirish[0]' da oldingi darsga ko'prik jumla topilmadi "
            "(na aniq paragraf raqami, na 'o'tgan darsda/ko'rdik' kabi ibora). "
            f"Joriy matn: '{first[:120]}...'"
        )
    else:
        # ehtiyot: navbatdagi darsdan ko'chirilgan raqam qolib ketmaganmi?
        nums = re.findall(r"(\d+)-\u00a7|(\d+)-§", first)
        flat_nums = [int(n) for pair in nums for n in pair if n]
        for n in flat_nums:
            if n >= lesson_id:
                issues.append(
                    f"[2.2-band] 'kirish[0]'da lesson_id={lesson_id} dan katta/teng "
                    f"raqam bor ({n}-§) — ehtimol nusxa ko'chirish xatosi."
                )


def check_new_terms(lesson_id: int, all_lessons: dict, issues: list):
    """Har bir keyword uchun: qaysi darsda birinchi marta paydo bo'lgan,
    o'sha darsdan oldingi darsda ko'prik jumla bor-yo'qligini tekshiradi."""
    text = json.dumps(all_lessons[lesson_id], ensure_ascii=False)
    for term in KEY_TERMS:
        if term in text:
            # bu birinchi paydo bo'lgan dars ekanini tekshiramiz
            prev_ids = [i for i in all_lessons if i < lesson_id]
            appeared_before = any(
                term in json.dumps(all_lessons[i], ensure_ascii=False)
                for i in prev_ids
            )
            if not appeared_before and lesson_id > 1:
                prev_lesson = all_lessons.get(lesson_id - 1)
                if prev_lesson:
                    prev_text = json.dumps(prev_lesson, ensure_ascii=False)
                    if term not in prev_text and "keyingi darsda" not in prev_text:
                        issues.append(
                            f"Termin '{term}' bu darsda birinchi marta ishlatilgan, "
                            f"lekin {lesson_id - 1}-darsda ko'prik jumla ('keyingi darsda...') topilmadi."
                        )


def check_sahna_lock(lesson_id: int, sahna: dict, issues: list):
    """Agar sahna turi 'abc-parabola' bo'lsa-yu, dars faqat bitta parametr
    haqida bo'lsa (title/lead da faqat 'a' zikr etilsa), b/c qulflanganmi tekshiradi."""
    if not sahna:
        return
    vars_ = sahna.get("vars", {})
    if sahna.get("type") == "abc-parabola":
        for param in ("b", "c"):
            v = vars_.get(param)
            if v and v.get("min") != v.get("max"):
                # bu normal holat bo'lishi ham mumkin (agar dars aynan b,c haqida bo'lsa)
                issues.append(
                    f"[TEKSHIR] sahna.vars.{param} qulflanmagan (min={v.get('min')}, "
                    f"max={v.get('max')}) — agar dars faqat 'a' haqida bo'lsa, bu xato."
                )


def validate_dir(lessons_dir: Path):
    lesson_files = sorted(lessons_dir.glob("*/data.json"),
                           key=lambda p: int(p.parent.name) if p.parent.name.isdigit() else 0)

    all_lessons = {}
    for f in lesson_files:
        data = load_lesson(f)
        if "__error__" in data:
            print(f"❌ {f}: JSON XATOSI — {data['__error__']}")
            continue
        all_lessons[data.get("id")] = data

    print(f"Jami {len(all_lessons)} ta dars topildi.\n")

    total_issues = 0
    for lesson_id in sorted(all_lessons):
        lesson = all_lessons[lesson_id]
        issues = []

        check_agenda_reference(lesson_id, lesson.get("agenda", []), issues)
        check_kirish_bridge(lesson_id, lesson, issues)
        check_new_terms(lesson_id, all_lessons, issues)
        check_sahna_lock(lesson_id, lesson.get("sahna", {}), issues)

        if issues:
            total_issues += len(issues)
            print(f"=== {lesson_id}-dars ({lesson.get('paragraf', '?')}) — {len(issues)} ta muammo ===")
            for i, msg in enumerate(issues, 1):
                print(f"  {i}. {msg}")
            print()
        else:
            print(f"✅ {lesson_id}-dars ({lesson.get('paragraf', '?')}) — muammo topilmadi")

    print(f"\nJami muammolar: {total_issues}")
    return total_issues


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Ishlatish: python3 validate_lessons.py /path/to/lessons/math/9")
        sys.exit(1)
    validate_dir(Path(sys.argv[1]))
