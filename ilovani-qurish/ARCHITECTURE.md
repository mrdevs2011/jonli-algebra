# Arxitektura (qisqa)

## Qatlamlar

1. **Ma’lumot** — `js/darslar.js` (38 dars + 5 bob nomlari, dashboard uchun)
2. **Holat** — `js/progress.js` (`readyIds` + localStorage)
3. **Ko‘rinish**
   - Dashboard: `index.html` + `js/dashboard.js`
   - Dars: `lessons/math/9/N/index.html` (shablon, o‘zgarmaydi) + `lessons/math/9/N/data.json` (mazmun) + `css/dars.css`
4. **Uslub** — `css/base.css` (umumiy), `dashboard.css`, `dars.css`
5. **Sahna komponentlari** — `js/sahna-*.js` (masalan `sahna-abc-parabola.js`), `data.json`dagi `sahna.type` orqali tanlanadi
6. **Qurish hujjatlari** — `ilovani-qurish/`

## Dars papkasi ichida (lessons/math/9/N/) — YANGI (2026-09-09)

```
lessons/math/9/N/
  index.html      ← BUILD QILINGAN fayl. Qo‘lda tahrirlanmaydi.
  data.json       ← Darsning butun mazmuni (sof JSON). Shu faylni tahrirlaysiz.
  png/            ← Shu darsning rasmlari (kitob-bet, masala croplari).
```

`index.html` endi 38 ta darsning barchasida **bir xil, umumiy shablon**
(`build/dars-template.html` dan quriladi). U hech qanday matn/rasm/savol
saqlamaydi — faqat `lessons/math/9/N/data.json`ni o‘qib chizadi.

**Nega fetch() emas:** loyiha `file://` orqali, internetsiz ochilishi shart.
Brauzer xavfsizlik siyosati (CORS) `file://` da `fetch("data.json")`ni
bloklaydi. Shu sababli build vaqtida JSON `index.html` ICHIGA
(`<script type="application/json" id="dars-data">`) joylashtiriladi —
tarmoq so‘rovi umuman bo‘lmaydi, lekin siz hamon sof `data.json` bilan ishlaysiz.

**Qanday build qilinadi:**

```bash
python3 build/build.py       # barcha darslarni qayta quradi
python3 build/build.py 4     # faqat 4-darsni quradi
```

`lessons/math/9/N/data.json`ni o‘zgartirgandan keyin shu buyruqni ishga tushirmasangiz,
`lessons/math/9/N/index.html` eskirgan holicha qoladi.

## Qoidalar

- Har dars o‘z papkasida yashaydi
- Umumiy o‘zgarish faqat CSS/JS ildizda
- Yangi framework qo‘shilmaydi
- Internet shart emas
- Bitta dars o‘zgarganda boshqalarga tegilmaydi

## Dars ochilish oqimi (YANGI)

1. `lessons/math/9/N/data.json` yoziladi — matn, savollar, doska qadamlari, `sahna` konfiguratsiyasi
2. Agar mavjud sahna turi (masalan `abc-parabola`) yetarli bo‘lmasa,
   `js/sahna-<yangi-tur>.js` yoziladi va `window.KA_SAHNA["<tur>"] = function(stage, cfg) {...}`
   sifatida ro‘yxatdan o‘tkaziladi (`js/sahna-abc-parabola.js` namuna)
3. Rasmlar `lessons/math/9/N/png/` ichiga qo‘yiladi
4. `python3 build/build.py N` — `lessons/math/9/N/index.html` quriladi
5. Sinovdan o‘tadi (`build/test-render.js N` — jsdom bilan avtomatik tekshiruv, ixtiyoriy)
6. `readyIds` ga `N` qo‘shiladi
7. `STATUS.md` yangilanadi

## Sahna turlari (kengaytiriladigan)

- `abc-parabola` — y = ax² + bx + c, uchta slayder + jonli grafik (1-§ da ishlatilgan;
  2-§, 3-§, 4-§ ham xuddi shu turdan, boshqa boshlang‘ich qiymatlar bilan foydalanishi mumkin)
- Yangi dars turlicha sahna talab qilsa (masalan trigonometriya aylanasi,
  progressiya ustunlari) — yangi `sahna-*.js` fayli qo‘shiladi. Boshqa
  darslarning sahna kodiga tegilmaydi.

## Keyin qo‘shilishi mumkin (lekin shart emas)

- Boshqa sahna turlari: `sahna-unit-circle.js`, `sahna-progression.js` va h.k.
- Print CSS

Hozircha kerak emas. Poydevor yetarli.
