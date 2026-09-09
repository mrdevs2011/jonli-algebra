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
4. Agar yangi **umumiy funksiya** kerak bo‘lsa (har darsda bir xil ishlaydigan
   narsa — masalan yangi tugma, statistika, effekt): `js/features/<nomi>.js`
   yoziladi (o‘z ichida `(function(){...})()` bilan o‘ralgan bo‘lishi shart).
   Shablonga (`dars-template.html`) tegish SHART EMAS — `build/build.py`
   uni avtomatik `js/features.js` bundle ichiga qo‘shadi (pastga qarang).
5. `bash build/verify.sh N` — **BITTA komanda**, uchta bosqichni ketma-ket bajaradi:
   - `build/build.py N` — `data.json`ni schema bo‘yicha tekshiradi (majburiy
     maydonlar, `sahna.type` ro‘yxatda bormi, rasm fayllari mavjudmi,
     `savollar[].togri` chegara ichidami) va shundan keyingina
     `lessons/math/9/N/index.html`ni quradi. Schema xatosi bo‘lsa **build
     to‘xtaydi** — eski/yo‘q `data.json` jimgina o‘tkazib yuborilmaydi.
   - `build/check_lessons.sh` — umumiy JS fayllar (picker/classtimer/xulosa-board)
     ulanganmi va `index.html` `data.json`dan eskirib qolmaganmi, tekshiradi.
   - `build/run-all-render-tests.js` — jsdom bilan `data.json`ga mos ravishda
     DINAMIK tekshiradi (nechta savol/kitob-sahifa/doska-masala bo‘lishi
     kerakligini `data.json`dan o‘qiydi — har dars uchun qo‘lda test yozish
     shart emas) va runtime JS xatosi yo‘qligini tasdiqlaydi.

   Birinchi ishlatishda `npm install` kerak (jsdom `package.json`da yozilgan).
6. `readyIds` ga `N` qo‘shiladi
7. `STATUS.md` yangilanadi

## Umumiy funksiyalar — js/features.js bundle

Har darsda BIR XIL ishlaydigan utility'lar (random o‘quvchi tanlash,
sinf taymeri, xulosa doskasi, progress, doska/UHB rejimi, kitobni
varaqlash, sahnani kattalashtirish) — bittalab `<script>` qatori sifatida
ulanmaydi. Ular `js/features/` papkasida alohida-alohida fayl sifatida
yashaydi:

```
js/features/
  agenda.js
  board.js
  classtimer.js
  kitob-full.js
  picker.js
  progress.js
  sahna-expand.js
  xulosa-board.js
```

`build/build.py` ishga tushirilganda bularning HAMMASINI **avtomatik**
bitta `js/features.js` fayliga yig‘adi (concat qiladi). `dars-template.html`
esa faqat BITTA qatorga ega:

```html
<script src="../../../../js/features.js"></script>
```

**Yangi umumiy funksiya qo‘shish uchun butun oqim:**

1. `js/features/<nomi>.js` yozing — `(function () { ... })()` bilan
   o‘rab qo‘ying (global nom to‘qnashuvining oldini olish uchun; barcha
   mavjud feature'lar shu qoidaga amal qiladi)
2. `bash build/verify.sh` ishga tushiring — bu `js/features.js`ni qayta
   quradi va barcha 38 darsda ishlashini tekshiradi
3. Boshqa hech narsaga tegmaysiz — shablon, alohida darslar, hech biri
   o‘zgarmaydi

**`js/features.js`ning o‘zi — BUILD QILINGAN fayl, qo‘lda tahrirlanmaydi**
(xuddi `lessons/math/9/N/index.html` kabi). Manba — `js/features/*.js`.
`build/check_lessons.sh` bundle manba fayllar bilan sinxronligini
tekshiradi (agar `js/features/`ga fayl qo‘shilib, `build.py` ishga
tushirilmasa — aniq ogohlantirish beradi).

**Nega sahna-*.js bu bundlega kirmaydi:** `sahna.type` — har darsda
FARQ QILADIGAN narsa (bitta darsda faqat bitta tur ishlatiladi). Barcha
sahna turlarini har HTML faylga concat qilish shart emas — bu kerak-
siz og‘irlik. Shuning uchun sahna alohida, `data.json`dagi `sahna.type`
orqali tanlanadigan registry sifatida qoladi (yuqoridagi bo‘limga qarang).

**Muhim:** `build/verify.sh` xato bilan tugasa (exit code 1), o‘sha darsni
`readyIds`ga qo‘shmang — birinchi shubhali holatni tuzating.

## Sahna turlari — umumiy motor (js/sahna-base.js)

38 darsda 10+ turli `sahna.type` kutilmoqda (parabola, trigonometriya
aylanasi, progressiya ustunlari, ehtimollik diagrammasi va h.k.). Har
birini noldan yozish katta takrorlanishga olib keladi, chunki ko‘pchiligida
bir xil DOM/SVG mexanikasi bor: koordinata tekisligi, slider↔label bog‘lash
(scrub), pulse animatsiyasi, shablon-eslatma almashtirish.

**`js/sahna-base.js`** — shu umumiy mexanikani bitta joyga jamlaydi:

| Funksiya | Nima qiladi |
|---|---|
| `KA_SAHNA_BASE.createPlane(svg, opts)` | SVG koordinata tekisligi + grid + o‘qlar chizadi, `toX(x)`/`toY(y)` konvertatsiya funksiyalarini qaytaradi |
| `KA_SAHNA_BASE.bindScrub(labelEl, sliderEl, opts)` | Formula ichidagi raqamni drag/klaviatura bilan o‘zgartirish — sliderga "input" eventini yuboradi |
| `KA_SAHNA_BASE.pulse(el, state, key, val)` | Qiymat o‘zgarganda label’ga qisqa urg‘u animatsiyasi |
| `KA_SAHNA_BASE.applyNote(el, notes, key, vars)` | `cfg.notes` ichidagi `{a}`, `{b}` kabi shablon o‘rniga qiymat qo‘yadi |
| `KA_SAHNA_BASE.fmtSigned(n)` | Formula ko‘rinishida ishoralarni chiroyli chiqaradi (+3, −5) |

**Bu yerga formula-ga xos hisoblash KIRMAYDI** — `y = ax²+bx+c` yoki
`x = cos(t)` kabi matematika har `sahna-*.js` faylida o‘zi qoladi.
Umumiylashtirilgan faqat DOM/SVG mexanikasi, formula emas.

**Isbotlangan, taxmin emas:** bu abstraction bitta misoldan (parabola)
emas, IKKITA mustaqil formula ustida sinalgan:

- `js/sahna-abc-parabola.js` — 3 slayder (a,b,c), egri chiziq
- `js/sahna-unit-circle.js` — 1 slayder (t, burchak), aylana + radius
  chizig‘i (hozircha placeholder, real darsda ishlatilmayapti — faqat
  base’ning ikkinchi, boshqa geometriyada ham ishlashini ko‘rsatish uchun)

Ikkalasi ham `build/verify.sh` orqali (schema + jsdom render) sinaldi.

**Yangi sahna turi yozish qoidasi:** avval mavjud turlardan biri config
bilan yetarli emasmi tekshiring (masalan `abc-parabola`ni boshqa
min/max/value bilan qayta ishlatib bo‘ladimi). Yetarli bo‘lmasa, yangi
`sahna-*.js` yozing — lekin **`sahna-base.js`dagi funksiyalardan
foydalanib**, koordinata/scrub kodini qayta yozmang. Agar sahnangizga mos
kelmaydigan yangi umumiy pattern chiqsa (masalan doiraviy harakat yoki
ustunli diagramma), uni faqat **kamida 2-chi marta** kerak bo‘lganda
`sahna-base.js`ga qo‘shing — bitta misoldan umumiylashtirish yo‘q.

## Sahna turi registri — qanday tekshiriladi

`js/sahna-*.js` fayllaridagi barcha `window.KA_SAHNA["<tur>"] = ...` yozuvlari
`build/lesson_schema.py`dagi `discover_sahna_types()` funksiyasi tomonidan
build vaqtida avtomatik o‘qiladi. Qo‘lda ikkinchi ro‘yxat yuritilmaydi —
shuning uchun kod va tekshiruv hech qachon bir-biridan uzilib qolmaydi.
Agar `data.json`da yozilgan `sahna.type`ga mos `js/sahna-*.js` topilmasa,
build **shu yerda to‘xtaydi** va qaysi faylni qanday yozish kerakligini
aniq ko‘rsatadi.

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
