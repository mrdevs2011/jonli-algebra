/**
 * Jonli Algebra — Imtihonlar va Litsey Simulyatori Dvigateli (Exam & Mastery Engine)
 * 1. Bob yakuniy nazorat testlari (10 savol, 15 daqiqa)
 * 2. Litsey kirish to'liq simulyatori (30 savol, 60 daqiqa: Westminster ALWIUT, PM, WIUT darajasi)
 */
(function () {
  "use strict";

  // Bob nazorat testlari savollari bazasi (I - V boblar)
  var CHAPTER_EXAMS = {
    1: {
      bobId: 1,
      title: "I Bob Nazorat Testi: Kvadrat Funksiya va Tengsizliklar",
      badgeId: "bob-1",
      durationSec: 15 * 60,
      questions: [
        {
          q: "y = x² − 8x + 12 funksiyaning nollarini toping:",
          options: ["x = 2 va x = 6", "x = −2 va x = −6", "x = 3 va x = 4", "x = 1 va x = 12"],
          correct: 0,
          topic: "Kvadrat funksiya nollari (1-§)"
        },
        {
          q: "y = −2(x − 3)² + 5 parabolaning uchi koordinatalarini aniqlang:",
          options: ["(3; 5)", "(−3; 5)", "(3; −5)", "(−2; 5)"],
          correct: 0,
          topic: "Parabola uchi (4-§)"
        },
        {
          q: "x² − 5x + 4 < 0 tengsizlikning yechimini oraliq ko'rinishida toping:",
          options: ["(1; 4)", "(−∞; 1) ∪ (4; +∞)", "[1; 4]", "(−4; −1)"],
          correct: 0,
          topic: "Kvadrat tengsizliklar (6-§)"
        },
        {
          q: "y = 3x² + 6x − 1 funksiyaning simmetriya o'qi tenglamasini toping:",
          options: ["x = −1", "x = 1", "x = −2", "x = 3"],
          correct: 0,
          topic: "Simmetriya o'qi (4-§)"
        },
        {
          q: "(x − 2)(x + 3)(x − 5) ≥ 0 tengsizlikni intervallar usulida yeching:",
          options: ["[-3; 2] ∪ [5; +∞)", "(−∞; −3] ∪ [2; 5]", "[2; 5]", "(−3; 5)"],
          correct: 0,
          topic: "Intervallar usuli (8-§)"
        },
        {
          q: "f(x) = x⁴ − 3x² + 7 funksiyaning juft-toqligini aniqlang:",
          options: ["Juft funksiya", "Toq funksiya", "Na juft, na toq", "Davriy funksiya"],
          correct: 0,
          topic: "Funksiyaning juft-toqligi (11-§)"
        },
        // Litsey darajasidagi 4 ta masala:
        {
          q: "Litsey masalasi: y = x² − 2x + k parabolaning uchi y = 2x + 1 to'g'ri chiziqda yotsa, k ning qiymatini toping:",
          options: ["k = 4", "k = 3", "k = 2", "k = 5"],
          correct: 0,
          topic: "Parabola parametrlari (Litsey darajasi)",
          explanation: "Parabola uchi x₀ = 1, y₀ = 1 − 2 + k = k − 1. To'g'ri chiziqqa qo'yamiz: k − 1 = 2(1) + 1 = 3 → k = 4."
        },
        {
          q: "Litsey masalasi: x² + (a − 1)x + a² − 2 = 0 tenglama ildizlari kvadratlari yig'indisi x₁² + x₂² eng katta qiymatga erishadigan a ni toping:",
          options: ["a = 1", "a = −1", "a = 0", "a = 2"],
          correct: 1,
          topic: "Viyet ekstremum masalalari",
          explanation: "x₁² + x₂² = (x₁+x₂)² − 2x₁x₂ = (a−1)² − 2(a²−2) = −a² − 2a + 5 = 6 − (a+1)². Eng katta qiymat a = −1 da erishiladi."
        },
        {
          q: "Litsey masalasi: Har qanday x haqiqiy sonda x² − mx + m + 3 > 0 bo'ladigan m ning barcha butun qiymatlari sonini toping:",
          options: ["7 ta", "5 ta", "6 ta", "8 ta"],
          correct: 0,
          topic: "Parametrli tengsizliklar",
          explanation: "D = m² − 4(m+3) = m² − 4m − 12 < 0 → (m−6)(m+2) < 0 → −2 < m < 6. Butun sonlar: −1, 0, 1, 2, 3, 4, 5 (jami 7 ta)."
        },
        {
          q: "Litsey masalasi: y = ax² parabolaga y = 6x − 9 to'g'ri chiziq urinadi (bitta umumiy nuqtaga ega). a ni toping:",
          options: ["a = 1", "a = 2", "a = 3", "a = 4"],
          correct: 0,
          topic: "Grafiklar urinishi",
          explanation: "ax² − 6x + 9 = 0 da D = 36 − 36a = 0 → a = 1."
        }
      ]
    },
    2: {
      bobId: 2,
      title: "II Bob Nazorat Testi: Tenglamalar va Tengsizliklar Sistemalari",
      badgeId: "bob-2",
      durationSec: 15 * 60,
      questions: [
        {
          q: "x + y = 9 va xy = 20 tenglamalar sistemasining barcha musbat yechimlari juftligini toping:",
          options: ["(4; 5) va (5; 4)", "(2; 10) va (10; 2)", "(3; 6) va (6; 3)", "(1; 20)"],
          correct: 0,
          topic: "Sodda sistemalar (13-§)"
        },
        {
          q: "x² − y² = 24 va x − y = 4 bo'lsa, x + y yig'indisini toping:",
          options: ["6", "8", "12", "4"],
          correct: 0,
          topic: "Qisqa ko'paytirish formulalari (14-§)"
        },
        {
          q: "x² + y² = 25 va x = 3 sistemadan y ning barcha qiymatlarini toping:",
          options: ["±4", "4", "−4", "±5"],
          correct: 0,
          topic: "Aylana va to'g'ri chiziq (13-§)"
        },
        {
          q: "Musbat a va b sonlar uchun Koshi tengsizligi qaysi?",
          options: ["(a + b)/2 ≥ √(ab)", "(a + b)/2 ≤ √(ab)", "a² + b² ≥ a + b", "ab ≥ (a+b)²"],
          correct: 0,
          topic: "Koshi tengsizligi (16-§)"
        },
        {
          q: "x² − 4 > 0 va x² − 9 ≤ 0 tengsizliklar sistemasining yechimi:",
          options: ["[-3; -2) ∪ (2; 3]", "(-2; 2)", "[-3; 3]", "(2; 3]"],
          correct: 0,
          topic: "Tengsizliklar sistemasi (15-§)"
        },
        {
          q: "x + y = 6 bo'lsa, x · y ko'paytmaning eng katta qiymatini toping:",
          options: ["9", "8", "12", "36"],
          correct: 0,
          topic: "Koshi va ekstremum (16-§)"
        },
        // Litsey masalalari:
        {
          q: "Litsey masalasi: x + y + xy = 11 va x²y + xy² = 30 sistemasidan x³ + y³ ning qiymatini toping:",
          options: ["35", "27", "40", "64"],
          correct: 0,
          topic: "Simmetrik sistemalar",
          explanation: "u = x+y, v = xy desak: u + v = 11, uv = 30. {u, v} = {5, 6} yoki {6, 5}. u=5, v=6 bo'lganda: x³+y³ = u³ − 3uv = 125 − 3(5)(6) = 125 − 90 = 35."
        },
        {
          q: "Litsey masalasi: x, y, z musbat sonlar va x + y + z = 1 bo'lsa, 1/x + 1/y + 1/z ifodaning eng kichik qiymati:",
          options: ["9", "6", "3", "12"],
          correct: 0,
          topic: "Koshi-Bunyakovskiy",
          explanation: "(x + y + z)(1/x + 1/y + 1/z) ≥ 9. x+y+z=1 bo'lgani uchun eng kichik qiymat 9 ga teng."
        },
        {
          q: "Litsey masalasi: x² + y² − 4x + 6y + 13 = 0 tenglamaning barcha haqiqiy yechimlari juftligini toping:",
          options: ["(2; −3)", "(−2; 3)", "(2; 3)", "Yechimga ega emas"],
          correct: 0,
          topic: "Kvadratlar yig'indisi",
          explanation: "(x − 2)² + (y + 3)² = 0 → x = 2, y = −3."
        },
        {
          q: "Litsey masalasi: Tengsizlikni yeching: √(x + 3) > x − 3.",
          options: ["[-3; 6)", "[3; 6)", "(6; +∞)", "[-3; +∞)"],
          correct: 0,
          topic: "Irrasional tengsizlik",
          explanation: "x < 3 bo'lsa x+3 ≥ 0 → x ∈ [-3; 3). x ≥ 3 bo'lsa x+3 > x² − 6x + 9 → x² − 7x + 6 < 0 → x ∈ [3; 6). Birlashtirsak: [-3; 6)."
        }
      ]
    },
    3: {
      bobId: 3,
      title: "III Bob Nazorat Testi: Trigonometriya Asoslari",
      badgeId: "bob-3",
      durationSec: 15 * 60,
      questions: [
        {
          q: "120° burchakning radian o'lchovini toping:",
          options: ["2π/3", "3π/4", "5π/6", "π/3"],
          correct: 0,
          topic: "Radian o'lchovi (17-§)"
        },
        {
          q: "sin(150°) ning aniq qiymatini toping:",
          options: ["1/2", "√3/2", "−1/2", "√2/2"],
          correct: 0,
          topic: "Keltirish formulalari (26-§)"
        },
        {
          q: "Agar cosα = −3/5 va α uchinchi chorakda bo'lsa, sinα ni toping:",
          options: ["−4/5", "4/5", "3/4", "−3/4"],
          correct: 0,
          topic: "Asosiy ayniyat (21-§)"
        },
        {
          q: "cos(α + β) yig'indisi formulasi to'g'ri ko'rsatilgan qatorni toping:",
          options: ["cosα cosβ − sinα sinβ", "cosα cosβ + sinα sinβ", "sinα cosβ + cosα sinβ", "sinα cosβ − cosα sinβ"],
          correct: 0,
          topic: "Qo'shish formulalari (24-§)"
        },
        {
          q: "sin(2α) ning ikkilangan burchak formulasi:",
          options: ["2 sinα cosα", "cos²α − sin²α", "2 sinα", "sin²α + cos²α"],
          correct: 0,
          topic: "Ikkilangan burchak (25-§)"
        },
        {
          q: "tgα · ctgα ifodaning qiymati har qanday mumkin bo'lgan α da nechaga teng?",
          options: ["1", "0", "−1", "tg²α"],
          correct: 0,
          topic: "Trigonometrik ayniyatlar (21-§)"
        },
        // Litsey masalalari:
        {
          q: "Litsey masalasi: sin(15°) · cos(15°) ko'paytmasining qiymatini hisoblang:",
          options: ["1/4", "1/2", "√3/4", "1/8"],
          correct: 0,
          topic: "Ikkilangan burchak",
          explanation: "sin15°·cos15° = (1/2) · 2sin15°cos15° = (1/2) · sin30° = (1/2) · (1/2) = 1/4."
        },
        {
          q: "Litsey masalasi: Agar tgα + ctgα = 4 bo'lsa, tg²α + ctg²α ni toping:",
          options: ["14", "16", "12", "18"],
          correct: 0,
          topic: "Trigonometrik almashtirish",
          explanation: "(tgα + ctgα)² = tg²α + 2 + ctg²α = 16 → tg²α + ctg²α = 14."
        },
        {
          q: "Litsey masalasi: cos²(10°) + cos²(50°) + cos²(70°) yig'indisini hisoblang:",
          options: ["3/2", "1", "2", "3/4"],
          correct: 0,
          topic: "Darajani pasaytirish",
          explanation: "Darajani pasaytirish formulasi orqali: 3/2 + 1/2(cos20° + cos100° + cos140°) = 3/2 + 0 = 3/2."
        },
        {
          q: "Litsey masalasi: sin(α) + cos(α) = 1.2 bo'lsa, sin(2α) qiymatini toping:",
          options: ["0.44", "0.2", "0.5", "0.4"],
          correct: 0,
          topic: "Asosiy ayniyat va ikkilangan burchak",
          explanation: "(sinα + cosα)² = 1 + sin2α = (1.2)² = 1.44 → sin2α = 0.44."
        }
      ]
    },
    4: {
      bobId: 4,
      title: "IV Bob Nazorat Testi: Progressiyalar",
      badgeId: "bob-4",
      durationSec: 15 * 60,
      questions: [
        {
          q: "Arifmetik progressiyada a₁ = 5, d = 3 bo'lsa, a₁₀ ni toping:",
          options: ["32", "35", "29", "30"],
          correct: 0,
          topic: "Arifmetik progressiya (29-§)"
        },
        {
          q: "1 + 2 + 3 + ... + 20 yig'indisini hisoblang:",
          options: ["210", "200", "190", "220"],
          correct: 0,
          topic: "Arifmetik yig'indi (30-§)"
        },
        {
          q: "Geometrik progressiyada b₁ = 2, q = 3 bo'lsa, b₄ ni toping:",
          options: ["54", "18", "162", "48"],
          correct: 0,
          topic: "Geometrik progressiya (31-§)"
        },
        {
          q: "Cheksiz kamayuvchi geometrik progressiyada b₁ = 6, q = 1/3 bo'lsa, yig'indisini toping:",
          options: ["9", "8", "12", "18"],
          correct: 0,
          topic: "Cheksiz progressiya (33-§)"
        },
        {
          q: "Arifmetik progressiyada a₃ = 11, a₇ = 23 bo'lsa, d ayirmani toping:",
          options: ["3", "4", "2", "5"],
          correct: 0,
          topic: "Ayirma d (29-§)"
        },
        {
          q: "Davriy o'nli kasr 0,(3) oddiy kasr shaklida:",
          options: ["1/3", "3/10", "3/11", "1/9"],
          correct: 0,
          topic: "Cheksiz progressiya (33-§)"
        },
        // Litsey masalalari:
        {
          q: "Litsey masalasi: Arifmetik progressiyada S₁₀ = 150 va S₂₀ = 500 bo'lsa, S₃₀ ni hisoblang:",
          options: ["1050", "950", "1000", "1100"],
          correct: 0,
          topic: "Progressiya xossalari",
          explanation: "S₁₀, S₂₀ − S₁₀, S₃₀ − S₂₀ o'zlari arifmetik progressiya tashkil qiladi: 150, 350, 550. S₃₀ = 500 + 550 = 1050."
        },
        {
          q: "Litsey masalasi: Uchta x, y, z sonlar geometrik progressiya, x, y+2, z esa arifmetik progressiya hosil qiladi. Agar x = 1 bo'lsa, z ni toping (z > 1):",
          options: ["9", "4", "16", "25"],
          correct: 0,
          topic: "Aralash progressiyalar",
          explanation: "y = q, z = q². Arifmetik shart: 2(q+2) = 1 + q² → q² − 2q − 3 = 0 → q = 3 (musbat). z = 3² = 9."
        },
        {
          q: "Litsey masalasi: 1/1·2 + 1/2·3 + 1/3·4 + ... + 1/99·100 yig'indisini toping:",
          options: ["99/100", "1", "100/101", "98/99"],
          correct: 0,
          topic: "Teleskopik yig'indi",
          explanation: "(1 − 1/2) + (1/2 − 1/3) + ... + (1/99 − 1/100) = 1 − 1/100 = 99/100."
        },
        {
          q: "Litsey masalasi: Geometrik progressiyada Sₙ = 3(2ⁿ − 1) bo'lsa, 5-hadi b₅ ni toping:",
          options: ["48", "96", "24", "32"],
          correct: 0,
          topic: "Sₙ dan bₙ ga o'tish",
          explanation: "b₅ = S₅ − S₄ = 3(31) − 3(15) = 93 − 45 = 48."
        }
      ]
    },
    5: {
      bobId: 5,
      title: "V Bob Nazorat Testi: Ehtimollik va Statistika",
      badgeId: "bob-5",
      durationSec: 15 * 60,
      questions: [
        {
          q: "Ikkita tanga tashlanganda ikkalasi ham gerb tushish ehtimolligi qancha?",
          options: ["1/4", "1/2", "3/4", "1/8"],
          correct: 0,
          topic: "Klassik ehtimollik (35-§)"
        },
        {
          q: "Qutidagi 5 qizil va 3 oq shardan olingan sharning oq bo'lish ehtimolligi:",
          options: ["3/8", "5/8", "3/5", "1/2"],
          correct: 0,
          topic: "Hodisaning ehtimolligi (35-§)"
        },
        {
          q: "Muqarrar (aniq ro'y beradigan) hodisaning ehtimolligi nechaga teng?",
          options: ["1", "0", "100", "0.5"],
          correct: 0,
          topic: "Hodisalar (34-§)"
        },
        {
          q: "Zarracha (o'yin suyagi) tashlanganda 4 dan katta son (5 yoki 6) tushish ehtimolligi:",
          options: ["1/3", "1/6", "1/2", "2/3"],
          correct: 0,
          topic: "Klassik ta'rif (35-§)"
        },
        {
          q: "2, 4, 6, 8, 10 sonlarining o'rta arifmetigini toping:",
          options: ["6", "5", "7", "30"],
          correct: 0,
          topic: "Sonli xarakteristikalar (38-§)"
        },
        {
          q: "Mumkin bo'lmagan hodisaning ehtimolligi:",
          options: ["0", "1", "−1", "0.01"],
          correct: 0,
          topic: "Hodisalar (34-§)"
        },
        // Litsey masalalari:
        {
          q: "Litsey masalasi: Ikkita zarracha baravar tashlanganda tushgan ochkolar yig'indisi 8 bo'lish ehtimolligi:",
          options: ["5/36", "1/6", "4/36", "7/36"],
          correct: 0,
          topic: "Murakkab ehtimollik",
          explanation: "Yig'indisi 8 bo'ladigan juftliklar: (2,6), (3,5), (4,4), (5,3), (6,2) — jami 5 ta. P = 5/36."
        },
        {
          q: "Litsey masalasi: Nishonga bir marta o'q uzganda tegish ehtimolligi 0.8. Ikki marta otilganda kamida bir marta tegish ehtimolligi:",
          options: ["0.96", "0.64", "0.8", "0.98"],
          correct: 0,
          topic: "Qarama-qarshi hodisa",
          explanation: "Ikkala safar ham tegmaslik ehtimolligi: (1−0.8)·(1−0.8) = 0.2·0.2 = 0.04. Kamida bittasi tegishi: 1 − 0.04 = 0.96."
        },
        {
          q: "Litsey masalasi: 1 dan 100 gacha bo'lgan natural sonlardan tanlangan sonning 3 ga ham, 5 ga ham bo'linmaslik ehtimolligi:",
          options: ["8/15", "7/15", "2/3", "1/2"],
          correct: 0,
          topic: "To'plamlar va ehtimollik",
          explanation: "3 ga bo'linuvchilar: 33 ta. 5 ga bo'linuvchilar: 20 ta. 15 ga bo'linuvchilar: 6 ta. Jami bo'linadigan: 33+20−6 = 47 ta. Bo'linmaydigan: 53 ta (≈ 8/15)."
        },
        {
          q: "Litsey masalasi: Qutida 3 ta oq va 2 ta qora shar bor. Ketma-ket qaytarmasdan olingan ikkala shar ham oq bo'lish ehtimolligi:",
          options: ["3/10", "1/5", "9/25", "6/25"],
          correct: 0,
          topic: "Shartli ehtimollik",
          explanation: "Birinchi shar oq: 3/5. Ikkinchisi oq: 2/4 = 1/2. P = (3/5) · (1/2) = 3/10."
        }
      ]
    }
  };

  // Shuffle helper: randomizes options so correct answer is not always first option (A)
  function shuffleQuestionOptions(q) {
    var originalCorrect = q.correct || 0;
    var correctText = q.options[originalCorrect];
    var indexed = q.options.map(function (opt, idx) {
      return { text: opt, isCorrect: idx === originalCorrect };
    });
    for (var i = indexed.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = indexed[i];
      indexed[i] = indexed[j];
      indexed[j] = temp;
    }
    var newOptions = indexed.map(function (item) { return item.text; });
    var newCorrect = 0;
    for (var k = 0; k < indexed.length; k++) {
      if (indexed[k].isCorrect) {
        newCorrect = k;
        break;
      }
    }
    return {
      q: q.q,
      options: newOptions,
      correct: newCorrect,
      topic: q.topic,
      explanation: q.explanation || ("To'g'ri javob: " + correctText)
    };
  }

  // Litsey Kirish Imtihoni (Full 60-min Westminster ALWIUT / PM / WIUT Mock Simulator)
  function generateLyceumMock() {
    var tests = [];
    // Har bir bobdan 5 tadan savol olib, jami 25 ta keng qamrovli test hosil qilamiz (5 bob x 5 = 25)
    for (var ch = 1; ch <= 5; ch++) {
      var chQuestions = CHAPTER_EXAMS[ch].questions.slice();
      for (var ci = chQuestions.length - 1; ci > 0; ci--) {
        var cj = Math.floor(Math.random() * (ci + 1));
        var ctmp = chQuestions[ci];
        chQuestions[ci] = chQuestions[cj];
        chQuestions[cj] = ctmp;
      }
      var picked = chQuestions.slice(0, 5).map(shuffleQuestionOptions);
      tests = tests.concat(picked);
    }
    var written = [
      {
        q: "1-yozma masala: y = x² − 6x + 5 parabola bilan y = 2x − 2 to'g'ri chiziqning kesishish nuqtalari abssissalari yig'indisini toping:",
        answer: "8",
        regex: "^\\s*8\\s*$",
        explanation: "x² − 6x + 5 = 2x − 2 → x² − 8x + 7 = 0. Viyet bo'yicha ildizlar yig'indisi: x₁ + x₂ = 8."
      },
      {
        q: "2-yozma masala: x + y = 10 va x² + y² = 58 bo'lsa, x · y ko'paytmani toping:",
        answer: "21",
        regex: "^\\s*21\\s*$",
        explanation: "xy = ((x+y)² − (x²+y²))/2 = (100 − 58)/2 = 42/2 = 21."
      },
      {
        q: "3-yozma masala: sin²(20°) + sin²(70°) ifodaning aniq son qiymatini hisoblang:",
        answer: "1",
        regex: "^\\s*1\\s*$",
        explanation: "sin(70°) = cos(20°). sin²(20°) + cos²(20°) = 1."
      },
      {
        q: "4-yozma masala: Arifmetik progressiyada a₁ = 3, d = 4 bo'lsa, dastlabki 10 ta had yig'indisi S₁₀ ni toping:",
        answer: "210",
        regex: "^\\s*210\\s*$",
        explanation: "S₁₀ = (2·3 + 9·4)/2 · 10 = (6 + 36)/2 · 10 = 21 · 10 = 210."
      },
      {
        q: "5-yozma masala: Ikkita zarracha tashlanganda tushgan ochkolar ko'paytmasi 12 bo'ladigan elementar hodisalar sonini toping:",
        answer: "4",
        regex: "^\\s*4\\s*$",
        explanation: "Juftliklar: (2,6), (3,4), (4,3), (6,2) — jami 4 ta."
      }
    ];

    return {
      title: "Litsey Kirish Imtihoni (Westminster ALWIUT / PM / WIUT Darajasidagi To'liq Simulyator)",
      durationSec: 60 * 60,
      tests: tests,
      written: written
    };
  }

  // Active exam session state
  var currentExam = null;
  var timerInterval = null;
  var activeBlurListener = null;
  var blurCount = 0;

  function escapeXml(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  }

  function getDisplayName() {
    try {
      if (window.JA_STATE && window.JA_STATE.get) {
        var st = window.JA_STATE.get();
        if (st && st.user && st.user.displayName) return st.user.displayName;
      }
    } catch (e) {}
    return "Yosh Matematik";
  }

  // Vektor SVG Mahorat Sertifikatini Dinamik Sintez Qilish (Printable Certificate)
  function generateCertificateSvg(name, chapterTitle, percent, certId) {
    var cleanName = escapeXml(name || getDisplayName());
    var cleanTitle = escapeXml(chapterTitle || "9-Sinf Algebra Kursor");
    var d = new Date();
    var dateStr = d.toLocaleDateString("uz-UZ", { year: "numeric", month: "long", day: "numeric" });
    var cleanCertId = escapeXml(certId || "JA-CERT-" + Math.floor(100000 + Math.random() * 900000));

    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 560" width="100%" height="100%" style="display:block; width:100%; max-width:800px; height:auto; margin:0 auto; font-family:\'Lora\', Georgia, serif; background:#fdfbf7; border-radius:12px; box-shadow:0 12px 36px rgba(0,0,0,0.12);">' +
      '<defs>' +
        '<linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">' +
          '<stop offset="0%" stop-color="#b8860b" />' +
          '<stop offset="50%" stop-color="#ffd700" />' +
          '<stop offset="100%" stop-color="#b8860b" />' +
        '</linearGradient>' +
      '</defs>' +
      '<!-- Tashqi chegara -->' +
      '<rect x="20" y="20" width="760" height="520" rx="8" fill="none" stroke="#2b6b4f" stroke-width="4" />' +
      '<rect x="28" y="28" width="744" height="504" rx="6" fill="none" stroke="#d4af37" stroke-width="1.5" stroke-dasharray="6,4" />' +
      '<!-- Burchak naqshlari -->' +
      '<path d="M36 50 L50 36 M36 36 L64 36 M36 36 L36 64" fill="none" stroke="#2b6b4f" stroke-width="2" />' +
      '<path d="M764 50 L750 36 M764 36 L736 36 M764 36 L764 64" fill="none" stroke="#2b6b4f" stroke-width="2" />' +
      '<path d="M36 510 L50 524 M36 524 L64 524 M36 524 L36 496" fill="none" stroke="#2b6b4f" stroke-width="2" />' +
      '<path d="M764 510 L750 524 M764 524 L736 524 M764 524 L764 496" fill="none" stroke="#2b6b4f" stroke-width="2" />' +
      '<!-- Sarlavha -->' +
      '<text x="400" y="78" text-anchor="middle" font-size="13" letter-spacing="4" fill="#2b6b4f" font-weight="700">JONLI ALGEBRA &bull; MILLIY TA\'LIM PLATFORMASI</text>' +
      '<text x="400" y="128" text-anchor="middle" font-size="30" font-weight="800" fill="#1a221c" letter-spacing="2">MAHORAT SERTIFIKATI</text>' +
      '<line x1="280" y1="142" x2="520" y2="142" stroke="#d4af37" stroke-width="2" />' +
      '<!-- Matn -->' +
      '<text x="400" y="180" text-anchor="middle" font-size="14" fill="#4a554c" font-style="italic">Ushbu sertifikat algebra fanini a\'lo darajada o\'zlashtirgani uchun topshiriladi:</text>' +
      '<!-- O\'quvchi ismi -->' +
      '<text x="400" y="230" text-anchor="middle" font-size="28" font-weight="700" fill="#c24b2a">' + cleanName + '</text>' +
      '<line x1="220" y1="244" x2="580" y2="244" stroke="#1a221c" stroke-width="0.8" />' +
      '<!-- Bob va Natija -->' +
      '<text x="400" y="286" text-anchor="middle" font-size="15" fill="#1a221c" font-weight="600">' + cleanTitle + '</text>' +
      '<text x="400" y="316" text-anchor="middle" font-size="14" fill="#4a554c">Yakuniy nazorat imtihonidan <tspan font-weight="700" fill="#2b6b4f">' + percent + '%</tspan> ball to\'plab, bobni to\'liq o\'zlashtirdi.</text>' +
      '<!-- Muhr (Medallion Seal) -->' +
      '<g transform="translate(400, 410)">' +
        '<circle cx="0" cy="0" r="44" fill="#fcf9ee" stroke="url(#goldGrad)" stroke-width="3" />' +
        '<circle cx="0" cy="0" r="38" fill="none" stroke="#2b6b4f" stroke-width="1.2" stroke-dasharray="3,2" />' +
        '<path d="M0 -16 L5 -5 L16 -5 L7 3 L11 15 L0 8 L-11 15 L-7 3 L-16 -5 L-5 -5 Z" fill="url(#goldGrad)" />' +
        '<text x="0" y="24" text-anchor="middle" font-size="7.5" letter-spacing="1.5" font-weight="700" fill="#2b6b4f">TASDIQLANGAN</text>' +
      '</g>' +
      '<!-- Chap Imzo -->' +
      '<g transform="translate(140, 430)">' +
        '<line x1="0" y1="0" x2="160" y2="0" stroke="#4a554c" stroke-width="1" />' +
        '<text x="80" y="18" text-anchor="middle" font-size="11" fill="#1a221c" font-weight="600">Jonli Algebra Kengashi</text>' +
        '<text x="80" y="32" text-anchor="middle" font-size="9.5" fill="#4a554c">Metodik Baholash Hay\'ati</text>' +
      '</g>' +
      '<!-- O\'ng Sana va ID -->' +
      '<g transform="translate(500, 430)">' +
        '<line x1="0" y1="0" x2="160" y2="0" stroke="#4a554c" stroke-width="1" />' +
        '<text x="80" y="18" text-anchor="middle" font-size="11" fill="#1a221c" font-weight="600">Sana: ' + dateStr + '</text>' +
        '<text x="80" y="32" text-anchor="middle" font-size="9.5" fill="#4a554c">ID: ' + cleanCertId + '</text>' +
      '</g>' +
    '</svg>';
  }

  function getOrCreateModalDialog() {
    var dialog = document.getElementById("examModalDialog");
    if (!dialog) {
      dialog = document.createElement("dialog");
      dialog.id = "examModalDialog";
      dialog.className = "exam-modal";
      dialog.style.cssText = "width:94%; max-width:880px; max-height:92vh; border:1px solid var(--line-strong); border-radius:12px; padding:24px; box-shadow:none; background:var(--white, #fff); color:var(--ink, #1a221c); overflow-y:auto; margin:auto;";
      document.body.appendChild(dialog);
    }
    return dialog;
  }

  function startChapterExam(bobId, containerEl) {
    var rawExam = CHAPTER_EXAMS[bobId];
    if (!rawExam) return;

    var exam = {
      bobId: rawExam.bobId,
      title: rawExam.title,
      badgeId: rawExam.badgeId,
      durationSec: rawExam.durationSec,
      questions: rawExam.questions.map(shuffleQuestionOptions)
    };

    var targetBox = containerEl;
    var dialogMode = false;

    if (!targetBox) {
      targetBox = getOrCreateModalDialog();
      dialogMode = true;
    }

    currentExam = {
      type: "chapter",
      bobId: bobId,
      data: exam,
      userAnswers: {},
      remainingSec: exam.durationSec,
      totalSec: exam.durationSec,
      container: targetBox,
      isDialog: dialogMode
    };

    if (dialogMode && typeof targetBox.showModal === "function") {
      targetBox.showModal();
    }

    renderExamUI();
  }

  function startLyceumMock(containerEl) {
    var mock = generateLyceumMock();
    var targetBox = containerEl;
    var dialogMode = false;

    if (!targetBox) {
      targetBox = getOrCreateModalDialog();
      dialogMode = true;
    }

    blurCount = 0;
    if (activeBlurListener) window.removeEventListener("blur", activeBlurListener);
    activeBlurListener = function () {
      blurCount++;
      var toast = document.getElementById("mockBlurWarningToast");
      if (!toast) {
        toast = document.createElement("div");
        toast.id = "mockBlurWarningToast";
        toast.style.cssText = "position:fixed; top:24px; left:50%; transform:translateX(-50%); background:#c24b2a; color:#fff; padding:12px 24px; border-radius:8px; font-weight:700; z-index:999999; box-shadow:0 6px 20px rgba(0,0,0,0.25); display:flex; align-items:center; gap:8px;";
        document.body.appendChild(toast);
      }
      toast.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>' +
        'Diqqat: Oynadan chalg\'ish qayd etildi (' + blurCount + ' marta). Imtihon qoidalariga rioya qiling!';
      toast.style.display = "flex";
      setTimeout(function () {
        if (toast) toast.style.display = "none";
      }, 4500);
    };
    window.addEventListener("blur", activeBlurListener);

    currentExam = {
      type: "mock",
      data: mock,
      userAnswers: {},
      writtenAnswers: {},
      remainingSec: mock.durationSec,
      totalSec: mock.durationSec,
      container: targetBox,
      isDialog: dialogMode
    };

    if (dialogMode && typeof targetBox.showModal === "function") {
      targetBox.showModal();
    }

    renderMockUI();
  }

  function formatTime(sec) {
    var m = Math.floor(sec / 60);
    var s = sec % 60;
    return String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
  }

  function updateTimerUrgency(badgeEl, remainingSec, totalSec) {
    if (!badgeEl) return;
    var ratio = remainingSec / (totalSec || 1);
    if (ratio > 0.5) {
      badgeEl.style.borderColor = "var(--accent-2, #2b6b4f)";
      badgeEl.style.color = "var(--accent-2, #2b6b4f)";
    } else if (ratio > 0.2) {
      badgeEl.style.borderColor = "#e67e22";
      badgeEl.style.color = "#e67e22";
    } else {
      badgeEl.style.borderColor = "#c24b2a";
      badgeEl.style.color = "#c24b2a";
    }
  }

  function renderExamUI() {
    if (!currentExam) return;
    var exam = currentExam.data;
    var box = currentExam.container;
    box.innerHTML = "";

    var header = document.createElement("div");
    header.className = "exam-session-header";
    header.innerHTML =
      '<div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:14px;">' +
        '<h3 style="margin:0; font-size:1.18rem; color:var(--ink);">' + exam.title + '</h3>' +
        '<div style="display:flex; align-items:center; gap:10px;">' +
          '<div class="exam-timer-badge" id="examTimerBadge" style="display:inline-flex; align-items:center; gap:6px; background:var(--white); border:2px solid var(--accent-2); padding:6px 14px; border-radius:20px; font-weight:700; color:var(--accent-2); font-family:monospace; font-size:1.05rem;">' +
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>' +
            '<span id="examTimerDisplay">' + formatTime(currentExam.remainingSec) + '</span>' +
          '</div>' +
          (currentExam.isDialog ? '<button type="button" class="btn" id="examCloseBtn" style="background:transparent; border:none; cursor:pointer; color:var(--ink-soft); padding:6px;"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>' : '') +
        '</div>' +
      '</div>';
    box.appendChild(header);

    if (currentExam.isDialog) {
      var closeBtn = header.querySelector("#examCloseBtn");
      if (closeBtn) {
        closeBtn.addEventListener("click", function () {
          if (confirm("Imtihondan chiqmoqchimisiz? Natijalar saqlanmaydi.")) {
            if (timerInterval) clearInterval(timerInterval);
            currentExam = null;
            box.close();
          }
        });
      }
    }

    // Question Navigation Matrix (Jump-to-question pills)
    var matrixWrap = document.createElement("div");
    matrixWrap.className = "exam-jump-matrix";
    matrixWrap.style.cssText = "display:flex; flex-wrap:wrap; gap:6px; margin-bottom:18px; padding:10px 14px; background:var(--paper); border:1px solid var(--line); border-radius:10px;";
    exam.questions.forEach(function (q, idx) {
      var pill = document.createElement("button");
      pill.type = "button";
      pill.className = "exam-nav-pill";
      pill.id = "examPill_" + idx;
      pill.textContent = idx + 1;
      pill.style.cssText = "width:32px; height:32px; border-radius:6px; border:1px solid var(--line-strong); background:var(--white); color:var(--ink); font-weight:700; font-size:0.85rem; cursor:pointer; transition:all 0.15s ease;";
      pill.addEventListener("click", function () {
        var card = document.getElementById("examCard_" + idx);
        if (card) card.scrollIntoView({ behavior: "smooth", block: "center" });
      });
      matrixWrap.appendChild(pill);
    });
    box.appendChild(matrixWrap);

    var qList = document.createElement("div");
    qList.className = "exam-q-list";

    exam.questions.forEach(function (q, idx) {
      var qCard = document.createElement("div");
      qCard.id = "examCard_" + idx;
      qCard.className = "exam-q-card";
      qCard.style.cssText = "background:var(--white); border:1px solid var(--line); border-radius:12px; padding:16px; margin-bottom:16px;";

      var qTitle = document.createElement("div");
      qTitle.style.cssText = "font-weight:600; margin-bottom:12px; color:var(--ink);";
      qTitle.innerHTML = "<strong>" + (idx + 1) + ".</strong> " + q.q;
      qCard.appendChild(qTitle);

      var optWrap = document.createElement("div");
      optWrap.style.cssText = "display:grid; grid-template-columns:1fr; gap:8px;";

      q.options.forEach(function (opt, oIdx) {
        var optLabel = document.createElement("label");
        optLabel.style.cssText = "display:flex; align-items:center; gap:10px; padding:8px 12px; border:1px solid var(--line); border-radius:8px; cursor:pointer; background:var(--paper); transition:all 0.15s ease;";
        var rad = document.createElement("input");
        rad.type = "radio";
        rad.name = "q_" + idx;
        rad.value = oIdx;
        rad.checked = currentExam.userAnswers[idx] === oIdx;

        rad.addEventListener("change", function () {
          currentExam.userAnswers[idx] = oIdx;
          var pill = document.getElementById("examPill_" + idx);
          if (pill) {
            pill.style.background = "var(--accent-2, #2b6b4f)";
            pill.style.color = "#ffffff";
            pill.style.borderColor = "var(--accent-2, #2b6b4f)";
          }
        });

        optLabel.appendChild(rad);
        optLabel.appendChild(document.createTextNode(opt));
        optWrap.appendChild(optLabel);
      });

      qCard.appendChild(optWrap);
      qList.appendChild(qCard);
    });

    box.appendChild(qList);

    var actionRow = document.createElement("div");
    actionRow.style.cssText = "margin-top:20px; text-align:center;";
    var submitBtn = document.createElement("button");
    submitBtn.type = "button";
    submitBtn.className = "btn";
    submitBtn.style.cssText = "background:var(--accent-2); color:#fff; padding:12px 28px; font-weight:700; border-radius:10px; font-size:1rem; cursor:pointer;";
    submitBtn.textContent = "Imtihonni topshirish va natijani ko'rish";
    submitBtn.addEventListener("click", finishExam);
    actionRow.appendChild(submitBtn);
    box.appendChild(actionRow);

    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(function () {
      if (!currentExam) {
        clearInterval(timerInterval);
        return;
      }
      currentExam.remainingSec--;
      var disp = document.getElementById("examTimerDisplay");
      var badge = document.getElementById("examTimerBadge");
      if (disp) disp.textContent = formatTime(currentExam.remainingSec);
      if (badge) updateTimerUrgency(badge, currentExam.remainingSec, currentExam.totalSec);

      if (currentExam.remainingSec <= 0) {
        clearInterval(timerInterval);
        finishExam();
      }
    }, 1000);
  }

  function finishExam() {
    if (timerInterval) clearInterval(timerInterval);
    if (!currentExam) return;

    var exam = currentExam.data;
    var correctCount = 0;
    var weakTopics = [];

    exam.questions.forEach(function (q, idx) {
      var userAns = currentExam.userAnswers[idx];
      if (userAns === q.correct) {
        correctCount++;
      } else {
        weakTopics.push(q.topic);
      }
    });

    var total = exam.questions.length;
    var percent = Math.round((correctCount / total) * 100);
    var isPassed = percent >= 80;

    // Gamification rewards & state machine persistence
    if (window.JA_STATE) {
      window.JA_STATE.update(function (st) {
        if (!st.progress.chapterExams) st.progress.chapterExams = {};
        st.progress.chapterExams[exam.bobId] = {
          score: correctCount,
          total: total,
          timestamp: Date.now(),
          passed: isPassed
        };
      });
    }

    if (window.JA_GAMIFICATION) {
      if (isPassed) {
        window.JA_GAMIFICATION.addXp(100);
        window.JA_GAMIFICATION.unlockBadge(exam.badgeId);
      } else {
        window.JA_GAMIFICATION.addXp(correctCount * 5);
      }
    }

    if (window.JA_SOUND) {
      if (isPassed) {
        window.JA_SOUND.playFanfare();
      } else {
        window.JA_SOUND.playCorrect();
      }
    }

    var certId = "JA-" + exam.bobId + "-" + Math.floor(100000 + Math.random() * 900000);
    var certSvg = isPassed ? generateCertificateSvg(getDisplayName(), exam.title, percent, certId) : "";

    var box = currentExam.container;
    box.innerHTML =
      '<div class="exam-result-card" style="background:var(--white); border:2px solid ' + (isPassed ? "var(--accent-2)" : "var(--accent)") + '; border-radius:16px; padding:24px; text-align:center; box-shadow:0 8px 24px rgba(0,0,0,0.06);">' +
        '<div style="font-size:2.8rem; font-weight:800; color:' + (isPassed ? "var(--accent-2)" : "var(--accent)") + '; margin-bottom:8px;">' + percent + '%</div>' +
        '<h3 style="margin:0 0 12px; font-size:1.3rem;">' + (isPassed ? "Ofarin! Bobni a'lo darajada o'zlashtirdingiz!" : "Yaxshi natija, lekin hali takrorlash kerak!") + '</h3>' +
        '<p style="color:var(--ink-soft); font-size:1rem; margin-bottom:16px;">Jami <strong>' + total + '</strong> ta savoldan <strong>' + correctCount + '</strong> tasiga to\'g\'ri javob berdingiz.</p>' +
        (isPassed ? '<div style="background:rgba(43,107,79,0.1); color:var(--accent-2); padding:10px 16px; border-radius:10px; font-weight:700; margin-bottom:20px;">+100 XP va Bob Medali qo\'lga kiritildi!</div>' : '') +
        (weakTopics.length > 0 ? (
          '<div style="text-align:left; background:var(--paper); border:1px solid var(--line); border-radius:10px; padding:14px; margin:16px 0;">' +
            '<strong>Takrorlash tavsiya etiladigan mavzular:</strong>' +
            '<ul style="margin:8px 0 0; padding-left:20px; line-height:1.5;">' +
              weakTopics.map(function (t) { return '<li>' + t + '</li>'; }).join('') +
            '</ul>' +
          '</div>'
        ) : '') +
        (isPassed ? (
          '<div class="cert-presentation" style="margin:24px 0;">' +
            '<h4 style="margin:0 0 14px; font-size:1.1rem; color:var(--ink);">Rasmiy Mahorat Sertifikati</h4>' +
            '<div id="certPreviewWrap" style="overflow-x:auto; margin-bottom:16px;">' + certSvg + '</div>' +
            '<div style="display:flex; justify-content:center; gap:12px; flex-wrap:wrap;">' +
              '<button type="button" class="btn" id="btnPrintCertBtn" style="background:var(--accent-2); color:#fff; padding:10px 20px; border-radius:8px; font-weight:700; cursor:pointer; display:inline-flex; align-items:center; gap:8px;">' +
                '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>' +
                'Chop Etish (Print / PDF)' +
              '</button>' +
              '<button type="button" class="btn" id="btnDownloadCertSvg" style="background:var(--white); border:1px solid var(--line-strong); color:var(--ink); padding:10px 20px; border-radius:8px; font-weight:700; cursor:pointer; display:inline-flex; align-items:center; gap:8px;">' +
                '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>' +
                'SVG Yuklab Olish' +
              '</button>' +
            '</div>' +
          '</div>'
        ) : '') +
        '<div style="margin-top:20px;">' +
          '<button type="button" class="btn" onclick="location.reload()" style="background:var(--accent); color:#fff; padding:10px 24px; border-radius:8px; font-weight:600; cursor:pointer;">Qaytadan topshirish</button>' +
        '</div>' +
      '</div>';

    if (isPassed) {
      var printBtn = box.querySelector("#btnPrintCertBtn");
      if (printBtn) {
        printBtn.addEventListener("click", function () {
          var pWin = window.open("", "_blank");
          if (pWin) {
            pWin.document.write('<html><head><title>Mahorat Sertifikati — ' + escapeXml(getDisplayName()) + '</title><style>@page{size:landscape;margin:1cm;} body{margin:0;display:flex;justify-content:center;align-items:center;min-height:100vh;}</style></head><body>' + certSvg + '<script>window.onload=function(){window.print();};<\/script></body></html>');
            pWin.document.close();
          }
        });
      }
      var dlBtn = box.querySelector("#btnDownloadCertSvg");
      if (dlBtn) {
        dlBtn.addEventListener("click", function () {
          var blob = new Blob([certSvg], { type: "image/svg+xml;charset=utf-8" });
          var url = URL.createObjectURL(blob);
          var a = document.createElement("a");
          a.href = url;
          a.download = "jonli-algebra-sertifikat-" + exam.bobId + ".svg";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        });
      }
    }
  }

  function renderMockUI() {
    if (!currentExam) return;
    var mock = currentExam.data;
    var box = currentExam.container;
    box.innerHTML = "";

    var header = document.createElement("div");
    header.className = "mock-session-header";
    header.innerHTML =
      '<div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:14px;">' +
        '<div>' +
          '<h3 style="margin:0; font-size:1.2rem; color:var(--ink);">' + mock.title + '</h3>' +
          '<small style="color:var(--ink-soft);">25 ta test savoli + 5 ta yozma masala (Jami 30 ta) &bull; 60 daqiqa</small>' +
        '</div>' +
        '<div style="display:flex; align-items:center; gap:10px;">' +
          '<div class="exam-timer-badge" id="mockTimerBadge" style="display:inline-flex; align-items:center; gap:6px; background:var(--white); border:2px solid var(--accent); padding:6px 14px; border-radius:20px; font-weight:700; color:var(--accent); font-family:monospace; font-size:1.1rem;">' +
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>' +
            '<span id="mockTimerDisplay">' + formatTime(currentExam.remainingSec) + '</span>' +
          '</div>' +
          (currentExam.isDialog ? '<button type="button" class="btn" id="mockCloseBtn" style="background:transparent; border:none; cursor:pointer; color:var(--ink-soft); padding:6px;"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>' : '') +
        '</div>' +
      '</div>';
    box.appendChild(header);

    if (currentExam.isDialog) {
      var closeBtn = header.querySelector("#mockCloseBtn");
      if (closeBtn) {
        closeBtn.addEventListener("click", function () {
          if (confirm("Simulyatsiyadan chiqmoqchimisiz? Natijalar saqlanmaydi.")) {
            if (timerInterval) clearInterval(timerInterval);
            if (activeBlurListener) window.removeEventListener("blur", activeBlurListener);
            currentExam = null;
            box.close();
          }
        });
      }
    }

    // Jump-to-question matrix for mock exam (1..30)
    var matrixWrap = document.createElement("div");
    matrixWrap.className = "exam-jump-matrix";
    matrixWrap.style.cssText = "display:flex; flex-wrap:wrap; gap:5px; margin-bottom:18px; padding:10px 14px; background:var(--paper); border:1px solid var(--line); border-radius:10px;";
    for (var i = 0; i < 30; i++) {
      var pill = document.createElement("button");
      pill.type = "button";
      pill.className = "mock-nav-pill";
      pill.id = "mockPill_" + i;
      pill.textContent = i + 1;
      pill.style.cssText = "width:30px; height:30px; border-radius:6px; border:1px solid var(--line-strong); background:var(--white); color:var(--ink); font-weight:700; font-size:0.8rem; cursor:pointer; transition:all 0.15s ease;";
      (function (idx) {
        pill.addEventListener("click", function () {
          var targetId = idx < 25 ? "mockTestCard_" + idx : "mockWrittenCard_" + (idx - 25);
          var card = document.getElementById(targetId);
          if (card) card.scrollIntoView({ behavior: "smooth", block: "center" });
        });
      })(i);
      matrixWrap.appendChild(pill);
    }
    box.appendChild(matrixWrap);

    // Render 25 Tests
    var testsBox = document.createElement("div");
    testsBox.innerHTML = '<h4 style="margin:20px 0 12px; color:var(--accent-2); border-bottom:2px solid var(--line); padding-bottom:6px;">I Qism: 25 ta Variantli Test</h4>';

    mock.tests.forEach(function (q, idx) {
      var qCard = document.createElement("div");
      qCard.id = "mockTestCard_" + idx;
      qCard.style.cssText = "background:var(--white); border:1px solid var(--line); border-radius:10px; padding:14px; margin-bottom:12px;";
      qCard.innerHTML = "<div style='font-weight:600; margin-bottom:8px;'><strong>" + (idx + 1) + ".</strong> " + q.q + "</div>";

      var optWrap = document.createElement("div");
      optWrap.style.cssText = "display:grid; grid-template-columns:1fr; gap:6px;";
      q.options.forEach(function (opt, oIdx) {
        var lbl = document.createElement("label");
        lbl.style.cssText = "display:flex; align-items:center; gap:8px; padding:6px 10px; border:1px solid var(--line); border-radius:6px; cursor:pointer; background:var(--paper); font-size:0.95rem;";
        var rad = document.createElement("input");
        rad.type = "radio";
        rad.name = "mock_t_" + idx;
        rad.value = oIdx;
        rad.checked = currentExam.userAnswers[idx] === oIdx;
        rad.addEventListener("change", function () {
          currentExam.userAnswers[idx] = oIdx;
          var pill = document.getElementById("mockPill_" + idx);
          if (pill) {
            pill.style.background = "var(--accent-2, #2b6b4f)";
            pill.style.color = "#ffffff";
            pill.style.borderColor = "var(--accent-2, #2b6b4f)";
          }
        });
        lbl.appendChild(rad);
        lbl.appendChild(document.createTextNode(opt));
        optWrap.appendChild(lbl);
      });
      qCard.appendChild(optWrap);
      testsBox.appendChild(qCard);
    });
    box.appendChild(testsBox);

    // Render 5 Written Problems
    var writtenBox = document.createElement("div");
    writtenBox.innerHTML = '<h4 style="margin:24px 0 12px; color:var(--accent); border-bottom:2px solid var(--line); padding-bottom:6px;">II Qism: 5 ta Yozma Masala (Aniq son yoki javob kiriting)</h4>';

    mock.written.forEach(function (w, wIdx) {
      var wCard = document.createElement("div");
      wCard.id = "mockWrittenCard_" + wIdx;
      wCard.style.cssText = "background:var(--white); border:1px solid var(--line); border-radius:10px; padding:14px; margin-bottom:12px;";
      wCard.innerHTML = "<div style='font-weight:600; margin-bottom:8px;'><strong>" + (wIdx + 26) + ".</strong> " + w.q + "</div>";

      var inp = document.createElement("input");
      inp.type = "text";
      inp.placeholder = "Javobingizni kiriting...";
      inp.style.cssText = "width:100%; max-width:280px; padding:8px 12px; border:1px solid var(--line-strong); border-radius:6px; font-size:0.95rem; background:var(--paper);";
      inp.value = currentExam.writtenAnswers[wIdx] || "";
      inp.addEventListener("input", function () {
        var val = inp.value.trim();
        currentExam.writtenAnswers[wIdx] = val;
        var pill = document.getElementById("mockPill_" + (wIdx + 25));
        if (pill) {
          if (val) {
            pill.style.background = "var(--accent, #c24b2a)";
            pill.style.color = "#ffffff";
            pill.style.borderColor = "var(--accent, #c24b2a)";
          } else {
            pill.style.background = "var(--white)";
            pill.style.color = "var(--ink)";
            pill.style.borderColor = "var(--line-strong)";
          }
        }
      });

      wCard.appendChild(inp);
      writtenBox.appendChild(wCard);
    });
    box.appendChild(writtenBox);

    var submitWrap = document.createElement("div");
    submitWrap.style.cssText = "margin:28px 0; text-align:center;";
    var btn = document.createElement("button");
    btn.className = "btn";
    btn.style.cssText = "background:var(--accent); color:#fff; font-size:1.1rem; font-weight:700; padding:14px 36px; border-radius:10px; cursor:pointer;";
    btn.textContent = "To'liq simulyatsiyani yakunlash va hisobotni ko'rish";
    btn.addEventListener("click", finishMock);
    submitWrap.appendChild(btn);
    box.appendChild(submitWrap);

    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(function () {
      if (!currentExam) {
        clearInterval(timerInterval);
        return;
      }
      currentExam.remainingSec--;
      var disp = document.getElementById("mockTimerDisplay");
      var badge = document.getElementById("mockTimerBadge");
      if (disp) disp.textContent = formatTime(currentExam.remainingSec);
      if (badge) updateTimerUrgency(badge, currentExam.remainingSec, currentExam.totalSec);

      if (currentExam.remainingSec <= 0) {
        clearInterval(timerInterval);
        finishMock();
      }
    }, 1000);
  }

  function finishMock() {
    if (timerInterval) clearInterval(timerInterval);
    if (activeBlurListener) {
      window.removeEventListener("blur", activeBlurListener);
      activeBlurListener = null;
    }
    if (!currentExam) return;

    var mock = currentExam.data;
    var testCorrect = 0;
    var writtenCorrect = 0;

    mock.tests.forEach(function (q, idx) {
      if (currentExam.userAnswers[idx] === q.correct) testCorrect++;
    });

    mock.written.forEach(function (w, wIdx) {
      var val = currentExam.writtenAnswers[wIdx] || "";
      if (val === w.answer || (w.regex && new RegExp(w.regex, "i").test(val))) {
        writtenCorrect++;
      }
    });

    var totalScore = testCorrect + (writtenCorrect * 2); // Written problems have 2x weight
    var maxScore = 25 + (5 * 2); // 35
    var percent = Math.round((totalScore / maxScore) * 100);

    var rank = "Tayyorgarlik talab etiladi";
    if (percent >= 85) rank = "Westminster (ALWIUT) & PM grantiga 99% tayyor!";
    else if (percent >= 70) rank = "Aniq fanlar litseylari grantiga tavsiya etiladi";
    else if (percent >= 50) rank = "O'rtacha daraja (mustahkamlash zarur)";

    // Update state store
    if (window.JA_STATE) {
      window.JA_STATE.update(function (st) {
        if (!st.progress.lyceumMock) st.progress.lyceumMock = { bestScore: 0, attempts: 0, lastTaken: 0 };
        st.progress.lyceumMock.attempts = (st.progress.lyceumMock.attempts || 0) + 1;
        st.progress.lyceumMock.bestScore = Math.max(st.progress.lyceumMock.bestScore || 0, totalScore);
        st.progress.lyceumMock.lastTaken = Date.now();
      });
    }

    if (window.JA_GAMIFICATION) {
      window.JA_GAMIFICATION.addXp(totalScore * 8);
      if (percent >= 85) {
        window.JA_GAMIFICATION.unlockBadge("lyceum-grandprix");
      }
    }

    if (window.JA_SOUND) {
      if (percent >= 70) window.JA_SOUND.playFanfare();
      else window.JA_SOUND.playCorrect();
    }

    var certId = "JA-MOCK-" + Math.floor(100000 + Math.random() * 900000);
    var certSvg = percent >= 80 ? generateCertificateSvg(getDisplayName(), "Litsey Kirish Imtihoni Simulyatori", percent, certId) : "";

    var box = currentExam.container;
    box.innerHTML =
      '<div class="mock-result-card" style="background:var(--white); border:2px solid var(--line-strong); border-radius:16px; padding:28px; text-align:center; box-shadow:0 10px 30px rgba(0,0,0,0.06);">' +
        '<div style="font-size:3rem; font-weight:800; color:var(--accent); margin-bottom:8px;">' + totalScore + ' / ' + maxScore + ' ball</div>' +
        '<div style="display:inline-block; background:rgba(194,75,42,0.1); color:var(--accent); font-weight:700; padding:6px 14px; border-radius:20px; margin-bottom:14px;">Umumiy natija: ' + percent + '%</div>' +
        '<h3 style="margin:0 0 10px; font-size:1.4rem;">' + rank + '</h3>' +
        '<p style="color:var(--ink-soft); max-width:600px; margin:0 auto 20px;">Test qismidan: <strong>' + testCorrect + ' / 25</strong>, Yozma qismidan: <strong>' + writtenCorrect + ' / 5</strong> to\'g\'ri yechildi.' +
        (blurCount > 0 ? '<br><span style="color:#c24b2a; font-size:0.9rem;">Imtihon paytida chalg\'ishlar: ' + blurCount + ' marta.</span>' : '') +
        '</p>' +
        (percent >= 80 ? (
          '<div class="cert-presentation" style="margin:24px 0;">' +
            '<h4 style="margin:0 0 14px; font-size:1.1rem; color:var(--ink);">Litsey Darajasi Sertifikati</h4>' +
            '<div id="mockCertPreviewWrap" style="overflow-x:auto; margin-bottom:16px;">' + certSvg + '</div>' +
            '<div style="display:flex; justify-content:center; gap:12px; flex-wrap:wrap;">' +
              '<button type="button" class="btn" id="btnPrintMockCertBtn" style="background:var(--accent); color:#fff; padding:10px 20px; border-radius:8px; font-weight:700; cursor:pointer; display:inline-flex; align-items:center; gap:8px;">' +
                '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>' +
                'Chop Etish (Print / PDF)' +
              '</button>' +
              '<button type="button" class="btn" id="btnDownloadMockCertSvg" style="background:var(--white); border:1px solid var(--line-strong); color:var(--ink); padding:10px 20px; border-radius:8px; font-weight:700; cursor:pointer; display:inline-flex; align-items:center; gap:8px;">' +
                '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>' +
                'SVG Yuklab Olish' +
              '</button>' +
            '</div>' +
          '</div>'
        ) : '') +
        '<button type="button" class="btn" onclick="location.reload()" style="background:var(--accent-2); color:#fff; padding:12px 28px; border-radius:8px; font-weight:700; cursor:pointer;">Bosh sahifaga qaytish</button>' +
      '</div>';

    if (percent >= 80) {
      var pBtn = box.querySelector("#btnPrintMockCertBtn");
      if (pBtn) {
        pBtn.addEventListener("click", function () {
          var pWin = window.open("", "_blank");
          if (pWin) {
            pWin.document.write('<html><head><title>Litsey Sertifikati — ' + escapeXml(getDisplayName()) + '</title><style>@page{size:landscape;margin:1cm;} body{margin:0;display:flex;justify-content:center;align-items:center;min-height:100vh;}</style></head><body>' + certSvg + '<script>window.onload=function(){window.print();};<\/script></body></html>');
            pWin.document.close();
          }
        });
      }
      var dBtn = box.querySelector("#btnDownloadMockCertSvg");
      if (dBtn) {
        dBtn.addEventListener("click", function () {
          var blob = new Blob([certSvg], { type: "image/svg+xml;charset=utf-8" });
          var url = URL.createObjectURL(blob);
          var a = document.createElement("a");
          a.href = url;
          a.download = "jonli-algebra-litsey-sertifikat.svg";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        });
      }
    }
  }

  window.JA_EXAM = {
    CHAPTER_EXAMS: CHAPTER_EXAMS,
    startChapterExam: startChapterExam,
    startLyceumMock: startLyceumMock,
    generateCertificateSvg: generateCertificateSvg
  };
})();
