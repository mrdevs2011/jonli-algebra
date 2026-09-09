# Jonli Algebra — Yoriqnoma

Maqsad: 9-sinf algebra (Alimov, Xolmuhamedov, Mirzaahmedov 2019) tartibida **vizual, interaktiv** darslar yaratish.  
Har dars = 1 paragraf = 1 papka.  
**Shoshilmaymiz.** 1–2 yil ichida 38 darsni puxta to‘ldiramiz.

---

## Asosiy tamoyillar

1. **Avval ko‘rinadi, keyin formula.**  
   O‘quvchi chizmani harakatda ko‘radi. Formula keyin keladi.

2. **Bitta dars — bitta g‘oya.**  
   3–4 qoidadan oshmasin. Doskada 6–10 daqiqada ochiladigan darajada.

3. **Kitob matni ko‘chirilmaydi.**  
   O‘z so‘zimiz, o‘z chizmamiz. Mashqlarning hammasi kerak emas — tushunishni osonlashtirish uchun.

4. **Internet shart emas.**  
   Barcha narsa lokal. Brauzerda `index.html` ochiladi.

5. **Bir kunda 5 dars yozilmaydi.**  
   Sifat > tezlik. 1 dars = 1–2 kun.

---

## Dars yozish tartibi (1–2 kun)

### 1-kun ertalab (20–40 daqiqa)

Kitobdagi paragrafni o‘qing. Qog‘ozga faqat 3 narsa yozing:

- O‘quvchi dars oxirida **nima qila olishi** kerak?
- Qaysi **bitta narsa** harakat qilishi kerak? (slayder, nuqta, yoy, bo‘yoq, aylana…)
- Qaysi **3 qoida** doskada qolishi kerak?

Agar 3 qoidadan oshsa — darsga ortiqcha narsa tiqilgan. Qisqartiring.

### 1-kun kechqurun

Faqat `#sahna` ni yozing. Matn yo‘q. Chizma ishlasin.

Tekshiruv ro‘yxati:

- [ ] Telefon ekranida ham tushuniladimi?
- [ ] Slayder / tugma siljisa, hech bo‘lmaganda 1 ta yozuv yoki rang o‘zgaradimi?
- [ ] Formula chizmadan **oldin** chiqmayaptimi?
- [ ] Ortiqcha matn, tugma, reklama yo‘qmi?

### 2-kun

Endi matn qo‘shiladi (tartib muhim):

1. **Kirish** — 3–4 jumla (o‘quvchini nima kutayotganini aytadi)
2. **Jonli qoida** — chizma ostida, harakatga bog‘langan
3. **3 ta savol** (A/B/C, darhol javob ko‘rinadi)
4. **3 ta “Eslab qol”** — qisqa, yodda qoladigan

So‘ng **4 daqiqa** sinfdoshi, uka yoki o‘zingizga ko‘rsating.  
Tushunmasa — matnni qisqartiring, chizmani tuzating. Yana ko‘rsating.

### Tayyor deb hisoblash

Dars tayyor bo‘lsa:

1. `js/progress.js` ichidagi `readyIds` massiviga dars raqamini qo‘shing.
2. Dashboardda “Tayyor” pill ko‘rinadi.
3. Boshqa 37 papkaga tegilmaydi.

---

## Fayl tuzilmasi (o‘zgarmaydi)

```
index.html          boshqaruv paneli (dashboard)
css/
  base.css          umumiy rang, shrift, layout
  dars.css          dars sahifasi
  dashboard.css     bosh sahifa
js/
  darslar.js        38 darsning nomlari va qisqa izohlari
  progress.js       readyIds + localStorage progress
  dashboard.js      bosh sahifani chizadi
lessons/math/9/1/index.html … 38/index.html
```

Har dars o‘z papkasida yashaydi. Umumiy uslub faqat CSS dan keladi.

---

## 1–2 yillik reja (shoshmasdan)

| Davr          | Maqsad                              | Taxminiy dars |
|---------------|-------------------------------------|---------------|
| 1–3 oy        | I bob (kvadrat funksiya) poydevori  | 1–12          |
| 4–6 oy        | II bob (sistemalar)                 | 13–…          |
| 7–10 oy       | III bob (trigonometriya)            | …             |
| 11–14 oy      | IV bob (progressiyalar)             | …             |
| 15–18 oy      | V bob (ehtimollik) + polish         | 34–38         |
| Oxirgi oylar  | Barcha darslarni qayta ko‘rib chiqish, telefon sinovi, o‘qituvchi fikri |

Har oy 2–4 dars. Ba’zi oylarda 0 dars ham bo‘lishi mumkin — dam oling, keyin davom eting.

---

## Qo‘shilmaydigan narsalar

- Kitobdagi mashqlarning to‘liq ro‘yxati
- Uzoq isbotlar
- Login, ball, reyting, reklama
- Boshqa paragrafning mavzusi
- “Tezroq tugataylik” degan bosim

---

## Texnik eslatmalar

- Sahna ichida odatda **Canvas** yoki **SVG** + oddiy JS ishlatiladi.
- Ranglar faqat `base.css` dagi CSS o‘zgaruvchilardan.
- Progress faqat brauzer `localStorage` da saqlanadi.
- Yangi dars ochilganda faqat `readyIds` va shu darsning `#sahna` + matn bloki o‘zgaradi.

---

## Birinchi tavsiya

Hozir eng yaxshi boshlanish: **4-§** (`y = ax² + bx + c`).  
Chunki 2-§ va 3-§ shu slayder ichida ham ko‘rinadi.  
Keyin 2, 3, 1, 5 ketma-ketligi tabiiy keladi.

---

**Eslab qoling:**  
Poydevor mustahkam. Har dars alohida, puxta, sekin.  
1–2 yil — yetarli vaqt. Sifat qoladi, shoshilish o‘tadi.
