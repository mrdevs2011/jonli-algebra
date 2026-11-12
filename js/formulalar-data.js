/**
 * Jonli Algebra — 9-sinf Fundamental Formulalar Qomusi (Interactive Handbook)
 * Barcha 65 ta algebraik formula, ta'rifi, isboti va darslarga deep linklar.
 */
window.JA_FORMULALAR = [
  // --- I BOB ---
  {
    id: "f-1",
    bob: 1,
    bobNom: "I bob · Kvadrat funksiya",
    title: "Kvadrat funksiyaning umumiy ko'rinishi",
    formula: "y = ax² + bx + c &nbsp;(a ≠ 0)",
    lessonId: 1,
    lessonLink: "lessons/math/9/1/",
    desc: "a, b, c haqiqiy sonlar bo'lib, a ≠ 0 shartida berilgan ikkinchi darajali ko'phad. Grafigi har doim parabola bo'ladi.",
    isbot: "a ≠ 0 bo'lishi shart, aks holda funksiya y = bx + c chiziqli funksiyaga aylanadi."
  },
  {
    id: "f-2",
    bob: 1,
    bobNom: "I bob · Kvadrat funksiya",
    title: "y = x² bosh parabola",
    formula: "y = x²",
    lessonId: 2,
    lessonLink: "lessons/math/9/2/",
    desc: "Uchi (0; 0) nuqtada bo'lib, tarmoqlari yuqoriga qaragan, Oy o'qiga nisbatan qat'iy simmetrik parabola.",
    isbot: "x ning istalgan haqiqiy qiymatida x² ≥ 0 bo'ladi, x = 0 da eng kichik y = 0 qiymatiga erishadi."
  },
  {
    id: "f-3",
    bob: 1,
    bobNom: "I bob · Kvadrat funksiya",
    title: "y = ax² koeffitsiyent ta'siri",
    formula: "y = ax²",
    lessonId: 3,
    lessonLink: "lessons/math/9/3/",
    desc: "a > 0 da tarmoqlar yuqoriga, a < 0 da pastga ochiladi. |a| katta bo'lsa ingichkalashadi, kichik bo'lsa kengayadi.",
    isbot: "Har bir nuqtaning ordinatasi a koeffitsiyent marta kattalashadi yoki kichrayadi."
  },
  {
    id: "f-4",
    bob: 1,
    bobNom: "I bob · Kvadrat funksiya",
    title: "Parabola uchining abssissasi",
    formula: "x₀ = −b / (2a)",
    lessonId: 4,
    lessonLink: "lessons/math/9/4/",
    desc: "Parabola uchi koordinatalar sistemasidagi eng yuqori yoki eng quyi nuqtasining x koordinatasi.",
    isbot: "ax² + bx + c = a(x + b/(2a))² + c − b²/(4a) to'la kvadrat ajratishdan to'g'ridan-to'g'ri chiqadi."
  },
  {
    id: "f-5",
    bob: 1,
    bobNom: "I bob · Kvadrat funksiya",
    title: "Parabola uchining ordinatasi",
    formula: "y₀ = −(b² − 4ac) / (4a) = 4ac − b² / (4a)",
    lessonId: 4,
    lessonLink: "lessons/math/9/4/",
    desc: "Parabola uchining vertikal balandligi yoki eng chuqur nuqtasi qiymati.",
    isbot: "y₀ = f(x₀) funksiyaga x = −b/(2a) qiymatini qo'yish orqali hisoblanadi."
  },
  {
    id: "f-6",
    bob: 1,
    bobNom: "I bob · Kvadrat funksiya",
    title: "Simmetriya o'qi tenglamasi",
    formula: "x = −b / (2a)",
    lessonId: 4,
    lessonLink: "lessons/math/9/4/",
    desc: "Parabolani ikkita bir-biriga ko'zgu aksidek teng qismga ajratuvchi vertikal to'g'ri chiziq.",
    isbot: "f(x₀ − h) = f(x₀ + h) ayniyati har qanday h sonida bajariladi."
  },
  {
    id: "f-7",
    bob: 1,
    bobNom: "I bob · Kvadrat funksiya",
    title: "Kvadrat tenglama diskriminanti",
    formula: "D = b² − 4ac",
    lessonId: 4,
    lessonLink: "lessons/math/9/4/",
    desc: "Parabolaning Ox o'qi bilan kesishish nuqtalari sonini belgilovchi xarakteristika (D > 0 da 2 ta, D = 0 da 1 ta, D < 0 da kesishmaydi).",
    isbot: "To'la kvadrat ajratgandagi ildiz ostidagi ifoda."
  },
  {
    id: "f-8",
    bob: 1,
    bobNom: "I bob · Kvadrat funksiya",
    title: "Kvadrat tenglama ildizlari formulasi",
    formula: "x₁,₂ = (−b ± √D) / (2a)",
    lessonId: 5,
    lessonLink: "lessons/math/9/5/",
    desc: "ax² + bx + c = 0 tenglamaning barcha haqiqiy ildizlarini topish umumiy formulasi.",
    isbot: "a(x + b/(2a))² = D / (4a) → (x + b/(2a)) = ±√D / (2a)."
  },
  {
    id: "f-9",
    bob: 1,
    bobNom: "I bob · Kvadrat funksiya",
    title: "Viyet teoremasi (umumiy)",
    formula: "x₁ + x₂ = −b / a, &nbsp; x₁ · x₂ = c / a",
    lessonId: 1,
    lessonLink: "lessons/math/9/1/",
    desc: "Kvadrat tenglama ildizlarining yig'indisi va ko'paytmasi bilan koeffitsiyentlar orasidagi munosabat.",
    isbot: "(x − x₁)(x − x₂) = x² − (x₁+x₂)x + x₁x₂ ko'paytmani ax² + bx + c ko'rinishiga solishtirishdan kelib chiqadi."
  },
  {
    id: "f-10",
    bob: 1,
    bobNom: "I bob · Kvadrat funksiya",
    title: "Kvadrat uchhadni ko'paytuvchilarga ajratish",
    formula: "ax² + bx + c = a(x − x₁)(x − x₂)",
    lessonId: 5,
    lessonLink: "lessons/math/9/5/",
    desc: "Ildizlari ma'lum bo'lgan har qanday kvadrat uchhadni ikkita chiziqli ko'paytuvchiga yoyish ayniyati.",
    isbot: "x₁ va x₂ ildiz bo'lgani uchun Bezout teoremasiga ko'ra uchhad (x−x₁) va (x−x₂) ga qoldiqsiz bo'linadi."
  },
  {
    id: "f-11",
    bob: 1,
    bobNom: "I bob · Kvadrat funksiya",
    title: "Intervallar usulida kasr tengsizlik",
    formula: "P(x) / Q(x) > 0 &nbsp;⇔&nbsp; P(x) · Q(x) > 0 &nbsp;(Q(x) ≠ 0)",
    lessonId: 8,
    lessonLink: "lessons/math/9/8/",
    desc: "Kasrning ishorasi surat va maxraj ko'paytmasi ishorasi bilan aynan bir xildir.",
    isbot: "Musbat songa ko'paytirish tengsizlik ishorasini o'zgartirmaydi: (P/Q) · Q² = P · Q."
  },
  {
    id: "f-12",
    bob: 1,
    bobNom: "I bob · Kvadrat funksiya",
    title: "Juft va toq funksiyalar",
    formula: "f(−x) = f(x) &nbsp;(Juft), &nbsp; f(−x) = −f(x) &nbsp;(Toq)",
    lessonId: 11,
    lessonLink: "lessons/math/9/11/",
    desc: "Juft funksiya grafigi Oy o'qiga, toq funksiya grafigi koordinata boshiga nisbatan simmetrik bo'ladi.",
    isbot: "Ta'rifdan: y = x² juft (−x)² = x²; y = x³ toq (−x)³ = −x³."
  },

  // --- II BOB ---
  {
    id: "f-13",
    bob: 2,
    bobNom: "II bob · Sistemalar va tengsizliklar",
    title: "Koshi tengsizligi (O'rta arifmetik va geometrik)",
    formula: "(a + b) / 2 ≥ √(ab) &nbsp;(a, b ≥ 0)",
    lessonId: 16,
    lessonLink: "lessons/math/9/16/",
    desc: "Ikkita manfiy bo'lmagan sonning o'rta arifmetigi ularning o'rta geometrigidan hech qachon kichik bo'lmaydi. Tenglik a = b da bajariladi.",
    isbot: "(√a − √b)² ≥ 0 → a − 2√(ab) + b ≥ 0 → a + b ≥ 2√(ab) → (a+b)/2 ≥ √(ab)."
  },
  {
    id: "f-14",
    bob: 2,
    bobNom: "II bob · Sistemalar va tengsizliklar",
    title: "Kvadratlar yig'indisi tengsizligi",
    formula: "a² + b² ≥ 2ab",
    lessonId: 16,
    lessonLink: "lessons/math/9/16/",
    desc: "Har qanday haqiqiy sonlar uchun kvadratlar yig'indisi ularning ikkilangan ko'paytmasidan kichik emas.",
    isbot: "(a − b)² ≥ 0 → a² − 2ab + b² ≥ 0 → a² + b² ≥ 2ab."
  },
  {
    id: "f-15",
    bob: 2,
    bobNom: "II bob · Sistemalar va tengsizliklar",
    title: "Son va unga teskari son yig'indisi",
    formula: "a + 1/a ≥ 2 &nbsp;(a > 0)",
    lessonId: 16,
    lessonLink: "lessons/math/9/16/",
    desc: "Musbat son va unga teskari son yig'indisi kamida 2 ga teng. Eng kichik qiymat a = 1 da.",
    isbot: "Koshi tengsizligida b = 1/a deb olinsa: (a + 1/a) ≥ 2√(a · 1/a) = 2."
  },
  {
    id: "f-16",
    bob: 2,
    bobNom: "II bob · Sistemalar va tengsizliklar",
    title: "Simmetrik sistemalarni yechish",
    formula: "u = x + y, &nbsp; v = x · y",
    lessonId: 14,
    lessonLink: "lessons/math/9/14/",
    desc: "Noma'lumlari o'rin almashganda o'zgarmaydigan sistemalarni yangi o'zgaruvchilar orqali soddalashtirish.",
    isbot: "x² + y² = (x + y)² − 2xy = u² − 2v ayniyati orqali daraja pasaytiriladi."
  },

  // --- III BOB ---
  {
    id: "f-17",
    bob: 3,
    bobNom: "III bob · Trigonometriya",
    title: "Radian va gradus o'zaro bog'lanishi",
    formula: "π rad = 180°, &nbsp; 1 rad = 180° / π ≈ 57.3°",
    lessonId: 17,
    lessonLink: "lessons/math/9/17/",
    desc: "Aylana yoyining uzunligi radiusi uzunligiga teng bo'lgan burchak 1 radian deb ataladi.",
    isbot: "Butun aylananing uzunligi C = 2πR. Markaziy burchak 360° bo'lgani uchun 2π rad = 360° → π rad = 180°."
  },
  {
    id: "f-18",
    bob: 3,
    bobNom: "III bob · Trigonometriya",
    title: "Asosiy trigonometrik ayniyat",
    formula: "sin²α + cos²α = 1",
    lessonId: 21,
    lessonLink: "lessons/math/9/21/",
    desc: "Birlik aylanadagi har qanday nuqta koordinatalari (cosα; sinα) uchun Pifagor teoremasi ifodasi.",
    isbot: "Birlik aylana tenglamasi x² + y² = 1. x = cosα va y = sinα qo'yilsa, sin²α + cos²α = 1 hosil bo'ladi."
  },
  {
    id: "f-19",
    bob: 3,
    bobNom: "III bob · Trigonometriya",
    title: "Tangens va kotangens ko'paytmasi",
    formula: "tgα · ctgα = 1",
    lessonId: 21,
    lessonLink: "lessons/math/9/21/",
    desc: "Tangens va kotangens o'zaro teskari trigonometrik nisbatlardir.",
    isbot: "tgα = sinα/cosα, ctgα = cosα/sinα → (sinα/cosα) · (cosα/sinα) = 1."
  },
  {
    id: "f-20",
    bob: 3,
    bobNom: "III bob · Trigonometriya",
    title: "Tangens va kosinus bog'lanishi",
    formula: "1 + tg²α = 1 / cos²α",
    lessonId: 21,
    lessonLink: "lessons/math/9/21/",
    desc: "Kosinus ma'lum bo'lganda tangensni yoki aksincha topish ayniyati.",
    isbot: "sin²α + cos²α = 1 ayniyatining ikkala tomonini cos²α ga bo'lib yuborishdan chiqadi."
  },
  {
    id: "f-21",
    bob: 3,
    bobNom: "III bob · Trigonometriya",
    title: "Kotangens va sinus bog'lanishi",
    formula: "1 + ctg²α = 1 / sin²α",
    lessonId: 21,
    lessonLink: "lessons/math/9/21/",
    desc: "Sinus ma'lum bo'lganda kotangensni hisoblash ayniyati.",
    isbot: "sin²α + cos²α = 1 ning ikkala tomonini sin²α ga bo'lish orqali olinadi."
  },
  {
    id: "f-22",
    bob: 3,
    bobNom: "III bob · Trigonometriya",
    title: "Kosinuslar qo'shish formulasi",
    formula: "cos(α + β) = cosα cosβ − sinα sinβ",
    lessonId: 24,
    lessonLink: "lessons/math/9/24/",
    desc: "Ikki burchak yig'indisining kosinusi ularning kosinuslari ko'paytmasidan sinuslari ko'paytmasi ayirmasiga teng.",
    isbot: "Birlik aylanada ketma-ket burilishlar orasidagi masofa saqlanishidan vektorlar skalyar ko'paytmasi orqali isbotlanadi."
  },
  {
    id: "f-23",
    bob: 3,
    bobNom: "III bob · Trigonometriya",
    title: "Kosinuslar ayirish formulasi",
    formula: "cos(α − β) = cosα cosβ + sinα sinβ",
    lessonId: 24,
    lessonLink: "lessons/math/9/24/",
    desc: "Burchaklar ayirmasining kosinusini hisoblash qoidasi.",
    isbot: "cos(α + (−β)) formulasida cos(−β)=cosβ va sin(−β)=−sinβ qo'yishdan chiqadi."
  },
  {
    id: "f-24",
    bob: 3,
    bobNom: "III bob · Trigonometriya",
    title: "Sinuslar qo'shish formulasi",
    formula: "sin(α + β) = sinα cosβ + cosα sinβ",
    lessonId: 24,
    lessonLink: "lessons/math/9/24/",
    desc: "Ikki burchak yig'indisining sinusi formulasi.",
    isbot: "sin(α+β) = cos(π/2 − (α+β)) keltirish formulasidan olinadi."
  },
  {
    id: "f-25",
    bob: 3,
    bobNom: "III bob · Trigonometriya",
    title: "Sinuslar ayirish formulasi",
    formula: "sin(α − β) = sinα cosβ − cosα sinβ",
    lessonId: 24,
    lessonLink: "lessons/math/9/24/",
    desc: "Burchaklar ayirmasining sinusi formulasi.",
    isbot: "sin(α + (−β)) formulasi orqali isbotlanadi."
  },
  {
    id: "f-26",
    bob: 3,
    bobNom: "III bob · Trigonometriya",
    title: "Ikkilangan burchak sinusi",
    formula: "sin(2α) = 2 sinα cosα",
    lessonId: 25,
    lessonLink: "lessons/math/9/25/",
    desc: "Ikkilangan burchak sinusini bir qatli sinus va kosinus ko'paytmasiga keltirish.",
    isbot: "sin(α + α) = sinα cosα + cosα sinα = 2 sinα cosα."
  },
  {
    id: "f-27",
    bob: 3,
    bobNom: "III bob · Trigonometriya",
    title: "Ikkilangan burchak kosinusi",
    formula: "cos(2α) = cos²α − sin²α = 2cos²α − 1 = 1 − 2sin²α",
    lessonId: 25,
    lessonLink: "lessons/math/9/25/",
    desc: "Kosinusning ikkilangan burchagi uchun uch xil qulay ekvivalent ko'rinish.",
    isbot: "cos(α + α) = cosα cosα − sinα sinα = cos²α − sin²α."
  },
  {
    id: "f-28",
    bob: 3,
    bobNom: "III bob · Trigonometriya",
    title: "Sinuslar yig'indisi formulasi",
    formula: "sinα + sinβ = 2 sin((α+β)/2) cos((α−β)/2)",
    lessonId: 27,
    lessonLink: "lessons/math/9/27/",
    desc: "Sinuslar yig'indisini hisoblashga qulay bo'lgan ko'paytmaga aylantirish.",
    isbot: "α = x+y va β = x−y deb olib, qo'shish formulalari yig'indisini olishdan keladi."
  },
  {
    id: "f-29",
    bob: 3,
    bobNom: "III bob · Trigonometriya",
    title: "Kosinuslar yig'indisi formulasi",
    formula: "cosα + cosβ = 2 cos((α+β)/2) cos((α−β)/2)",
    lessonId: 27,
    lessonLink: "lessons/math/9/27/",
    desc: "Kosinuslar yig'indisini ko'paytmaga keltirish.",
    isbot: "cos(x+y) + cos(x−y) = 2cosx cosy ayniyatidan olinadi."
  },

  // --- IV BOB ---
  {
    id: "f-30",
    bob: 4,
    bobNom: "IV bob · Progressiyalar",
    title: "Arifmetik progressiya n-hadi",
    formula: "aₙ = a₁ + (n − 1)d",
    lessonId: 29,
    lessonLink: "lessons/math/9/29/",
    desc: "Boshlang'ich had a₁ va d ayirma yordamida ixtiyoriy n-hadni topish qoidasi.",
    isbot: "Har bir keyingi had d ga ortadi: a₂ = a₁+d, a₃ = a₁+2d, ... aₙ = a₁+(n−1)d."
  },
  {
    id: "f-31",
    bob: 4,
    bobNom: "IV bob · Progressiyalar",
    title: "Arifmetik progressiya o'rta hadi xossasi",
    formula: "aₙ = (aₙ₋₁ + aₙ₊₁) / 2",
    lessonId: 29,
    lessonLink: "lessons/math/9/29/",
    desc: "Har bir had (ikkinchisidan boshlab) o'ziga qo'shni ikki hadning o'rta arifmetigiga teng.",
    isbot: "aₙ₋₁ = aₙ − d va aₙ₊₁ = aₙ + d qo'shilsa: aₙ₋₁ + aₙ₊₁ = 2aₙ."
  },
  {
    id: "f-32",
    bob: 4,
    bobNom: "IV bob · Progressiyalar",
    title: "Arifmetik progressiya dastlabki n ta had yig'indisi",
    formula: "Sₙ = ((a₁ + aₙ) / 2) · n = ((2a₁ + (n−1)d) / 2) · n",
    lessonId: 30,
    lessonLink: "lessons/math/9/30/",
    desc: "Dastlabki n ta had yig'indisini Gauss usuli bo'yicha tezkor hisoblash formulasi.",
    isbot: "Yig'indini to'g'ri va teskari tartibda yozib qo'shsak, har bir juftlik yig'indisi (a₁+aₙ) bo'lib, 2Sₙ = n(a₁+aₙ) kelib chiqadi."
  },
  {
    id: "f-33",
    bob: 4,
    bobNom: "IV bob · Progressiyalar",
    title: "Geometrik progressiya n-hadi",
    formula: "bₙ = b₁ · qⁿ⁻¹",
    lessonId: 31,
    lessonLink: "lessons/math/9/31/",
    desc: "Boshlang'ich had b₁ va maxraj q orqali progressiyaning n-hadini topish.",
    isbot: "Har bir keyingi had q ga ko'payadi: b₂ = b₁q, b₃ = b₁q², ... bₙ = b₁qⁿ⁻¹."
  },
  {
    id: "f-34",
    bob: 4,
    bobNom: "IV bob · Progressiyalar",
    title: "Geometrik progressiya yig'indisi",
    formula: "Sₙ = (b₁(1 − qⁿ)) / (1 − q) &nbsp;(q ≠ 1)",
    lessonId: 32,
    lessonLink: "lessons/math/9/32/",
    desc: "Geometrik progressiya hadlari yig'indisini hisoblashning yopiq formulasi.",
    isbot: "qSₙ − Sₙ = b₁qⁿ − b₁ = b₁(qⁿ − 1) ayirmasidan kelib chiqadi."
  },
  {
    id: "f-35",
    bob: 4,
    bobNom: "IV bob · Progressiyalar",
    title: "Cheksiz kamayuvchi geometrik progressiya",
    formula: "S = b₁ / (1 − q) &nbsp;(|q| < 1)",
    lessonId: 33,
    lessonLink: "lessons/math/9/33/",
    desc: "Maxraji moduli 1 dan kichik bo'lgan cheksiz hadlar yig'indisi chekli songa intiladi.",
    isbot: "n → ∞ da |q| < 1 bo'lgani uchun qⁿ → 0 bo'ladi. Sₙ = b₁(1−0)/(1−q) = b₁/(1−q)."
  },

  // --- V BOB ---
  {
    id: "f-36",
    bob: 5,
    bobNom: "V bob · Ehtimollik va Statistika",
    title: "Klassik ehtimollik formulasi",
    formula: "P(A) = m / n",
    lessonId: 35,
    lessonLink: "lessons/math/9/35/",
    desc: "A hodisaga qulay bo'lgan elementar natijalar soni m ning jami teng ehtimolli natijalar soni n ga nisbati.",
    isbot: "Laplas ta'rifiga ko'ra, har doim 0 ≤ P(A) ≤ 1 oraliqda bo'ladi."
  },
  {
    id: "f-37",
    bob: 5,
    bobNom: "V bob · Ehtimollik va Statistika",
    title: "Qarama-qarshi hodisa ehtimolligi",
    formula: "P(Ā) = 1 − P(A)",
    lessonId: 35,
    lessonLink: "lessons/math/9/35/",
    desc: "A hodisa ro'y bermaslik ehtimolligi 1 dan uning ro'y berish ehtimolligi ayirmasiga teng.",
    isbot: "A va Ā birga to'liq guruh hosil qiladi: P(A) + P(Ā) = 1."
  },
  {
    id: "f-38",
    bob: 5,
    bobNom: "V bob · Ehtimollik va Statistika",
    title: "Tanlanmaning o'rta arifmetigi",
    formula: "X̄ = (x₁ + x₂ + ... + xₙ) / n",
    lessonId: 38,
    lessonLink: "lessons/math/9/38/",
    desc: "Statistik tanlanmadagi barcha kuzatilgan qiymatlarning o'rtacha kattaligi.",
    isbot: "Ma'lumotlar markaziy tendensiyasini ifodalovchi eng asosiy ko'rsatkich."
  }
];
