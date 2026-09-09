#!/bin/bash
# Jonli Algebra — yagona tekshiruv komandasi.
#
# Nima qiladi (tartibi bilan):
#   1. build.py     — HAR bir data.json'ni schema bo'yicha tekshiradi
#                      (majburiy maydonlar, sahna.type registri, rasm fayllari,
#                      savollar.togri chegarasi) va index.html'larni quradi.
#                      Xato bo'lsa shu yerda to'xtaydi — keyingi bosqichlarga
#                      o'tmaydi (chirigan HTML'ni sinash befoyda).
#   2. check_lessons.sh — har dars umumiy JS fayllarga ulanganmi va
#                      index.html data.json bilan sinxronmi, tekshiradi.
#   3. run-all-render-tests.js — jsdom bilan HAQIQIY browserda(ga o'xshab)
#                      ochib, render vaqtida JS xatosi yo'qligini va DOM'da
#                      to'g'ri sondagi elementlar borligini tekshiradi.
#
# Ishlatish:
#   bash build/verify.sh          # barcha darslar
#   bash build/verify.sh 3        # faqat 3-dars
#
# Git pre-commit hook yoki CI'ga ulash uchun ham shu skriptni chaqiring —
# exit code 0 = hammasi toza, 1 = biror joyda xato bor.
set -e
cd "$(dirname "$0")/.."

echo "── 1/3: build.py (schema validatsiya + HTML build) ──"
python3 build/build.py "$@"

echo ""
echo "── 2/3: check_lessons.sh (umumiy JS ulanish + sinxronlik) ──"
bash build/check_lessons.sh

echo ""
echo "── 3/3: run-all-render-tests.js (runtime smoke test, jsdom) ──"
node build/run-all-render-tests.js "$@"

echo ""
echo "✅ Hammasi toza — deploy/commit qilsa bo'ladi."
