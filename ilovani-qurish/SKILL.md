---
name: jonli-algebra-lesson-authoring
description: >
  Use this skill whenever creating or editing a lesson data.json file in
  jonli-algebra (lessons/math/{grade}/{id}/data.json). Enforces hard rules
  for cross-lesson continuity — terminology bridges, agenda references,
  scene (sahna) parameter locking — so lesson N never assumes knowledge
  the student hasn't been given yet, and never repeats content from
  lesson N-1 without acknowledging it.
---

# Jonli Algebra — Lesson Authoring Skill

Bratan, bu skill — qat'iy qoidalar to'plami. "Ijodiy erkinlik" degan narsa
bu yerda yo'q. Har bir dars avvalgisiga zanjir bilan bog'langan bo'lishi
SHART. Quyidagi qoidalarning har biri **HARD** — buzilsa, dars chiqarilmaydi.

## 0. Ishga tushishdan oldin — MAJBURIY tekshiruv

Yangi dars (N-dars) yozishdan oldin, quyidagilarni albatta o'qi:

1. `lessons/math/{grade}/{N-1}/data.json` — to'liq
2. `lessons/math/{grade}/{N-2}/data.json` — kamida `qoida`, `eslabQol`, `sahna`
3. Agar mavjud bo'lsa, `validate_lessons.py` ni ishga tushir va N-1
   darsda ochiq qolgan muammo yo'qligiga ishonch hosil qil

Bu qadam o'tkazib yuborilsa — dars yaroqsiz hisoblanadi, nashr qilinmaydi.

---

## 1. HARD QOIDA — Terminologik ko'prik (Term Bridge)

**Qoida:** Agar N-darsda yangi atama/tushuncha birinchi marta ishlatilsa
(masalan "parabola", "diskriminant", "simmetriya o'qi", "juft funksiya",
"aniqlanish sohasi"), bu atama N-darsning matnida **hech qanday tushuntirishsiz**
paydo bo'lishi MUMKIN EMAS. Ikkita yo'l bor:

- **A variant (afzal):** Atama N-1 (yoki undan oldingi) darsning `qoida`
  yoki `kirish` maydonida bitta jumla bilan oldindan tilga olinadi:
  > "...bu shakl **parabola** deyiladi — keyingi darsda batafsil o'rganamiz."
- **B variant:** Agar A variant iloji bo'lmasa (masalan darslar reja
  bo'yicha alohida yozilayotgan bo'lsa), N-darsning `qoida`sida atama
  birinchi marta ishlatilganda **darhol ta'rif** beriladi — "eslab qolamiz"
  emas, "mana bu — X" formatida, hech qachon oldindan tanish deb faraz
  qilinmaydi.

**Tekshiruv savoli:** "Agar men bu darsni N-1 darsni o'qimagan holda
o'qisam, bu so'zni tushunarmidim?" Javob "yo'q" bo'lsa — qoida buzilgan.

**Muhim cheklov:** Atamani faqat bitta marta, bitta joyda ko'prik qil.
Har bir atama uchun ortiqcha tushuntirish, uzun tarixiy kirish yoki bir
nechta joyda takrorlash — bu darsni cho'zadi, foydasi yo'q. Bitta aniq
jumla yetarli.

---

## 2. HARD QOIDA — Oldingi darsga referens (Backward Reference)

Bu qoidaning ikkita **mustaqil** qismi bor — ikkalasi ham alohida
tekshiriladi. Agenda'da referens borligi `kirish`ni tekshirishdan
OZOD QILMAYDI. Ular ikki xil maydon, ikkalasi ham o'z holicha talabga
javob berishi kerak.

### 2.1. `agenda`dagi "Kirish" qatori

N-darsning `agenda`sidagi birinchi element (odatda "Kirish") har doim
**aniq paragraf yoki dars raqamini** ko'rsatishi kerak, umumiy so'z bilan
emas.

- ✅ To'g'ri: `"Kirish — 2-§ (y=x²) ni bir jumlada eslash"`
- ✅ To'g'ri: `"Kirish — y = x² ni eslash"` (aniq formula ko'rsatilgan bo'lsa yetarli)
- ❌ Xato: `"Kirish — o'tgan mavzuni eslash"` (qaysi mavzu — noaniq)
- ❌ ENG XAVFLI XATO: N-darsning agenda matnida N yoki undan katta raqam
  ko'rinishi — bu deyarli har doim N-1 darsdan nusxa ko'chirishda
  unutilgan xato. Masalan 3-darsda "1-§ ni eslash" turgani — agar unda
  aslida 2-§ nazarda tutilgan bo'lsa, bu **ko'chirish xatosi**.

**Tekshiruv:** Agenda matnidagi har qanday raqam (`\d+-§`) N dan kichik
bo'lishi shart. Agar N yoki undan katta raqam ko'rinsa — DARHOL to'xta,
qo'lda tekshir, bu xato ehtimoli 90%+.

### 2.2. `kirish` maydonining BIRINCHI paragrafi — MAJBURIY ko'prik jumla

**Bu eng ko'p buzilgan qoida edi, shuning uchun endi qat'iy format
beriladi.** N-dars uchun `kirish[0]` (massivning birinchi elementi)
quyidagi shartlarning KAMIDA BITTASIGA to'g'ridan-to'g'ri mos kelishi
SHART, N=1 bo'lgan holatdan tashqari:

- Ichida `N-1-§`, `N-1-dars`, yoki oldingi darsning haqiqiy paragraf
  raqamiga ishora bo'lishi ("2-§ da", "1-darsda" kabi), **YOKI**
- Ichida quyidagi tayanch iboralardan biri so'zma-so'z bo'lishi:
  `"o'tgan darsda"`, `"oldingi darsda"`, `"eslaymiz"`, `"ko'rdik"`,
  `"ko'rgan edik"`, `"ko'rganimizdek"` — va bu ibora **oldingi darsning
  aniq faktiga yoki formulasiga** biriktirilgan bo'lishi (shunchaki
  "oldingi darsda" deb yozib, keyin unga umuman aloqasi bo'lmagan
  yangi mavzuga o'tish HAM XATO — bog'lovchi so'z bilan **haqiqiy fakt**
  birga kelishi kerak).

**Yozib chiqilgan namunaviy qolip (shunga o'xshab yoz, lekin so'zma-so'z
nusxa ko'chirma):**

> "`O'tgan darsda [N-1-darsning asosiy fakti/formulasi] ko'rdik. Bugun
> [shu faktga tayanib / undan farqli o'laroq] [N-darsning yangi g'oyasi]
> ni o'rganamiz.`"

**Test — o'zingdan so'ra, aniq JAVOB ber (taxmin emas):**
1. `kirish[0]` ichida N-1 darsning **kamida bitta** aniq faktiga
   (atama, formula, xulosa) ishora bormi? (ha/yo'q)
2. Agar yo'q bo'lsa — bu qoida buzilgan, `kirish[0]`ni qayta yoz.

**Haqiqiy misol — BUZILGAN holat (bu aynan shu loyihada bo'lgan xato):**
- Agenda: `"Kirish — 1-§ ni bir jumlada eslash"` ✅ (raqam bor)
- Lekin `kirish[0]`: `"Suv favvorasidan chiqqan tomchi avval yuqoriga
  ko'tariladi..."` ❌ (1-§ga hech qanday ishora yo'q, to'g'ridan-to'g'ri
  yangi metaforaga sakragan)
- **Xulosa: agenda to'g'ri bo'lsa ham, `kirish` alohida buzilgan —
  ikkalasi ham HA bo'lmaguncha dars tayyor emas.**

**Tuzatilgan variant:** `"1-§ da kvadrat funksiyaning umumiy ko'rinishi
y = ax² + bx + c ekanini ko'rdik. Bugun uning eng sodda holatini —
faqat y = x² ni — batafsil o'rganamiz. Suv favvorasidan chiqqan
tomchi..."`

**Muhim cheklov (o'zgarmagan):** Ko'prik bitta qisqa jumla/ikki jumla
bilan cheklanadi. Butun paragrafni oldingi darsni qaytarishga
sarflamaslik — bu darsni cho'zadi, foydasi yo'q.

### 2.3. `qoida` maydonida oldingi faktga tayanish

Agar `qoida` matni oldingi darsning faktiga tayansa (masalan 2-darsdagi
"simmetriya o'qi — Oy" faktiga 3-darsda tayanilsa), buni **jimgina
ishlatib bo'lmaydi**. Aniq ko'prik jumla kerak: "2-darsda ko'rganimizdek..."
yoki "O'tgan darsda aytilganidek...". Jimgina tayanish — o'quvchi uchun
"havodan paydo bo'lgan fakt" bo'lib qoladi, bu taqiqlanadi.

---

## 3. HARD QOIDA — Sahna (interaktiv) parametrlari darsning mavzusiga qat'iy mos bo'lishi

**Qoida:** Agar dars faqat BITTA yoki IKKITA parametrni o'rgatsa
(masalan 3-dars faqat `a` ni, b va c ni emas), sahnadagi
o'rganilmayotgan parametrlar **majburan qulflanadi**:

```json
"b": { "min": 0, "max": 0, "step": 1, "value": 0, "desc": "bu darsda 0" }
```

`min == max` bo'lishi SHART — bu slayder harakatlanmasligini kafolatlaydi.
`desc` maydonida albatta **nega qulflanganini** yoz ("bu darsda 0",
"keyingi darsda o'rganamiz" kabi), aks holda o'quvchi nega slayder
qimirlamayotganini tushunmaydi.

**Qachon qulflanmaydi:** Agar dars aynan shu parametr(lar) haqida bo'lsa
(masalan 1-dars va 4-dars — a,b,c hammasi haqida), ular ochiq qoladi.
Buni aniqlash mezoni: **dars `title`/`lead`da zikr etilgan o'zgaruvchilar
= sahnada ochiq bo'lishi kerak bo'lgan o'zgaruvchilar. Boshqa hech biri emas.**

**Tekshiruv jadvali (har yangi dars uchun to'ldirish shart):**

| Parametr | Bu darsda o'rganiladimi? | Sahnada holati |
|---|---|---|
| a | ha/yo'q | ochiq / qulflangan (min=max) |
| b | ha/yo'q | ochiq / qulflangan (min=max) |
| c | ha/yo'q | ochiq / qulflangan (min=max) |

---

## 4. HARD QOIDA — Pedagogik progressiya (murakkablik tartibi)

**Qoida:** Har bir yangi dars avvalgisiga nisbatan **roppa-rosa bitta**
yangi qatlam qo'shishi kerak — hech qachon ikki va undan ortiq yangi
tushunchani bir vaqtda kiritmaslik.

- To'g'ri progressiya namunasi (1-4 darslar):
  `y=ax²+bx+c (umumiy ta'rif)` → `y=x² (eng sodda)` → `y=ax² (bitta parametr)`
  → `y=ax²+bx+c (hammasi qaytadan, endi tushunarli)`
- Yangi dars yozishda o'zingdan so'ra: "Bu darsda nechta YANGI g'oya bor?"
  Javob 1 dan katta bo'lsa — darsni ikkiga bo'l yoki avvalgi darsga
  qo'shimcha qatlam qo'sh, bitta darsga hammasini tiqishtirma.

---

## 5. HARD QOIDA — `next`/`prev` va fayl strukturasi izchilligi

- `prev.href` va `next.href` doim bevosita qo'shni papkaga ko'rsatishi
  kerak (`../{N-1}/`, `../{N+1}/`) — hech qachon o'tkazib yubormaslik.
- Birinchi dars `prev: null`, oxirgi dars `next: null` (yoki mavjud
  bo'lmasa umuman qo'yilmaydi).
- `id` maydoni papka nomiga aynan mos kelishi kerak (`3/data.json`
  ichida `"id": 3`), bir marta ham chetga chiqmaydi.

---

## 6. Yakuniy nashr oldidan — MAJBURIY checklist (hammasi HA bo'lishi kerak)

- [ ] Yangi atama ishlatilgan bo'lsa, N-1 darsda ko'prik jumla bor
- [ ] Agenda "Kirish" qatorida N dan kichik aniq raqam/formula bor (2.1)
- [ ] Agenda'da N yoki undan katta raqam YO'Q (nusxa ko'chirish tekshiruvi)
- [ ] **`kirish[0]` alohida tekshirilgan** — ichida N-1 darsning aniq
      faktiga/formulasiga ishora BOR (2.2). Agenda to'g'ri bo'lgani
      "demak kirish ham to'g'ri" degani EMAS — ikkalasi mustaqil tekshiriladi.
- [ ] `qoida`da oldingi faktga tayanilsa — "N-darsda ko'rganimizdek" tipidagi jumla bor (2.3)
- [ ] Sahna parametrlari jadvali to'ldirilgan, o'rganilmayotganlari qulflangan
- [ ] Ushbu darsda faqat 1 ta yangi g'oya bor (progressiya buzilmagan)
- [ ] `prev`/`next`/`id` to'g'ri
- [ ] `python3 validate_lessons.py lessons/math/{grade}` ishga tushirilgan,
      yangi darsga tegishli xatolar yo'q

Checklist'dagi bitta band ham "yo'q" bo'lsa — dars **nashr qilinmaydi**,
qayta ishlanadi. Bahona yo'q, "keyin tuzataman" degan variant yo'q.
