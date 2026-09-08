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

## Dars ichidagi bloklar

Tavsiya etilgan tartib:

```html
<section class="stage" id="sahna">…</section>

<section class="dars-body">
  <div class="block block-kirish">…</div>
  <div class="block block-qoida">…</div>
  <div class="block block-savollar">…</div>
  <div class="block block-eslab">…</div>
</section>
```

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
