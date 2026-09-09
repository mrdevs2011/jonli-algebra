# Kod va uslub qoidalari

## Nomlash

- Papkalar: `1`, `2`, … `38` (raqam)
- Asosiy fayl: `index.html`
- CSS o‘zgaruvchilar: kebab-case (`--accent-2`)
- JS funksiyalar: camelCase
- ID lar: kebab yoki camel (`#sahna`)

## HTML

- `lang="uz"`
- Har darsda `#sahna` bo‘lishi shart
- Footer da oldingi / keyingi dars havolalari saqlansin
- Yangi elementlar uchun semantik teglar (`section`, `h2` …)

## CSS

- Ranglar faqat `css/base.css` dagi `:root` dan olinadi
- Yangi stil kerak bo‘lsa avval `dars.css` ga yoziladi
- Media query: mobil uchun `max-width: 720px` / `860px`
- Shadow, radius, fontlar o‘zgaruvchilar orqali

## JavaScript

- Vanilla JS (framework yo‘q)
- Global: faqat `window.KA`, `window.KA_DARSLAR`, `window.KA_BOBLAR`
- localStorage kaliti: `"korinadigan-algebra-progress"`
- Xatolikni yutib yuborish (try/catch) — private mode uchun
- Interaktivlik oddiy va tushunarli bo‘lsin

## Dars ichidagi bloklar — ENDI `lessons/math/9/N/data.json` ORQALI (2026-09-09 dan)

**`lessons/math/9/N/index.html` endi qo‘lda tahrirlanmaydi.** U `build/dars-template.html`
dan `python3 build/build.py N` bilan avtomatik quriladi. Dars mazmuni
faqat `lessons/math/9/N/data.json` da yoziladi:

```json
{
  "id": 4,
  "title": "…",
  "kirish": ["<p>…</p>"],
  "qoida": "<p>…</p>",
  "savollar": [ { "savol": "…", "variantlar": ["…","…","…"], "togri": 0 } ],
  "eslabQol": ["…", "…"],
  "sahna": { "type": "abc-parabola", "vars": { "a": {...}, "b": {...}, "c": {...} } }
}
```

To‘liq maydonlar ro‘yxati uchun `lessons/math/9/1/data.json`ga qarang — u ishlaydigan namuna.
JSON o‘zgartirilgach, albatta:

```bash
python3 build/build.py 4
```

buyrug‘i ishga tushiriladi, aks holda `4/index.html` eskirgan holicha qoladi.

## Darslik sahifasi (block-kitob) va rasmlar

Har dars papkasida rasmlar endi **`png/` ichki papkasida** saqlanadi:

```
4/png/kitob-14.png        # darslik, 14-bet (200 dpi PNG)
4/png/kitob-14-masala1.png
```

`data.json`da:

```json
"kitob": {
  "betlar": "14-bet",
  "sahifalar": [
    { "img": "png/kitob-14.png", "bet": "14-bet", "width": 620, "height": 877 }
  ]
}
```

Bir necha bet kerak bo‘lsa (masalan 1-§, 5–6-betlar), `sahifalar` massiviga
har bir bet uchun alohida obyekt qo‘shiladi — ro‘yxat avtomatik qatorga tizilib chiqadi.

Doska namunalari xuddi shunday, `doska.masalalar[].img` maydonida `png/…` yo‘li bilan.

Rasm PDF darslikdan ~200 dpi’da olinadi, faqat shu darsga tegishli sahifa(lar).
Boshqa darsning betini qo‘shmaslik kerak.

## Feature yoqish/o‘chirish (har dars alohida)

Ba’zi darslarda `picker`, `classtimer`, `agenda`, `xulosaBoard` yoki `board`
(o‘qituvchi doska rejimi tugmasi) kerak bo‘lmasligi mumkin — masalan
1-darsda ham, 10-darsda ham, istalgan kombinatsiyada, bir-biriga bog‘liq
emas. `data.json`ga shu darsga xos qo‘shiladi:

```json
"features": {
  "classtimer": false,
  "picker": false
}
```

Yozilmagan feature — default yoqilgan. `false` qo‘yilgan blok
`python3 build/build.py N` ishga tushganda o‘sha darsning `index.html`
faylidan **butunlay** olib tashlanadi (comment emas — DOM’da umuman yo‘q).
Boshqa darslarga ta’sir qilmaydi.

Noto‘g‘ri nom yozsangiz (masalan `"stopwatch"`), build xato beradi va
mavjud nomlar ro‘yxatini ko‘rsatadi — `build/lesson_schema.py`dagi
`FEATURE_TOGGLES` shu ro‘yxatning yagona manbasi.

Yangi o‘chirib bo‘ladigan feature qo‘shish (masalan yangi utility
`js/features/yangi.js` yozsangiz va uni ham o‘chirib bo‘lishini
xohlasangiz):

1. `build/lesson_schema.py` → `FEATURE_TOGGLES` ga qator qo‘shing
   (`"yangi": "html"` — statik HTML blok bo‘lsa, `"yangi": "js"` —
   `board.js` kabi JS orqali dinamik qo‘shiladigan bo‘lsa)
2. `"html"` bo‘lsa: `build/dars-template.html`da mos qismni
   `<!--#feature:yangi-->...<!--/feature:yangi-->` bilan o‘rang
3. `"js"` bo‘lsa: `js/features/yangi.js` ichida `board.js`dagi
   `featureEnabled()` namunasi bo‘yicha `#dars-data`dan
   `features.yangi`ni o‘qib tekshiring

## Progress

Dars to‘liq tayyor bo‘lgach **faqat**:

```js
// js/progress.js
function readyIds() {
  return [4, 2, 3]; // tartib muhim emas, lekin odatda ochilish tartibida
}
```

Boshqa joyga “tayyor” degan bayroq qo‘yilmasin.

## Til

- Barcha interfeys matnlari o‘zbekcha
- Formula va matematik belgilar odatdagidek (`x²`, `ax² + bx + c`)
