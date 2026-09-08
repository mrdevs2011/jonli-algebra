# Jonli Algebra

9-sinf algebra uchun **vizual, interaktiv** darslar.  
Tartib — Alimov, Xolmuhamedov, Mirzaahmedov (2019) mundarijasi.

Bu kitobning elektron nusxasi emas. Matn ko‘chirilmagan.  
Har dars o‘z so‘zi va chizmasi bilan yoziladi.

---

## Qanday ochiladi

`index.html` ni brauzerda oching. Internet shart emas.

---

## Papkalar

```
index.html          boshqaruv paneli
css/                umumiy ko‘rinish
js/                 dars ro‘yxati va progress
1/index.html        1-§
2/index.html        2-§
…
38/index.html       38-§
```

Dashboarddagi havola: `./4/` → `4/index.html`.

---

## Hozirgi holat (poydevor)

- 38 ta dars papkasi tayyor (1–38)
- Har birida bir xil, toza shablon: sahna + reja/qoida/holat
- Dashboard ishlaydi, progress `localStorage` da saqlanadi
- Hozircha hech qaysi dars “tayyor” deb belgilanmagan (`readyIds = []`)
- Yoriqnoma (`YORIQNOMA.md`) to‘liq yozilgan

**Keyingi qadam:** birinchi darsni (tavsiya: 4-§) 1–2 kunda puxta yozish.

---

## Qanday dars qo‘shiladi

1. Shu kunning paragrafini oching, masalan `4/index.html`.
2. `#sahna` ichiga faqat o‘sha darsning interaktiv chizmasini yozing.
3. Pastdagi bloklarni shu darsga moslab yozing (kirish, qoida, savollar, eslab qol).
4. Dars tayyor bo‘lsa `js/progress.js` ichidagi `readyIds` ga raqamni qo‘shing.

Boshqa 37 papkaga tegilmaydi.

Batafsil tartib → **YORIQNOMA.md**

---

## Temp

- Bir dars = 1–2 kun
- Tez-tez 5 dars yozilmaydi
- Har dars o‘quvchi 6–10 daqiqada tushunadigan, o‘qituvchi doskada ochadigan darajada bo‘lishi kerak
- 1–2 yil ichida sekin-asta to‘ldiramiz

---

## Keyingi ochiladigan dars

Tavsiya: **4-§** — `y = ax² + bx + c`.  
Chunki 2-§ va 3-§ shu slayder ichida ham ko‘rinadi.

---

## Qurish hujjatlari

`ilovani-qurish/` papkasida:

- `AI.md` — AI agentlar uchun qattiq yoriqnoma
- `STATUS.md` — loyiha holati
- `CONVENTIONS.md` — kod qoidalari
- `PLAN.md` — 1–2 yillik reja
- `CHECKLIST.md` — har dars checklist

AI bilan ishlaganda avval `ilovani-qurish/AI.md` ni o‘qing.
