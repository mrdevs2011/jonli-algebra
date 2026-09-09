# Jonli Algebra

9-sinf algebra uchun **vizual, interaktiv** darslar.  
Tartib — Alimov, Xolmuhamedov, Mirzaahmedov (2019) mundarijasi.

Bu kitobning elektron nusxasi emas. Matn ko‘chirilmagan.  
Har dars o‘z so‘zi va chizmasi bilan yoziladi.

> **Hozircha faqat algebra, lekin shunday mo‘ljallanган:** papka tuzilmasi
> (`lessons/<fan>/<sinf>/`) ataylab umumiy qilib qurilgan — vaqti kelib
> boshqa fanlar (fizika, geometriya, kimyo...) ham xuddi shu naqsh bilan
> qo‘shilishi mumkin. Loyihaning uzoq muddatli nomi: **AURA**.

---

## Qanday ochiladi

`index.html` ni brauzerda oching. Internet shart emas.

---

## Papkalar

```
index.html          boshqaruv paneli
css/                umumiy ko‘rinish
js/                 dars ro‘yxati va progress
build/              data.json → index.html quruvchi (build.py, shablon, tekshiruv)
kitob/              darslikning barcha 240 sahifasi (manba rasmlar)
lessons/
  math/
    9/              9-sinf algebra
      1/            1-§ — data.json + index.html (build qilingan) + png/
      2/ … 38/      hali yo‘q — har biri kitob/ manbasidan dars-dars quriladi
```

Kelajakda boshqa fan/sinf qo‘shilsa (masalan `lessons/geometry/9/` yoki `lessons/math/10/`), shu tuzilma davom ettiriladi.

Dashboarddagi havola: `./lessons/math/9/4/` → `lessons/math/9/4/index.html` (dars yozilgach paydo bo‘ladi).

---

## Hozirgi holat (poydevor)

- Faqat **1-§** (`lessons/math/9/1/`) to‘liq yozilgan va build qilingan (`data.json` → `build/build.py` → `index.html`)
- 2–38 papkalar **hali mavjud emas** — eski, to‘ldirilmagan shablonlari o‘chirildi (2026-09-09)
- Dashboard ishlaydi, progress `localStorage` da saqlanadi
- Yoriqnoma (`ilovani-qurish/YORIQNOMA.md`) to‘liq yozilgan

**Keyingi qadam:** har bir darsni `kitob/kitob-N.png` sahifasidan haqiqiy mazmun bilan, dars-dars, 1-§dagi kabi qayta qurish.

---

## Qanday dars qo‘shiladi

1. `kitob/kitob-N.png` — shu darsning darslikdagi sahifasini oching (manba).
2. `lessons/math/9/N/data.json` yozing (1-§ namuna): title, lead, qoida, savollar, doska masalalari, mashqlar, xulosa.
3. Rasmlar kerak bo‘lsa `lessons/math/9/N/png/` ga qo‘yiladi (kitobdan crop qilingan).
4. `python3 build/build.py N` — `lessons/math/9/N/index.html` shundan quriladi.
5. Dars tayyor bo‘lsa `js/progress.js` ichidagi `readyIds` ga raqamni qo‘shing.

Boshqa darslar papkalariga tegilmaydi.

Batafsil tartib → **ilovani-qurish/YORIQNOMA.md**

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
