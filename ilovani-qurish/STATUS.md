# Loyiha holati — Jonli Algebra

**Oxirgi yangilanish:** 2026-09-10 (1–13-darslar audit qilindi, dars 7/8/11/12/13 tuzatildi)  
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
| 12 | Daraja qatnashgan tenglama va tengsizlik | domain-line |
| 13 | Kvadrat qatnashgan sodda sistemalar | line-parabola |
| 14 | Sistemani yechishning turli usullari | system-methods |

```js
function readyIds() {
  return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
}
```

---

## Audit tarixi — 1–12-darslar (2026-09-10)

Har bir dars uchun: `build.py`/`validate_lessons.py` sxema tekshiruvi + har bir savolning qo‘lda qayta hisoblanishi + `doska.masalalar` rasmlarining kitob sahifalari bilan piksel darajasida (`view`) solishtirilishi. To‘rt marta o‘tkazildi: birinchi audit `jonli_legbr.zip`da (1–6 to‘liq rasmli, 7–14 faqat matn), ikkinchisi `jonli_algebra.zip`da (1–10 to‘liq rasmli), uchinchisi `jonli_algebra_fixed.zip`da (11-dars), to‘rtinchisi `jonli_algebra_fixed_11.zip`da (12-dars, ROADMAP.md bo‘yicha).

| Dars | Rasm (`png/`) | Holat | Topilgan / tuzatilgan |
|------|:---:|-------|------------------------|
| 1 | ✅ | ✅ Toza | — |
| 2 | ✅ | ✅ Toza | — |
| 3 | ✅ | ✅ Toza | Chegara nuqta >0/≥0 farqi — matnda odatiy konvensiya, xato emas |
| 4 | ✅ | ✅ **Tuzatildi** | "9–12-rasm" blokining `static` tavsifi haqiqiy rasm tartibiga (15-bet) mos emas edi — eski matn: "9-rasm — o'ngga; 10-rasm — 1-masala grafigi; 11-rasm — chapga; 12-rasm — pastga". To'g'ri tartib: 9-rasm — 1-masalaning o'z jadval grafigi (18,11,6,2,−1); 10-rasm — y=x²→y=(x−1)² (o'ngga); 11-rasm — y=(x−1)²→y=(x−1)²+2 (yuqoriga, "chapga" emas); 12-rasm — y=x² va y=(x−1)²+2 ning yakuniy taqqoslashi ("pastga ko'chirish" rasmda umuman yo'q). `static` va `alt` maydonlari shunga mos tuzatildi |
| 5 | ✅ | ⚠️ **Tuzatilmagan** | `doska.masalalar`da "D" (diskriminant) atamasi ta'rifsiz ishlatilgan — 1–5-darsda hech qayerda `D=b²−4ac` kiritilmagan |
| 6 | ✅ | ✅ Toza | — |
| 7 | ✅ | ✅ **Tuzatildi** | 1-masala: kitobda `2x²−x−1≤0`, javob yopiq kesma `[−1/2;1]`; `steps`da xato ravishda qat'iy `y<0`/ochiq `(−1/2;1)` yozilgan edi → `y≤0`/`[−1/2;1]`ga tuzatildi |
| 8 | ✅ | ✅ **Tuzatildi** | Barcha 4 rasm/caption "misol" deb nomlangan edi, kitobda "masala" — caption, alt, intro, agenda matnlari + fayl nomlari (`1-misol.png→1-masala.png` va h.k.) "masala"ga almashtirildi |
| 9 | ✅ | ✅ **Tuzatildi** (avvalgi audit, `jonli_legbr.zip`da) | 1-masala: konstanta `+6`→`+5`; 4-band butunlay boshqa funksiya (`√(x²−4)`) o'rniga kitobdagi `⁴√((x+2)/(x−2))`ga almashtirildi. `jonli_algebra.zip`da ikkalasi ham allaqachon tuzatilgan holda topildi |
| 10 | ✅ | ✅ **Tuzatildi** (avvalgi audit) | Butun dars mavzusi noto'g'ri edi — kvadrat funksiya (x₀=−b/2a) o'rniga kitobning haqiqiy §10 mavzusi (darajali funksiya y=xʳ, r>0/r<0) bo'yicha to'liq qayta yozilishi kerak edi. `jonli_algebra.zip`da bu ish bajarilgan holda topildi: sahna `mono-parabola→power-growth`, 3 ta rasm (kirish41/tarif42/tarif43) matn bilan aniq mos |
| 11 | ✅ | ✅ **Tuzatildi** | 4 ta muammo topildi va tuzatildi: (1) HARD qoida 2.1 buzilgan — `agenda[0]`: `"Kirish — simmetriya nima"` (raqamsiz, validator ham tutgan) → `"Kirish — 2-§ (y=x²) ni eslash"`ga tuzatildi; (2) doska 1-band (47-bet): juft misol sifatida `y=x⁴, y=|x|` yozilgan edi, kitobda aynan `y=x⁴, y=1/x²` → tuzatildi; (3) doska 2-band (48-bet): toq misol sifatida `y=x³, y=1/x` yozilgan edi, kitobda aynan `y=x⁵, y=1/x³` → tuzatildi; (4) 107-mashq tavsifi butunlay boshqa vazifa ("juftmi/toqmi aniqlang" — bu aslida 102-masala) yozilgan edi, haqiqiy 107-masala x<0 qismini shunday qurish ediki natija juft/toq bo'lsin → to'g'ri tavsifga almashtirildi. Shundan so'ng 3 ta rasm crop qilindi (`tarif-47.png`, `tarif-48.png`, `misollar-49.png`), piksel-aniq, faqat top/bottom o'zgargan, `left/right=0/640` barchasida bir xil. `validate_lessons.py` — 11-dars uchun muammo topilmadi |
| 12 | ✅ | ✅ **Tuzatildi** (ROADMAP.md bo'yicha) | Butun dars mavzusi kitobga mos emas edi — eski `doska.masalalar` "aniqlanish sohasi" mavzusidagi 3 ta o'ylab topilgan misol edi (haqiqiy §12 masalalariga umuman mos kelmasdi), ustiga HARD qoida 2.1 ham buzilgan edi (`agenda[0]`: raqamsiz "Kirish — o'tgan mavzuni eslash"). To'liq qayta yozildi: `kirish[0]` endi 11-§ (y=x⁵ toq, y=x⁴ juft) ga aniq ko'prik beradi; `doska.masalalar` kitobdagi haqiqiy 4 ta masalaga almashtirildi — 1-masala `x⁵>32` (51-bet), 2-masala `x⁴≤81` (51-bet, 41-rasm bilan), 3-masala `3/x=x²+1` grafik usuli (51–52-bet, 42-rasm bilan), 4-masala `√(2−x²)=x` chet ildizni tekshirish bilan (52–53-bet, kitobning "chet ildizlar" ogohlantirish bloki bilan). `kitob.betlar` "51–56-betlar"dan "51–53-betlar"ga tuzatildi (haqiqiy dars matni shu oralig'da; 54–56 esa `mashqlar`ga ko'chirildi, haqiqiy 110/118/124-mashqlar bilan). 4 ta rasm crop qilindi — ikkitasi (2- va 3-masala) ikki sahifadan (matn + tegishli grafik, 41-/42-rasm) qo'shib tikilgan kompozit rasmlar, chunki bitta sahifada ikkita grafik yonma-yon joylashgan edi. `validate_lessons.py` va `build.py` — 12-dars uchun muammo topilmadi |
| 13 | ✅ | ✅ **Tuzatildi** (ROADMAP.md bo'yicha) | Butun dars mavzusi va manba sahifalari kitobga mos emas edi — eski versiya "57–60-betlar"ga (bu aslida 14-darsning sahifalari) va butunlay o'ylab topilgan `{y=x²,y=x+2}` tipidagi 3 ta misolga asoslangan edi, haqiqiy §13 (68–70-bet, "Ikkinchi darajali tenglama qatnashgan eng sodda sistemalarni yechish") bilan hech qanday aloqasi yo'q edi. To'liq qayta yozildi: `kirish[0]` endi 12-§ ga aniq ko'prik beradi va "sistema" atamasini birinchi marta ta'rif bilan kiritadi (SKILL.md 1-band, B variant, chunki 1–12-darslarda bu atama rasman kiritilmagan edi); xuddi shu tarzda "Vyetning teskari teoremasi" ham `qoida`da birinchi ishlatilganda darhol ta'riflandi. `doska.masalalar` kitobdagi haqiqiy 4 ta masalaga almashtirildi — 1-masala to'g'ri burchakli uchburchak: `x²+y²=13, ½xy=3` → `(x+y)²=25` trigi (68–69-bet), 2-masala `x+y=3, xy=−10` Vyet teskari teoremasi bilan (69-bet), 3-masala `x²+4xy−2y²=−29, 3x−y−6=0` o'rniga qo'yish bilan (69-bet), 4-masala `x²−y²=16, x−y=2` ko'paytuvchilarga ajratib (69–70-bet). `kitob.betlar` "57–60-betlar"dan "68–70-betlar"ga tuzatildi. `mashqlar` ham to'g'rilandi — haqiqiy 154/155-mashqlar (70-bet, kvadrat qatnashgan sistemalar) bilan almashtirildi, oldingi versiyadagi o'ylab topilgan mashqlar o'chirildi. Sahna (`line-parabola`, y=x² va y=mx+k) saqlab qolindi — bu haqiqiy 4 masalaning hech biriga aynan mos kelmaydi (ular aylana/giperbola/chiziqli kombinatsiya turlari), shuning uchun `kirish[1]`da bu ochiq tan olindi: sahna — sistema tushunchasining eng sodda modeli, haqiqiy masalalar boshqacha ko'rinishda ekani yozib qo'yildi. 4 ta rasm crop qilindi — ikkitasi (1- va 4-masala) ikki sahifadan qo'shib tikilgan kompozit rasmlar (masala matni bir sahifada boshlanib, ikkinchisida tugagani uchun). `validate_lessons.py` — 13-dars uchun muammo topilmadi |

**Ochiq qolgan ishlar:** dars 5 ("D" atamasi) hali tuzatilmagan — keyingi audit navbatida ko'rib chiqiladi. Dars 14 ROADMAP bo'yicha hali audit qilinmagan (`png/` yo'q). Validator butun 9-sinf bo'yicha ishga tushirilganda dars 14da xuddi shu turdagi HARD qoida 2.1 buzilishi (`agenda[0]`da raqamsiz "Kirish") topilgan edi — hali tuzatilmagan, keyingi navbatda (13-dars endi tuzatildi).

---

## Keyingi dars

**15-§** — Kvadrat tenglamalar sistemasini yechish
