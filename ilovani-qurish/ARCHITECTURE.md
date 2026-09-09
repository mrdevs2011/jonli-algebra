# Arxitektura (qisqa)

## Qatlamlar

1. **Ma’lumot** — `js/darslar.js` (38 dars + 5 bob)
2. **Holat** — `js/progress.js` (`readyIds` + localStorage)
3. **Ko‘rinish**
   - Dashboard: `index.html` + `js/dashboard.js`
   - Dars: `N/index.html` + `css/dars.css`
4. **Uslub** — `css/base.css` (umumiy), `dashboard.css`, `dars.css`
5. **Qurish hujjatlari** — `ilovani-qurish/`

## Qoidalar

- Har dars o‘z papkasida yashaydi
- Umumiy o‘zgarish faqat CSS/JS ildizda
- Yangi framework qo‘shilmaydi
- Internet shart emas
- Bitta dars o‘zgarganda boshqalarga tegilmaydi

## Dars ochilish oqimi

1. Odam / AI `N/index.html` dagi `#sahna` ni to‘ldiradi
2. Matn bloklari yoziladi
3. Sinovdan o‘tadi
4. `readyIds` ga `N` qo‘shiladi
5. `STATUS.md` yangilanadi

## Keyin qo‘shilishi mumkin (lekin shart emas)

- `js/dars-common.js` — umumiy slayder/canvas yordamchilari
- Oddiy SVG iconlar
- Print CSS

Hozircha kerak emas. Poydevor yetarli.
