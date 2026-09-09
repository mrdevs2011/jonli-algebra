# Loyiha holati — Jonli Algebra

**Oxirgi yangilanish:** 2026-09-09  
**Holat:** faqat 1-§ mavjud, 2–38 tozalandi — qaytadan asl manba (kitob) asosida quriladi

---

## Umumiy

| Ko‘rsatkich              | Qiymat              |
|--------------------------|---------------------|
| Jami darslar (reja)      | 38                  |
| Fizik mavjud dars papkasi| 1 / 38              |
| Tayyor (`readyIds`)      | 1 / 38              |
| O‘tilgan (localStorage)  | 0                   |
| Qurish hujjatlari        | `ilovani-qurish/`   |

---

## Muhim: 2–38 papkalar o'chirildi (2026-09-09)

Eski 2–38 papkalari `data.json`siz, to'ldirilmagan shablon holida edi
(faqat sarlavha/lead/kitob-bet, qoida/savol/mashq yo'q). Ular butunlay
o'chirildi. Har biri endi qaytadan, **darslikning (`kitob/kitob-N.png`)
tegishli sahifasidan** haqiqiy mazmun bilan, dars-dars, `data.json` +
`build/build.py` orqali quriladi — xuddi 1-§ qanday qurilgan bo'lsa shunday.

Root fayllar (`index.html`, `js/`, `css/`, `build/`, `kitob/`) bunga tegishli emas, o'zgarmadi.

---

## Poydevor mustahkamligi

- [x] 1-§ — data.json + build.py orqali quriladigan yangi arxitektura ishlaydi
- [x] CSS: focus-visible, reduced-motion, mobil, theme-color
- [x] JS: escapeHtml, xato ushlash, `"use strict"`, onLessonOpen
- [x] Progress: xavfsiz localStorage
- [x] AI.md + STATUS + CONVENTIONS + PLAN + CHECKLIST
- [x] Dashboard xato holatida tushunarli xabar
- [x] Meta description + theme-color
- [x] Sahna `aria-label` va `.is-live` holati tayyor
- [ ] 2–38 — hali qurilmagan, kitob manbasidan dars-dars quriladi

---

## Tayyor darslar

- **1-§** — Kvadrat funksiyaning ta'rifi (a, b, c slayderlari; a = 0 bo'lganda chiziqqa aylanadi)

```js
// js/progress.js
function readyIds() {
  return [1];
}
```

---

## Keyingi dars

**4-§** — `y = ax² + bx + c funksiya`

Sabab: a, b, c slayderlari; 2-§ va 3-§ shu ichida ham ko‘rinadi.

---

## Boblar

| Bob | Nom | Darslar | Tayyor |
|-----|-----|---------|--------|
| I   | Kvadrat funksiya. Kvadrat tengsizliklar | 1–12 | 1 |
| II  | Tenglamalar va tengsizliklar sistemalari | 13–… | 0 |
| III | Trigonometriya elementlari | … | 0 |
| IV  | Sonli ketma-ketliklar. Progressiyalar | … | 0 |
| V   | Ehtimollik va statistika elementlari | 34–38 | 0 |

---

## Oxirgi o‘zgarishlar

- 2026-09-08: Barcha 38 darsga "Darslikda" bloki qo'shildi — Alimov/Xolmuhamedov/Mirzaahmedov (2019) darsligidagi tegishli §-bet raqami (mundarija asosida tasdiqlangan). CSS: `dars.css` ga `.block-kitob` qo'shildi.
- 2026-09-08: 1-§ (Kvadrat funksiyaning ta'rifi) to'liq yozildi — sahna, kirish, qoida, 3 savol, eslab qol. `readyIds` ga 1 qo'shildi.
- 2026-09-08: Poydevor mustahkamlandi
  - base.css / dars.css / progress.js / dashboard.js mustahkamlandi
  - Barcha 38 dars shabloni yangilandi (meta, a11y, onLessonOpen)
  - ilovani-qurish/ to‘liq

---

## Keyingi qadam

1. 4-§ uchun interaktiv `#sahna`
2. Matn + 3 savol
3. Sinov → `readyIds` ga 4
4. STATUS.md yangilash
