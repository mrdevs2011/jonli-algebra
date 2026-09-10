 # ROADMAP — jonli_algebra darslarni to'g'irlash (5,6,8,10,12,13,14)

Manba: `kitob/kitob-N.png`. Har dars uchun: sahna + kirish + qoida + doska + xulosaBoard + kitob.betlar/sahifalar — HAMMASI bir xil haqiqiy misolga mos bo'lishi SHART. Keyin crop.md bo'yicha rasm qirqiladi.

Tartib: 5 → 6 (faqat 3-masala) → 8 → 10 → 12 → 13 → 14 → so'ng 7,9,11 crop (matn allaqachon to'g'ri).

---

## 5-DARS — §5 "Grafigini yasash" (18-22-bet)
- `kitob.betlar`: "18–22-betlar"
- `kitob.sahifalar`: kitob-18, 19, 20, 21, 22
- Sahna misoli: **y = x² − 4x + 3** (a=1,b=-4,c=3, uch (2;-1), nollar 1 va 3)
- `doska.masalalar`:
  1. Besh qadam (usul) · 18-bet — umumiy formula, o'zgarmaydi
  2. 1-masala: y = x² − 4x + 3 · 18-bet
  3. 2-masala: y = −2x² + 12x − 19 · 19-bet
  4. 3-masala: y = −x² + x + 6 · 20-bet
  5. 4-masala: ikkita musbat son, yig'indi kvadratlari min · 21–22-bet
- `kirish[1]` ni yangi misolga moslash ("Namuna sahnada ham shu: y = x²−4x+3")
- Crop: har masala uchun alohida PNG, `png/` papkaga

## 6-DARS — faqat 3-masala tuzatiladi (26-bet)
- 1,2-masala o'zgarmaydi (24,25-bet — to'g'ri)
- 3-masala matni: **−3x² − 5x + 2 > 0** → 3x²+5x−2<0, ildizlar **1/3 va −2**, javob **(−2; 1/3)**
- `kitob.sahifalar`ga kitob-26 borligini tekshirish, betlar diapazoni tasdiqlash
- Crop: faqat 3-masala rasmi qayta qirqiladi

## 8-DARS — §8 "Intervallar usuli" (32-35-bet)
- `kitob.betlar`: "32–35-betlar"
- `doska.masalalar`:
  1. Usul · 32-bet
  2. 1-misol: x² − 4x + 3 · 32–33-bet
  3. 2-misol: x³ − x < 0 · 34-bet
  4. 3-misol: (x²−9)(x+3)(x−2) > 0 · 34–35-bet
  5. 4-misol: (x²+2x−3)/(x²−3x−4) ≥ 0 · 35-bet
- Sahna/kirish shu 4 misolga moslashtiriladi
- Crop: 5 blok uchun alohida rasm

## 10-DARS — §10 "O'sish va kamayish" (41-43-bet)
- `kitob.betlar`: "41–43-betlar"
- `doska.masalalar`:
  1. §10 sarlavha/kirish matni · 41-bet
  2. Ta'rif (o'suvchi funksiya, r>0) · 42-bet
  3. Ta'rif (kamayuvchi funksiya, r<0) · 43-bet
- Mavzu: darajali funksiya y=x^r ning o'sish/kamayishi (kvadrat funksiya emas!)
- Crop: ta'rif bloklari uchun rasm

## 12-DARS — §12 "Daraja qatnashgan tengsizlik va tenglamalar" (51-53-bet)
- `kitob.betlar`: "51–53-betlar"
- `doska.masalalar`:
  1. 1-masala: x⁵ > 32 · 51-bet
  2. 2-masala: x⁴ ≤ 81 · 51-bet
  3. 3-masala: 3/x = x² + 1 · 51–52-bet
  4. 4-masala: √(2−x²) = x · 52–53-bet
- Crop: 4 masala uchun alohida rasm

## 13-DARS — §13 "Ikkinchi darajali tenglama qatnashgan eng sodda sistemalarni yechish" (68-70-bet)
- MUHIM: oldingi audit "manba yo'q" degan edi — XATO, sahifa 68 dan boshlanadi (61 emas)
- `kitob.betlar`: "68–70-betlar"
- `doska.masalalar`:
  1. 1-masala: x²+y²=13, ½xy=3 · 68–69-bet
  2. 2-masala: x+y=3, xy=−10 · 69-bet
  3. 3-masala: x²+4xy−2y²=−29, 3x−y−6=0 · 69-bet
  4. 4-masala: x²−y²=16, x−y=2 · 69–70-bet
- Crop: 4 masala uchun alohida rasm

## 14-DARS — §14 "Tenglamalar sistemasini yechishning turli usullari" (72-73-bet)
- `kitob.betlar`: "72–73-betlar"
- `doska.masalalar`:
  1. 1-masala: x+y+2xy=10, x+y−2xy=−2 · 72-bet
  2. 2-masala: x−y²=3, xy²=28 · 72–73-bet
  3. 3-masala: x+y=12, 1/x+1/y=3/8 · 73-bet
  4. 4-masala: x³−y³=7, x²y−xy²=2 · 73-bet
- Crop: 4 masala uchun alohida rasm

## 7, 9, 11-DARS — matn to'g'ri, faqat crop qilinadi
- Tegishli kitob sahifalarini aniqlab, mavjud data.json bo'yicha crop.md jarayonini bajarish

---

## Har dars uchun bajarish tartibi
1. Kitob sahifalarini `view` bilan tekshirish (allaqachon bajarilgan yuqorida)
2. `data.json`ni to'liq qayta yozish: sahna, kirish, qoida, doska, xulosaBoard, kitob.betlar/sahifalar
3. `validate_lessons.py` ishga tushirish
4. crop.md bo'yicha piksel-aniq crop, `png/` ga saqlash, `data.json`ga img/alt/width/height qo'shish
5. Foydalanuvchiga ko'rsatish, tasdiqlash, keyingi darsga o'tish
