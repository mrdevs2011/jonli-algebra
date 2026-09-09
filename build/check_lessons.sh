#!/bin/bash
# Har bir dars sahifasida umumiy script'lar (picker/classtimer/xulosa-board)
# ulanganligini va data.json/index.html juftligi sinxronligini tekshiradi.
# Ishlatish: bash build/check_lessons.sh (root papkadan)
#
# v2: 38 ni qattiq yozib qo'yish o'rniga, lessons/math/9/ ichida haqiqatan
# NECHTA dars papkasi borligini o'zi sanaydi — 39-40-darslar qo'shilganda
# ham skript o'zgarmaydi. Bundan tashqari index.html data.json'dan ESKI
# qolib ketganini ham aniqlaydi (build.py ishga tushirilmagan bo'lsa).
LESSONS="lessons/math/9"
MISSING=0
COUNT=0

for dir in "$LESSONS"/*/; do
  i=$(basename "$dir")
  [[ "$i" =~ ^[0-9]+$ ]] || continue
  COUNT=$((COUNT + 1))
  f="$dir/index.html"
  d="$dir/data.json"

  if [ ! -f "$d" ]; then
    echo "❌ $i-dars — data.json topilmadi"
    MISSING=1
    continue
  fi
  if [ ! -f "$f" ]; then
    echo "❌ $i-dars — index.html topilmadi (build.py ishga tushirilmagan)"
    MISSING=1
    continue
  fi
  # index.html data.json'dan ESKI qolib ketganmi? (mtime solishtiramiz)
  if [ "$d" -nt "$f" ]; then
    echo "⚠️  $i-dars — data.json index.html'dan YANGI (build.py $i ishga tushirilmagan, o'zgarish ko'rinmaydi)"
    MISSING=1
  fi
  # Umumiy utility'lar endi bitta bundle (js/features.js) orqali ulanadi —
  # alohida picker.js/classtimer.js/xulosa-board.js qatorlari EMAS.
  if ! grep -q 'src="../../../../js/features.js"' "$f"; then
    echo "⚠️  $i-dars — ../../../../js/features.js ulanmagan"
    MISSING=1
  fi
done

if [ "$COUNT" -eq 0 ]; then
  echo "⚠️  $LESSONS ichida hech qanday dars papkasi topilmadi"
  exit 1
fi

# js/features.js bundle js/features/*.js manba fayllar bilan sinxronmi?
# (build.py ishga tushirilmagan bo'lsa, bundle eskirib qolishi mumkin)
for src in js/features/*.js; do
  name=$(basename "$src")
  if ! grep -q "manba: js/features/$name" js/features.js 2>/dev/null; then
    echo "⚠️  js/features.js — js/features/$name hali qo'shilmagan (python3 build/build.py ishga tushiring)"
    MISSING=1
  fi
  if [ "$src" -nt "js/features.js" ]; then
    echo "⚠️  js/features.js — js/features/$name'dan ESKI qolib ketgan (python3 build/build.py ishga tushiring)"
    MISSING=1
  fi
done

if [ $MISSING -eq 0 ]; then
  echo "✅ Barcha $COUNT dars tekshirildi — hammasi joyida"
else
  exit 1
fi
