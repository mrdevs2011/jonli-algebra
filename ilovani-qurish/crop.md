# CROP-DOSKA-RASM.md

## Vazifa

Berilgan bitta dars papkasi uchun (`lessons/math/9/<N>/`) `data.json` ichidagi `doska.masalalar[]` ro'yxatidagi har bir masala/ta'rif blokiga mos rasmni `kitob/` papkasidagi tegishli sahifa PNG faylidan **aniq qirqib olib**, `lessons/math/9/<N>/png/` papkasiga saqlash va `data.json`ni shunga mos yangilash.

Ishni **1-dars** (`lessons/math/9/1/`)da qilingan namunadagidek — piksel darajasida aniq, matn kesilmagan, ortiqcha bo'shliq qolmagan holda bajarish kerak.

---

## Qadamlar (har bir dars uchun takrorlanadi)

### 1. Kontekstni o'qish
- `lessons/math/9/<N>/data.json` ni oching.
- `doska.masalalar[]` massividagi har bir elementni ko'ring: `caption` (masalan "1-masala · 6-bet"), `kirish`, `steps`/`static`.
- `caption`dagi bet raqami (masalan "6-bet") orqali qaysi `kitob/kitob-<bet>.png` fayl kerakligini aniqlang.
- Agar bir nechta masala bitta betda bo'lsa (masalan hammasi "6-bet"), ular bitta rasmning turli qismlari — har biri alohida qirqiladi.

### 2. Manba sahifani vizual tekshirish
- `kitob/kitob-<bet>.png` faylini to'liq ko'ring (`view` tool bilan).
- Sahifadagi matnni `doska.masalalar[]`dagi `steps`/`static` matni bilan solishtirib, har bir masalaning **aniq boshlanish va tugash chizig'ini** matn orqali toping (masalan "1-masala." so'zidan "2-masala." so'zigacha, lekin oxirgi qatordagi ▲ belgisidan keyin, keyingi sarlavhadan oldin).
- Har bir masala **alohida, mustaqil crop** bo'ladi — bittasi ikkinchisining matnini o'z ichiga olmasligi kerak.

### 3. Piksel koordinatalarini aniq topish (MAJBURIY — taxmin qilmang)
- Python/PIL yordamida sahifa rasmiga **gridline overlay** chizing (har 20px da qizil gorizontal chiziqlar + raqam belgilari x uchun, ko'k vertikal chiziqlar + raqam y uchun), 2x zoom qilib saqlang va `view` bilan ko'ring.
- Gridni ko'rib, har bir masala uchun:
  - **top** — matnning eng yuqori qismidan ~3-6px yuqorida (harf boshi kesilmasin, lekin ortiqcha bo'sh joy ham qolmasin)
  - **bottom** — matnning eng past qismidan (nuqta, ▲ belgisi) ~3-6px pastda
  - **left** — HECH QACHON o'zgartirmang, doim `0`. Gorizontal chegaralarga umuman tegmang.
  - **right** — HECH QACHON o'zgartirmang, doim sahifaning to'liq eni (masalan 640). Gorizontal chegaralarga umuman tegmang.
  - **QATʼIY QOIDA:** har bir crop faqat `top`/`bottom` bo'yicha farqlanadi. `left`/`right` barcha masalalar, barcha darslar uchun bir xil (0, to'liq sahifa eni) — bu maydonlarga tegish TAQIQLANADI.
- Bir sahifadagi barcha masalalar uchun bir xil `left`/`right` qiymatini ishlating (matn ustuni bir joyda), faqat `top`/`bottom` har biriga xos.

### 4. Crop qilish va tekshirish (iterativ)
- Har bir masala uchun `im.crop((left, top, right, bottom))` bilan kesib, alohida PNG saqlang.
- **Har birini `view` bilan ko'ring** — quyidagilarni tekshiring:
  - Birinchi va oxirgi qator to'liq ko'rinyaptimi (harf boshlari/oxirlari kesilmaganmi)?
  - Chap/o'ng chetlarda so'z boshi kesilmaganmi?
  - Oldingi/keyingi masalaning matni aralashib qolmaganmi?
  - Ortiqcha bo'sh joy (2 qatordan ko'p bo'sh maydon) yo'qmi?
- Agar noto'g'ri bo'lsa — koordinatani 2-5px qadam bilan tuzatib, qayta crop qiling va qayta ko'ring. Mukammal bo'lgunicha takrorlang.

### 5. Saqlash
- `lessons/math/9/<N>/png/` papkasini yarating (agar yo'q bo'lsa).
- Har bir rasmni mazmunli nom bilan saqlang: `1-masala.png`, `2-masala.png`, `tarif.png`, `3-masala.png` va h.k. — `caption`dagi nomga mos.

### 6. `data.json`ni yangilash
Har bir `doska.masalalar[i]` elementiga qo'shing (mavjud maydonlarni o'chirmasdan):
```json
"img": "png/1-masala.png",
"alt": "<masala mazmunini qisqa tasvirlaydigan matn, bet raqami bilan>",
"width": <crop qilingan rasmning haqiqiy pikseldagi eni>,
"height": <crop qilingan rasmning haqiqiy pikseldagi bo'yi>