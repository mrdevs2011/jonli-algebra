# Loyiha holati — Jonli Algebra

**Oxirgi yangilanish:** 2026-09-10 (1–10-darslar audit qilindi, dars 7/8 tuzatildi)  
**Holat:** 1–14-§ to‘liq tayyor; barcha data.json 1-dars strukturasi bilan 100% mos

---

## Umumiy

| Ko‘rsatkich              | Qiymat              |
|--------------------------|---------------------|
| Jami darslar (reja)      | 38                  |
| Fizik mavjud dars papkasi| 14 / 38             |
| Tayyor (`readyIds`)      | 14 / 38             |

---

## Tayyor darslar

| § | Nom | Sahna |
|---|-----|-------|
| 1 | Kvadrat funksiyaning ta'rifi | abc-parabola |
| 2 | y = x² | x2-parabola |
| 3 | y = ax² | abc-parabola |
| 4 | y = ax² + bx + c | abc-parabola |
| 5 | Grafikni yasash | graph-steps |
| 6 | Kvadrat tengsizlik | sign-line |
| 7 | Tengsizlikni grafik bilan | ineq-parabola |
| 8 | Intervallar usuli | sign-chain |
| 9 | Aniqlanish sohasi | domain-line |
| 10 | O‘sish va kamayish (darajali funksiya y=xʳ) | power-growth |
| 11 | Juftlik va toqlik | even-odd |
| 12 | Daraja qatnashgan tenglama va tengsizlik | domain-line (yoki tegishli) |
| 13 | Kvadrat qatnashgan sodda sistemalar | line-parabola |
| 14 | Sistemani yechishning turli usullari | system-methods |

```js
function readyIds() {
  return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
}
```

---

## Audit tarixi — 1–10-darslar (2026-09-10)

Har bir dars uchun: `build.py`/`validate_lessons.py` sxema tekshiruvi + har bir savolning qo‘lda qayta hisoblanishi + `doska.masalalar` rasmlarining kitob sahifalari bilan piksel darajasida (`view`) solishtirilishi. Ikki marta o‘tkazildi: birinchi audit `jonli_legbr.zip`da (1–6 to‘liq rasmli, 7–14 faqat matn), ikkinchisi `jonli_algebra.zip`da (1–10 to‘liq rasmli).

| Dars | Rasm (`png/`) | Holat | Topilgan / tuzatilgan |
|------|:---:|-------|------------------------|
| 1 | ✅ | ✅ Toza | — |
| 2 | ✅ | ✅ Toza | — |
| 3 | ✅ | ✅ Toza | Chegara nuqta >0/≥0 farqi — matnda odatiy konvensiya, xato emas |
| 4 | ✅ | ⚠️ **Tuzatilmagan** | "9–12-rasm" blokining tavsifi (`o'ngga/1-masala/chapga/pastga`) haqiqiy rasm tartibiga mos emas (11-rasm aslida yuqoriga, 12-rasm yakuniy taqqoslash) — hali tuzatilmagan, keyingi audit navbatida |
| 5 | ✅ | ⚠️ **Tuzatilmagan** | `doska.masalalar`da "D" (diskriminant) atamasi ta'rifsiz ishlatilgan — 1–5-darsda hech qayerda `D=b²−4ac` kiritilmagan |
| 6 | ✅ | ✅ Toza | — |
| 7 | ✅ | ✅ **Tuzatildi** | 1-masala: kitobda `2x²−x−1≤0`, javob yopiq kesma `[−1/2;1]`; `steps`da xato ravishda qat'iy `y<0`/ochiq `(−1/2;1)` yozilgan edi → `y≤0`/`[−1/2;1]`ga tuzatildi |
| 8 | ✅ | ✅ **Tuzatildi** | Barcha 4 rasm/caption "misol" deb nomlangan edi, kitobda "masala" — caption, alt, intro, agenda matnlari + fayl nomlari (`1-misol.png→1-masala.png` va h.k.) "masala"ga almashtirildi |
| 9 | ✅ | ✅ **Tuzatildi** (avvalgi audit, `jonli_legbr.zip`da) | 1-masala: konstanta `+6`→`+5`; 4-band butunlay boshqa funksiya (`√(x²−4)`) o'rniga kitobdagi `⁴√((x+2)/(x−2))`ga almashtirildi. `jonli_algebra.zip`da ikkalasi ham allaqachon tuzatilgan holda topildi |
| 10 | ✅ | ✅ **Tuzatildi** (avvalgi audit) | Butun dars mavzusi noto'g'ri edi — kvadrat funksiya (x₀=−b/2a) o'rniga kitobning haqiqiy §10 mavzusi (darajali funksiya y=xʳ, r>0/r<0) bo'yicha to'liq qayta yozilishi kerak edi. `jonli_algebra.zip`da bu ish bajarilgan holda topildi: sahna `mono-parabola→power-growth`, 3 ta rasm (kirish41/tarif42/tarif43) matn bilan aniq mos |

**Ochiq qolgan ishlar:** dars 4 (9–12-rasm tavsifi) va dars 5 ("D" atamasi) hali tuzatilmagan — keyingi audit navbatida ko'rib chiqiladi. Darslar 11–14 hali umuman audit qilinmagan va ularda `png/` yo'q.

---

## Keyingi dars

**15-§** — Kvadrat tenglamalar sistemasini yechish
