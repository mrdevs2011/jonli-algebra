# Dars yozish checklist

Har dars uchun shu ro‘yxatni belgilang.

## 1-kun — Sahna

- [ ] Kitob paragrafini o‘qidim
- [ ] 3 ta narsani yozdim: maqsad, harakat, 3 qoida
- [ ] Faqat `#sahna` ni yozdim (matn yo‘q)
- [ ] Telefon ekranida ham tushuniladi
- [ ] Harakat (slayder/tugma) bo‘lsa — kamida 1 ta yozuv/rang o‘zgaradi
- [ ] Formula chizmadan oldin chiqmayapti
- [ ] Ortiqcha matn, tugma, reklama yo‘q
- [ ] **Yangi `sahna-*.js` yozayapsanmi?** Avval tekshir: mavjud turlardan
      biri (masalan `abc-parabola`) config bilan (boshqa `min`/`max`/`value`)
      yetarli emasmi? Yetarli bo‘lsa — yangi fayl yozma, faqat `data.json`da
      shu turdan foydalan. Yetarli bo‘lmasa — yangi faylni **albatta**
      `js/sahna-base.js`dagi `createPlane`/`bindScrub`/`pulse`/`applyNote`
      funksiyalaridan foydalanib yoz (qayta yozma). Agar sahnangga mos
      kelmaydigan YANGI umumiy pattern chiqsa, uni faqat kamida 2-chi marta
      kerak bo‘lganda `sahna-base.js`ga qo‘sh (1 misoldan umumiylashtirma).
- [ ] Yangi sahna turi uchun `build/dars-template.html`ga
      `<script src="../../../../js/sahna-<tur>.js"></script>` qatorini
      `sahna-base.js`dan KEYIN qo‘shdim.

## 2-kun — Matn

- [ ] Kirish 3–4 jumla
- [ ] Qoida chizmaga bog‘langan
- [ ] 3 ta savol (A/B/C) + darhol javob
- [ ] 3 ta “Eslab qol”
- [ ] 4 daqiqa ko‘rsatdim (sinfdosh / uka / o‘zim)
- [ ] Tushunmasa — qisqartirdim / tuzatdim

## Tayyorlash

- [ ] `js/progress.js` → `readyIds` ga raqam qo‘shildi
- [ ] `ilovani-qurish/STATUS.md` yangilandi
- [ ] Boshqa papkalarga tegilmagan
- [ ] Dashboardda “Tayyor” ko‘rinadi

## Yakuniy tekshiruv

- [ ] Internet o‘chirilgan holda ishlaydi
- [ ] Mobil va desktop da ko‘rinadi
- [ ] 6–10 daqiqada tushuniladi
