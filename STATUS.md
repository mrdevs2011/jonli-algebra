# Loyiha holati — Jonli Algebra

**Oxirgi yangilanish:** 2026-09-08  
**Holat:** 1-§ yozildi, poydevor **mustahkam**

---

## Umumiy

| Ko‘rsatkich              | Qiymat              |
|--------------------------|---------------------|
| Jami darslar             | 38                  |
| Poydevor (shablon)       | 38 / 38             |
| Tayyor (`readyIds`)      | 1 / 38              |
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

- 2026-09-09: **Arxitektura o'zgardi — data.json.** `N/index.html` endi qo'lda
  yozilmaydi, `build/dars-template.html`dan `python3 build/build.py N` bilan
  quriladi. Dars mazmuni `N/data.json`da (matn, savollar, doska qadamlari,
  sahna konfiguratsiyasi). Rasmlar `N/png/` papkasiga ko'chirildi. Offline
  (`file://`) ishlashi uchun JSON build vaqtida index.html ichiga inline
  qilinadi — hech qanday `fetch()` ishlatilmaydi. Hozircha faqat 1-§ shu
  tarzda qayta qurildi (jsdom bilan avtomatik test qilindi, hammasi ishlaydi);
  qolgan 37 papka eski, hali "tayyor" bo'lmagan shablonicha qoldi — ular ham
  yozilganda xuddi shu naqsh (data.json + png/) ishlatiladi. Batafsil:
  `ilovani-qurish/ARCHITECTURE.md` va `ilovani-qurish/CONVENTIONS.md`.
- 2026-09-09: 1-§ ga "Doskada namuna yechish" bloki qo'shildi (`block-doska`) — o'qituvchi elektron doskada kitobning 3 ta yechilgan masalasini (6-bet: 1-masala, 2-masala, 3-masala) ko'rsatib, qadam-baqadam tushuntirishi uchun. Har masala uchun kitobdan crop qilingan rasm (`1/kitob-6-masala1.png`, `kitob-6-masala2.png`, `kitob-6-masala3.png`) + "funksiyaning nollari" ta'rifi crop'i (`kitob-6-nollar.png`) va "Keyingi qadam"/"Boshidan" tugmali interaktiv qadam ochish (vanilla JS, `data-doska` atributlari orqali) qo'shildi. Faqat `1/index.html` o'zgartirildi (+ 4 ta yangi crop rasm shu papkada), boshqa darslarga tegilmadi.
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
