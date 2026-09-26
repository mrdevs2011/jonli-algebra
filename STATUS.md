# AI Context — .

## Oxirgi holat
- Sana:
- Nima qilindi:
- Hozirgi muammo/blocker:
- Keyingi qadam:

## Muhim fayllar
-

## Eslatmalar (arxitektura, qarorlar, "buni qilma" kabi)
-

---
### 2026-09-26 04:57
- Qilindi: 23-dars (α va −α burchaklar) yaratildi: data.json (sahna unit-circle, kirish, qoida, doska 4 masala, mashqlar 275-278, kitob 120-121), index.html, png crop lar (4 ta)
- Keyingi qadam: Keyingi: crop larni yaxshilash (agar kerak), 22-dars next linkini 23 ga yangilash (boshqa agent yoki keyin), validate butun loyiha
- Git holati: 3a79f59 15 to 22 ni yaxsholyabmiz

---
### 2026-09-26 05:01
- Qilindi: 24-dars (Qo'shish formulalari) yaratildi: data.json (sahna unit-circle, kirish, qoida cos/sin(α±β), doska 5 blok, mashqlar 280-286, kitob 122-124), index.html, png crop lar (5 ta)
- Keyingi qadam: Keyingi: crop larni aniqroq qilib yaxshilash (agar kerak), 23-dars next linki allaqachon 24 ga, validate butun loyiha boshqa agentlar tugagach
- Git holati: 3a79f59 15 to 22 ni yaxsholyabmiz

---
### 2026-09-26 06:39
- Qilindi: 25-dars (Ikkilangan burchak) yaratildi — claude chala qoldirgan taskni tugatildi: data.json (sin2α, cos2α, tg2α, doska 4 masala, mashqlar 293-298, kitob 126-128), index.html, png crop lar
- Keyingi qadam: Keyingi: 26-dars (Keltirish formulalari) yoki croplarni yaxshilash; boshqa agentlar tugasa butun validate
- Git holati: 3a79f59 15 to 22 ni yaxsholyabmiz

---
### 2026-09-26 06:40
- Qilindi: js/progress.js da readyIds ni 1–25 gacha yangilandi — root index.html da tugallangan darslar endi 'Tayyor' statusida ko'rinadi
- Keyingi qadam: Boshqa agentlar tugasa butun validate; croplarni yaxshilash ixtiyoriy
- Git holati: 3a79f59 15 to 22 ni yaxsholyabmiz

---
### 2026-09-26 13:15
- Qilindi: Rasmlar tekshirildi: 25 darsning 195ta rasmi (kitob+doska) fayl mavjudligi va real HTTP orqali 200 qaytarishi tasdiqlandi, muammo topilmadi. Lokal komputer origin'dan 6 commit orqada ekan (MR GitHub web orqali 23-25 darsni geometriya/tg-ctg mavzusi bilan almashtirib yuklagan edi), local claude'ning eski 23-25 (burchak/qoshish formulalari) versiyasi /tmp/ja-backup ga zaxiralanib, git pull bilan origin versiyasi qabul qilindi, hech narsa push qilinmadi (allaqachon sync).
- Keyingi qadam: STATUS.md dagi 23-25 log yozuvlari eski (almashtirilgan) mazmunga oid, xohlasa yangilash mumkin. Git remote URLda token ochiq (xavfsizlik).
- Git holati: 7a944df Add files via upload

---
### 2026-09-26 13:20
- Qilindi: HAQIQIY BUG topildi va tuzatildi: MR yubordigan screenshotda 25-dars sahifasi 24-darsning sarlavhasini korsatayotgani sezildi. Sabab: 23 va 25-darslarning index.html fayllari (GitHub web orqali yuklanganda) mos ravishda ESKI 22 va 24-darsning dars-data JSON'ini saqlab qolgan edi (data.json to'g'ri edi, lekin index.html eskirgan) - shu uchun ular boshqa darsning rasm/matn/mashqlarini chiqarardi, ozi papkasidagi rasmlar esa mos kelmasdi. build/build.py 23 va build.py 25 bilan ikkalasi qayta build qilindi, jonli-algebra.vercel.app da tasdiqlandi (title va rasmlar togri). Push qilindi: c95b792.
- Keyingi qadam: Boshqa darslarda (1-22, 24) bunday mismatch yoq - hammasi tekshirilgan.
- Git holati: c95b792 Bug topildi va tuzatildi: 23 va 25-dars index.html eski (22 va 24-darsning) dars-data JSON'ini saqlab qolgan edi - shu sabab noto'g'ri rasm/matn chiqargan. build.py bilan ikkalasi ham qayta build qilindi.
