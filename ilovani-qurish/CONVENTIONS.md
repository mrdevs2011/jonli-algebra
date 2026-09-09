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

## Darslik sahifasi (block-kitob)

Har dars papkasida darslikning tegishli beti(lari) rasm sifatida saqlanadi:

```
4/kitob-14.png        # darslik, 14-bet (200 dpi PNG)
```

`index.html`da:

```html
<div class="block block-kitob">
  <h2>Darslikda</h2>
  <p>Alimov, Xolmuhamedov, Mirzaahmedov — 9-sinf algebra (2019): <strong>4-§, 14-bet</strong>.</p>
  <div class="kitob-sahifalar">
    <a class="kitob-sahifa" href="kitob-14.png" target="_blank" rel="noopener">
      <img src="kitob-14.png" alt="Darslik, 14-bet" loading="lazy" width="620" height="877">
      <span>14-bet · kattalashtirish</span>
    </a>
  </div>
</div>
```

Bir necha bet kerak bo‘lsa (masalan 1-§, 5–6-betlar), har bir bet uchun alohida
`kitob-<bet>.png` va alohida `<a class="kitob-sahifa">` qo‘shiladi — ro‘yxat avtomatik
qatorga tizilib chiqadi.

Rasm PDF darslikdan ~200 dpi’da olinadi, faqat shu darsga tegishli sahifa(lar).
Boshqa darsning betini qo‘shmaslik kerak.

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
