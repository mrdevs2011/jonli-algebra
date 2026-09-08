# AI uchun yoriqnoma — Ko‘rinadigan Algebra

Bu hujjat **AI agentlar** (Grok, Claude, ChatGPT, Cursor va boshqalar) uchun yozilgan.  
Odam yoriqnomasi: `../YORIQNOMA.md`

---

## 1. Loyiha nima?

9-sinf algebra (Alimov va boshq. 2019) tartibida **vizual, interaktiv** darslar.

- Har dars = 1 paragraf = 1 papka (`1/index.html` … `38/index.html`)
- Internet shart emas
- Kitob matni **ko‘chirilmaydi**
- Avval chizma, keyin formula

---

## 2. Qattiq qoidalar (buzilmasin)

1. **Bitta dars = bitta g‘oya.** 3–4 qoidadan oshmasin.
2. **Avval ko‘rinadi.** Formula chizmadan oldin chiqmasin.
3. **Matn qisqa.** Kirish 3–4 jumla, qoida 1–2 jumla, savollar 3 ta.
4. **Boshqa papkalarga tegilmasin.** Faqat ochilayotgan darsning `index.html` va kerak bo‘lsa `js/progress.js` o‘zgartiriladi.
5. **CSS o‘zgaruvchilaridan chiqilmasin.** Ranglar faqat `css/base.css` dagi `:root` dan.
6. **Login, ball, reklama, tracking yo‘q.**
7. **Shoshilish yo‘q.** Bir seansda odatda 1 dars (yoki uning faqat sahnasini).

---

## 3. Dars yozish tartibi (AI uchun)

### Qadam 1 — Maqsadni aniqlash
`js/darslar.js` dagi mos yozuvni o‘qing:
- `nom`, `qisqa`, `vizual`

### Qadam 2 — Faqat `#sahna`
- Canvas yoki SVG + oddiy JS
- Slayder / tugma bo‘lsa, harakatda kamida 1 ta yozuv yoki rang o‘zgarsin
- Formula dastlab yashirin yoki ikkinchi qadamda chiqsin
- Telefon ekranida ham o‘qiladigan bo‘lsin

### Qadam 3 — Matn bloklari
Tartib:
1. Kirish (3–4 jumla)
2. Jonli qoida (chizmaga bog‘langan)
3. 3 ta savol (A/B/C, darhol javob)
4. 3 ta “Eslab qol”

### Qadam 4 — Tayyor deb belgilash
Faqat dars sinovdan o‘tgach:
```js
// js/progress.js ichida
function readyIds() {
  return [4]; // masalan
}
```

---

## 4. Fayl tuzilmasi (o‘zgartirilmasin)

```
/
├── index.html
├── css/
│   ├── base.css
│   ├── dars.css
│   └── dashboard.css
├── js/
│   ├── darslar.js      ← dars nomlari (faqat kerak bo‘lsa tahrir)
│   ├── progress.js     ← readyIds shu yerda
│   └── dashboard.js
├── 1/ … 38/
│   └── index.html
├── YORIQNOMA.md
├── README.md
└── ilovani-qurish/     ← bu papka
    ├── AI.md
    ├── STATUS.md
    └── …
```

---

## 5. Uslub va texnika

### HTML
- `lang="uz"`
- `#sahna` id saqlansin
- Footer da oldingi/keyingi dars havolalari saqlansin

### CSS
- Yangi stil kerak bo‘lsa avval `dars.css` ga qo‘shing
- Ranglar: `--accent`, `--accent-2`, `--gold`, `--ink`, `--paper` …

### JS
- Global ifloslantirmang
- `window.KA` va `window.KA_DARSLAR` ni buzmang
- Interaktivlik oddiy bo‘lsin (vanilla JS)

### Interaktivlik misollari
- `a`, `b`, `c` slayderlari → parabola real vaqtda
- Nuqta sudraladi → formula o‘zgaradi
- Ishora zanjiri → plus/minus almashtiriladi
- Aylana + burchak → sinus/kosinus

---

## 6. Nima qilmaslik kerak

- Kitobdagi mashqlarni to‘liq ko‘chirish
- Uzoq isbot yozish
- Bir seansda 3+ dars ochish
- Boshqa dars papkasiga “yordam” deb o‘zgartirish kiritish
- Yangi framework (React, Vue, Tailwind) qo‘shish
- localStorage dan boshqa storage ishlatish

---

## 7. STATUS.md ni yangilash

Har dars tayyor bo‘lgach `STATUS.md` ni yangilang:
- Tayyor darslar ro‘yxati
- Keyingi dars
- Oxirgi o‘zgarish sanasi

---

## 8. Birinchi dars tavsiyasi

**4-§** — `y = ax² + bx + c`

Sabab: 2-§ va 3-§ shu slayder ichida ham ko‘rinadi.  
Keyin 2, 3, 1, 5 ketma-ketligi tabiiy keladi.

---

## 9. Qisqa buyruq namunasi (odam AI ga aytishi mumkin)

> “4-§ darsini yoz. Faqat `#sahna` ni interaktiv qil. Matnni hali yozma. YORIQNOMA va AI.md ga rioya qil.”

yoki

> “4-§ ni to‘liq yozib tugat. readyIds ga qo‘sh. STATUS.md ni yangila.”

---

**Eslab qol:**  
Poydevor mustahkam. Har dars alohida, puxta, sekin.  
Sifat > tezlik.
