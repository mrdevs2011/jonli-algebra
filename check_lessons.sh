#!/bin/bash
# Har bir dars sahifasida umumiy script'lar (picker/classtimer/xulosa-board)
# ulanganligini tekshiradi. Ishlatish: bash check_lessons.sh
MISSING=0
for i in $(seq 1 38); do
  f="$i/index.html"
  if [ ! -f "$f" ]; then
    echo "❌ $f — fayl topilmadi"
    MISSING=1
    continue
  fi
  for js in picker.js classtimer.js xulosa-board.js; do
    if ! grep -q "src=\"../js/$js\"" "$f"; then
      echo "⚠️  $f — ../js/$js ulanmagan"
      MISSING=1
    fi
  done
done
if [ $MISSING -eq 0 ]; then
  echo "✅ Barcha 38 dars tekshirildi — hammasi joyida"
fi
