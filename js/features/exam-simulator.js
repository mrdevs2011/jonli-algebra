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

  // Litsey Kirish Imtihoni (Full 60-min Westminster ALWIUT / PM / WIUT Mock Simulator)
  function generateLyceumMock() {
    var allQuestions = [];
    // Collect from all chapters
    for (var ch = 1; ch <= 5; ch++) {
      allQuestions = allQuestions.concat(CHAPTER_EXAMS[ch].questions);
    }
    // Take 25 tests + 5 open written problems
    var tests = allQuestions.slice(0, 25);
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

  function startChapterExam(bobId, containerEl) {
    var exam = CHAPTER_EXAMS[bobId];
    if (!exam || !containerEl) return;

    currentExam = {
      type: "chapter",
      bobId: bobId,
      data: exam,
      userAnswers: {},
      remainingSec: exam.durationSec,
      container: containerEl
    };

    renderExamUI();
  }

  function startLyceumMock(containerEl) {
    if (!containerEl) return;
    var mock = generateLyceumMock();

    currentExam = {
      type: "mock",
      data: mock,
      userAnswers: {},
      writtenAnswers: {},
      remainingSec: mock.durationSec,
      container: containerEl
    };

    renderMockUI();
  }

  function formatTime(sec) {
    var m = Math.floor(sec / 60);
    var s = sec % 60;
    return String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
  }

  function renderExamUI() {
    if (!currentExam) return;
    var exam = currentExam.data;
    var box = currentExam.container;
    box.innerHTML = "";

    var header = document.createElement("div");
    header.className = "exam-session-header";
    header.innerHTML =
      '<div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:16px;">' +
        '<h3 style="margin:0; font-size:1.15rem; color:var(--ink);">' + exam.title + '</h3>' +
        '<div class="exam-timer-badge" id="examTimerBadge" style="display:inline-flex; align-items:center; gap:6px; background:var(--white); border:1px solid var(--line-strong); padding:6px 14px; border-radius:20px; font-weight:700; color:var(--accent); font-family:monospace; font-size:1.05rem;">' +
          '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>' +
          '<span id="examTimerDisplay">' + formatTime(currentExam.remainingSec) + '</span>' +
        '</div>' +
      '</div>';
    box.appendChild(header);

    var qList = document.createElement("div");
    qList.className = "exam-q-list";

    exam.questions.forEach(function (q, idx) {
      var qCard = document.createElement("div");
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
      if (disp) disp.textContent = formatTime(currentExam.remainingSec);

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

    // Gamification rewards
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

    var box = currentExam.container;
    box.innerHTML =
      '<div class="exam-result-card" style="background:var(--white); border:2px solid ' + (isPassed ? "var(--accent-2)" : "var(--accent)") + '; border-radius:16px; padding:24px; text-align:center; box-shadow:0 8px 24px rgba(0,0,0,0.06);">' +
        '<div style="font-size:2.8rem; font-weight:800; color:' + (isPassed ? "var(--accent-2)" : "var(--accent)") + '; margin-bottom:8px;">' + percent + '%</div>' +
        '<h3 style="margin:0 0 12px; font-size:1.3rem;">' + (isPassed ? "Ofarin! Bobni a'lo darajada o'zlashtirdingiz!" : "Yaxshi natija, lekin hali takrorlash kerak!") + '</h3>' +
        '<p style="color:var(--ink-soft); font-size:1rem; margin-bottom:16px;">Jami <strong>' + total + '</strong> ta savoldan <strong>' + correctCount + '</strong> tasiga to\'g\'ri javob berdingiz.</p>' +
        (isPassed ? '<div style="background:rgba(43,107,79,0.1); color:var(--accent-2); padding:10px 16px; border-radius:10px; font-weight:700; margin-bottom:16px;">+100 XP va Bob Medali qo\'lga kiritildi!</div>' : '') +
        (weakTopics.length > 0 ? (
          '<div style="text-align:left; background:var(--paper); border:1px solid var(--line); border-radius:10px; padding:14px; margin:16px 0;">' +
            '<strong>Takrorlash tavsiya etiladigan mavzular:</strong>' +
            '<ul style="margin:8px 0 0; padding-left:20px; line-height:1.5;">' +
              weakTopics.map(function (t) { return '<li>' + t + '</li>'; }).join('') +
            '</ul>' +
          '</div>'
        ) : '') +
        '<button type="button" class="btn" onclick="location.reload()" style="background:var(--accent); color:#fff; padding:10px 22px; border-radius:8px; font-weight:600; cursor:pointer;">Qaytadan topshirish</button>' +
      '</div>';
  }

  function renderMockUI() {
    if (!currentExam) return;
    var mock = currentExam.data;
    var box = currentExam.container;
    box.innerHTML = "";

    var header = document.createElement("div");
    header.className = "mock-session-header";
    header.innerHTML =
      '<div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:16px;">' +
        '<div>' +
          '<h3 style="margin:0; font-size:1.2rem; color:var(--ink);">' + mock.title + '</h3>' +
          '<small style="color:var(--ink-soft);">25 ta test savoli + 5 ta yozma masala (Jami 30 ta)</small>' +
        '</div>' +
        '<div class="exam-timer-badge" style="display:inline-flex; align-items:center; gap:6px; background:var(--white); border:1px solid var(--line-strong); padding:6px 14px; border-radius:20px; font-weight:700; color:var(--accent); font-family:monospace; font-size:1.1rem;">' +
          '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>' +
          '<span id="mockTimerDisplay">' + formatTime(currentExam.remainingSec) + '</span>' +
        '</div>' +
      '</div>';
    box.appendChild(header);

    // Render 25 Tests
    var testsBox = document.createElement("div");
    testsBox.innerHTML = '<h4 style="margin:20px 0 12px; color:var(--accent-2); border-bottom:2px solid var(--line); padding-bottom:6px;">I Qism: 25 ta Variantli Test</h4>';

    mock.tests.forEach(function (q, idx) {
      var qCard = document.createElement("div");
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
      wCard.style.cssText = "background:var(--white); border:1px solid var(--line); border-radius:10px; padding:14px; margin-bottom:12px;";
      wCard.innerHTML = "<div style='font-weight:600; margin-bottom:8px;'><strong>" + (wIdx + 26) + ".</strong> " + w.q + "</div>";

      var inp = document.createElement("input");
      inp.type = "text";
      inp.placeholder = "Javobingizni kiriting...";
      inp.style.cssText = "width:100%; max-width:280px; padding:8px 12px; border:1px solid var(--line-strong); border-radius:6px; font-size:0.95rem; background:var(--paper);";
      inp.value = currentExam.writtenAnswers[wIdx] || "";
      inp.addEventListener("input", function () {
        currentExam.writtenAnswers[wIdx] = inp.value.trim();
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
      if (disp) disp.textContent = formatTime(currentExam.remainingSec);

      if (currentExam.remainingSec <= 0) {
        clearInterval(timerInterval);
        finishMock();
      }
    }, 1000);
  }

  function finishMock() {
    if (timerInterval) clearInterval(timerInterval);
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

    var box = currentExam.container;
    box.innerHTML =
      '<div class="mock-result-card" style="background:var(--white); border:2px solid var(--line-strong); border-radius:16px; padding:28px; text-align:center; box-shadow:0 10px 30px rgba(0,0,0,0.06);">' +
        '<div style="font-size:3rem; font-weight:800; color:var(--accent); margin-bottom:8px;">' + totalScore + ' / ' + maxScore + ' ball</div>' +
        '<div style="display:inline-block; background:rgba(194,75,42,0.1); color:var(--accent); font-weight:700; padding:6px 14px; border-radius:20px; margin-bottom:14px;">Umumiy natija: ' + percent + '%</div>' +
        '<h3 style="margin:0 0 10px; font-size:1.4rem;">' + rank + '</h3>' +
        '<p style="color:var(--ink-soft); max-width:600px; margin:0 auto 20px;">Test qismidan: <strong>' + testCorrect + ' / 25</strong>, Yozma qismidan: <strong>' + writtenCorrect + ' / 5</strong> to\'g\'ri yechildi.</p>' +
        '<button type="button" class="btn" onclick="location.reload()" style="background:var(--accent-2); color:#fff; padding:12px 28px; border-radius:8px; font-weight:700; cursor:pointer;">Bosh sahifaga qaytish</button>' +
      '</div>';
  }

  window.JA_EXAM = {
    CHAPTER_EXAMS: CHAPTER_EXAMS,
    startChapterExam: startChapterExam,
    startLyceumMock: startLyceumMock
  };
})();
