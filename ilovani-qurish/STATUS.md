# Loyiha holati — Jonli Algebra

**Oxirgi yangilanish:** 2026-09-08  
**Holat:** Poydevor **mustahkam** va tayyor

---

## Umumiy

| Ko‘rsatkich              | Qiymat              |
|--------------------------|---------------------|
| Jami darslar             | 38                  |
| Poydevor (shablon)       | 38 / 38             |
| Tayyor (`readyIds`)      | 0 / 38              |
| O‘tilgan (localStorage)  | 0                   |
| Qurish hujjatlari        | `ilovani-qurish/`   |

---

## Poydevor mustahkamligi

- [x] 1–38 papkalar bir xil, toza shablon
- [x] CSS: focus-visible, reduced-motion, mobil, theme-color
- [x] JS: escapeHtml, xato ushlash, `"use strict"`, onLessonOpen
- [x] Progress: xavfsiz localStorage
- [x] AI.md + STATUS + CONVENTIONS + PLAN + CHECKLIST
- [x] Dashboard xato holatida tushunarli xabar
- [x] Meta description + theme-color
- [x] Sahna `aria-label` va `.is-live` holati tayyor

---

## Tayyor darslar

Hozircha yo‘q.

```js
// js/progress.js
function readyIds() {
  return [];
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
| I   | Kvadrat funksiya. Kvadrat tengsizliklar | 1–12 | 0 |
| II  | Tenglamalar va tengsizliklar sistemalari | 13–… | 0 |
| III | Trigonometriya elementlari | … | 0 |
| IV  | Sonli ketma-ketliklar. Progressiyalar | … | 0 |
| V   | Ehtimollik va statistika elementlari | 34–38 | 0 |

---

## Oxirgi o‘zgarishlar

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
