/**
 * Jonli Algebra — Apex Dashboard & Ecosystem Engine
 * 1. O'quv dasturi va darslar ro'yxati
 * 2. Gamifikatsiya vitrinasi (Medallar, daraja, XP)
 * 3. Litsey Kirish Simulyatori (Westminster ALWIUT, PM, WIUT)
 * 4. Jonli Formulalar Qomusi (65 ta fundamental formula, qidiruv va deep linklar)
 */
(function () {
  "use strict";

  var root = document.getElementById("app");
  if (!root) return;

  if (typeof KA === "undefined" || typeof KA_DARSLAR === "undefined" || typeof KA_BOBLAR === "undefined") {
    root.innerHTML = '<p class="note">Yuklash xatosi. <code>js/darslar.js</code> va <code>js/progress.js</code> ni tekshiring.</p>';
    return;
  }

  var counts = KA.counts();
  var percent = counts.total ? Math.round((counts.ready / counts.total) * 100) : 0;
  var LESSONS_BASE = "lessons/math/9/";

  function escapeHtml(s) {
    return String(s || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function isLessonDone(lessonId) {
    try {
      if (window.JA_STATE && window.JA_STATE.get) {
        var st = window.JA_STATE.get();
        if (st && st.progress && st.progress.completedLessons && st.progress.completedLessons[lessonId]) {
          return true;
        }
      }
    } catch (e) {}
    try {
      if (window.KA && KA.state) {
        return KA.state(lessonId) === "done";
      }
    } catch (e) {}
    return false;
  }

  var LESSON_META = {
    1: { vaqt: "15 daq", tag: "Ta'rif" },
    2: { vaqt: "20 daq", tag: "Grafik" },
    3: { vaqt: "20 daq", tag: "Koeffitsiyent" },
    4: { vaqt: "25 daq", tag: "Uch koordinatasi" },
    5: { vaqt: "35 daq", tag: "5 qadamli yasash" },
    6: { vaqt: "25 daq", tag: "Tengsizlik" },
    7: { vaqt: "25 daq", tag: "Grafik usul" },
    8: { vaqt: "30 daq", tag: "Intervallar" },
    9: { vaqt: "20 daq", tag: "Aniqlanish sohasi" },
    10: { vaqt: "25 daq", tag: "O'sish-kamayish" },
    11: { vaqt: "20 daq", tag: "Juftlik-toqlik" },
    12: { vaqt: "30 daq", tag: "Darajali ifoda" },
    13: { vaqt: "25 daq", tag: "Sistemalar" },
    14: { vaqt: "30 daq", tag: "Yechish usullari" },
    15: { vaqt: "30 daq", tag: "Tengsizliklar sistemasi" },
    16: { vaqt: "25 daq", tag: "Isbotlash" },
    17: { vaqt: "20 daq", tag: "Radian o'lchovi" },
    18: { vaqt: "25 daq", tag: "Nuqtani burish" },
    19: { vaqt: "35 daq", tag: "Sin, Cos, Tg" },
    20: { vaqt: "20 daq", tag: "Chorak ishoralari" },
    21: { vaqt: "25 daq", tag: "Asosiy ayniyatlar" },
    22: { vaqt: "30 daq", tag: "Ayniyatlar isboti" },
    23: { vaqt: "20 daq", tag: "Simmetriya" },
    24: { vaqt: "40 daq", tag: "Qo'shish formulalari" },
    25: { vaqt: "25 daq", tag: "2α burchak" },
    26: { vaqt: "35 daq", tag: "Keltirish formulalari" },
    27: { vaqt: "35 daq", tag: "Ko'paytmaga keltirish" },
    28: { vaqt: "20 daq", tag: "Ketma-ketliklar" },
    29: { vaqt: "25 daq", tag: "Arifmetik progressiya" },
    30: { vaqt: "30 daq", tag: "Progressiya yig'indisi" },
    31: { vaqt: "25 daq", tag: "Geometrik progressiya" },
    32: { vaqt: "30 daq", tag: "Geometrik yig'indi" },
    33: { vaqt: "30 daq", tag: "Cheksiz kamayuvchi" },
    34: { vaqt: "20 daq", tag: "Hodisalar" },
    35: { vaqt: "25 daq", tag: "Klassik ehtimollik" },
    36: { vaqt: "25 daq", tag: "Nisbiy chastota" },
    37: { vaqt: "25 daq", tag: "Tasodifiy miqdor" },
    38: { vaqt: "30 daq", tag: "Statistika" }
  };

  function pill(lessonId) {
    if (isLessonDone(lessonId)) {
      return '<span class="pill pill-done" style="display:inline-flex; align-items:center; gap:4px;"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>O‘zlashtirildi</span>';
    }
    var meta = LESSON_META[lessonId] || { vaqt: "25 daq", tag: "Mavzu" };
    return '<span class="lesson-meta-tag"><span class="lesson-meta-time">' + escapeHtml(meta.vaqt) + '</span><span class="lesson-meta-sep">·</span><span class="lesson-meta-topic">' + escapeHtml(meta.tag) + '</span></span>';
  }

  // TOC
  var toc = '<a href="#bob-poydevor" style="background:rgba(194,75,42,0.1); border-color:var(--accent); color:var(--accent); font-weight:700;"><svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style="margin-right:4px;vertical-align:-1px;"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>0-bob · Poydevor (Litseyga tayyorgarlik)</a>' +
    KA_BOBLAR.map(function (b) {
      return '<a href="#bob-' + b.id + '">' + escapeHtml(b.roman) + " bob</a>";
    }).join("");

  // Darslar ro'yxati
  var chapters = KA_BOBLAR.map(function (bob) {
    var lessons = KA_DARSLAR.filter(function (d) {
      return d.bob === bob.id;
    });

    var rows = lessons.map(function (d) {
      return (
        '<a class="lesson" href="' + LESSONS_BASE + d.id + '/">' +
          '<div class="lesson-left">' +
            '<span class="lesson-num">' + escapeHtml(d.paragraf) + '</span>' +
          '</div>' +
          '<div class="lesson-body">' +
            '<div class="lesson-title-row">' +
              '<h3 class="lesson-title">' + escapeHtml(d.nom) + '</h3>' +
              pill(d.id) +
            '</div>' +
            '<p class="lesson-desc">' + escapeHtml(d.qisqa) + '</p>' +
          '</div>' +
        '</a>'
      );
    }).join("");

    return (
      '<section class="chapter" id="bob-' + bob.id + '">' +
        '<div class="chapter-head">' +
          '<div class="roman">' + escapeHtml(bob.roman) + "</div>" +
          "<div>" +
            "<h2>" + escapeHtml(bob.nom) + "</h2>" +
            "<p>" + escapeHtml(bob.izoh) + " · " + lessons.length + " dars</p>" +
          "</div>" +
          '<div class="chapter-actions">' +
            '<button type="button" class="btn btn-chapter-exam" data-bob="' + bob.id + '" title="' + escapeHtml(bob.roman) + ' bob yakuniy nazorat testi">' +
              '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="margin-right:6px; vertical-align:-2px;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>' +
              'Nazorat Testi (15 daq)' +
            '</button>' +
          '</div>' +
        "</div>" +
        '<div class="lessons">' + rows + "</div>" +
      "</section>"
    );
  }).join("");

  // 0. Poydevor (Pre-Algebra) Boshlang'ich Modullari
  var POYDEVOR_MODULES = [
    {
      id: "pre-1",
      icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="4 7 4 4 20 4 20 7"></polyline><line x1="9" y1="20" x2="15" y2="20"></line><line x1="12" y1="4" x2="12" y2="20"></line></svg>',
      number: "0.1-Modul",
      title: "X o'zi nima? Harfli ifodalar alifbosi",
      shortDesc: "Nega sonlar o'rniga harflar ishlatiladi? O'xshash hadlarni ixchamlash va qavslarni ochish sirlari.",
      analogy: "Daftar va qalam misoli: Tasavvur qiling, sizda 3 ta daftar (3d) va 2 ta qalam (2q) bor. Do'stingiz yana 2 ta daftar berdi: endi sizda 3d + 2d = 5 ta daftar bo'ladi. Lekin daftarga qalam qo'shib '7 ta daftor-qalam' deb bo'lmaydi! Mana shuning uchun 3x + 5 ifodani 8x deb yozish qo'pol xato hisoblanadi: faqat bir xil harfli (o'xshash) hadlar qo'shiladi yoki ayriladi.",
      rules: [
        "Bir xil narsalarni qo'shish: a + a + a = 3a (ko'paytirish — bir xil sonlarni takroriy qo'shishdir).",
        "Bir xil narsalarni ko'paytirish: a · a · a = a³ (daraja — bir xil ko'paytuvchilar sonidir).",
        "Qavs oldida minus: -(a - b) = -a + b (Minus butun qavs ichidagi har bir ishorani teskarisiga aylantiradi)."
      ],
      traps: "Ko'pchilik o'quvchilar x · x ni 2x deb adashadi. Esda tuting: x + x = 2x, lekin x · x = x²!",
      quiz: {
        question: "Qavslarni oching va soddalashtiring: 5x - (2x - 4)",
        options: [
          "3x + 4",
          "3x - 4",
          "7x - 4",
          "7x + 4"
        ],
        correct: 0,
        explanation: "1-qadam: Qavs oldida minus turgani uchun: -(2x - 4) = -2x + 4 bo'ladi. 2-qadam: 5x - 2x + 4 = 3x + 4."
      }
    },
    {
      id: "pre-2",
      icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="8" y1="12" x2="16" y2="12"></line></svg>',
      number: "0.2-Modul",
      title: "Manfiy sonlar siri: Minus-minus nega plyus?",
      shortDesc: "Qarzlar falsafasi, sonlar o'qida harakat va −3² bilan (−3)² o'rtasidagi ulkan farq.",
      analogy: "Qarzdan qutulish: Sizning do'stingizdan 50 000 so'm qarzingiz bor (-50). Agar kimdir kelib sizning shu qarzingizni bekor qilsa (ya'ni qarzni ayirib tashlasa: -(-50)), siz amalda 50 000 so'm boyiysiz (+50)! Shuning uchun minus minus har doim plyus beradi.",
      rules: [
        "Ko'paytirish qoidasi: (+) · (+) = (+), (+) · (-) = (-), (-) · (-) = (+).",
        "Qo'shish: Agar ikkala son manfiy bo'lsa, ularning modullari qo'shilib oldiga minus qo'yiladi: (-5) + (-7) = -12.",
        "Ayrish: Ayirish bu qarama-qarshi sonni qo'shish demakdir: 8 - (-3) = 8 + 3 = 11."
      ],
      traps: "ENG KATTA TUZOQ: -3² = -9 bo'ladi (chunki kvadrat faqat 3 ga tegishli: -(3·3) = -9). Lekin (-3)² = +9 bo'ladi (chunki kvadrat qavs ichidagi manfiy songa tegishli: (-3)·(-3) = 9)!",
      quiz: {
        question: "Hisoblang: -4² + (-2)³",
        options: [
          "-24",
          "-8",
          "+8",
          "+24"
        ],
        correct: 0,
        explanation: "1-qadam: -4² = -16 (kvadrat faqat 4 ga tegishli). 2-qadam: (-2)³ = (-2)·(-2)·(-2) = -8. 3-qadam: -16 + (-8) = -24."
      }
    },
    {
      id: "pre-3",
      icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>',
      number: "0.3-Modul",
      title: "Qisqa ko'paytirish: Litsey imtihonlarining yuragi",
      shortDesc: "(a ± b)², a² − b² formulalarining geometrik isboti va sonlarni og'zaki kvadratga ko'tarish usuli.",
      analogy: "Geometrik kvadrat yuzi: Tomoni (a + b) bo'lgan katta kvadratni tasavvur qiling. Uni bo'laklarga ajratsak: bitta a² yuzali kvadrat, bitta b² yuzali kvadrat va ikkita a·b yuzali to'g'ri to'rtburchak chiqadi. Jami: a² + 2ab + b²! Shuning uchun (a+b)² hech qachon a² + b² ga teng emas!",
      rules: [
        "Yig'indi kvadrati: (a + b)² = a² + 2ab + b².",
        "Ayirma kvadrati: (a - b)² = a² - 2ab + b².",
        "Kvadratlar ayirmasi: a² - b² = (a - b)(a + b) (Bu formula kasrlarni qisqartirishda eng ko'p ishlatiladi)."
      ],
      traps: "Og'zaki hisoblash super-usuli: 99² = (100 - 1)² = 10000 - 200 + 1 = 9801. Yoki 102² = (100 + 2)² = 10000 + 400 + 4 = 10404!",
      quiz: {
        question: "Hisoblang: 52² - 48²",
        options: [
          "400",
          "200",
          "800",
          "100"
        ],
        correct: 0,
        explanation: "Kvadratlar ayirmasi formulasi a² - b² = (a - b)(a + b) bo'yicha: (52 - 48)(52 + 48) = 4 · 100 = 400. Kvadratlarni alohida hisoblash shart emas!"
      }
    },
    {
      id: "pre-4",
      icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>',
      number: "0.4-Modul",
      title: "Chiziqli tenglamalar: Matematik tarozi qoidasi",
      shortDesc: "Tenglamani tarozi kabi muvozanatda saqlab, x ni yolg'iz qoldirish va proporsiya sirlari.",
      analogy: "Palla tarozi: Tenglama — bu har ikki tomoni muvozanatda turgan palla tarozi. Chap pallaga nima qilsangiz (qo'shish, ayirish, ko'paytirish, bo'lish), muvozanat buzilmasligi uchun o'ng tomonga ham xuddi shuni qilishingiz shart. Bir son chapdan o'ngga o'tganda ishorasi o'zgarishi — bu ikkala tomondan o'sha sonni ayirib tashlash natijasidir.",
      rules: [
        "Asosiy maqsad: x ni bir tomonda, sonlarni ikkinchi tomonda yolg'iz qoldirish.",
        "ax + b = c → ax = c - b → x = (c - b) / a (a ≠ 0).",
        "Proporsiya (Xoch usuli): a/b = c/d bo'lsa, a·d = b·c bo'ladi."
      ],
      traps: "Qavs oldidagi ko'paytuvchini ichkaridagi har bir hadga ko'paytirishni unutmang: 3(x - 4) = 3x - 12 (ko'pchilik 3x - 4 deb xato qiladi).",
      quiz: {
        question: "Tenglamani yeching: 4(x - 2) + 3 = 19",
        options: [
          "6",
          "5",
          "7",
          "4"
        ],
        correct: 0,
        explanation: "1-qadam: Qavsni ochamiz: 4x - 8 + 3 = 19 → 4x - 5 = 19. 2-qadam: -5 ni o'ngga o'tkazamiz: 4x = 24. 3-qadam: x = 24 / 4 = 6."
      }
    },
    {
      id: "pre-5",
      icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>',
      number: "0.5-Modul",
      title: "Kvadrat tenglamalar, Diskriminant va Viyet mo'jizasi",
      shortDesc: "ax² + bx + c = 0 tenglamani 5 soniyada og'zaki yechish va ildizlar tabiatini aniqlash.",
      analogy: "Ildiz izlash siri: Agar x² - 7x + 12 = 0 tenglama berilgan bo'lsa, uni uzoq diskriminant bilan yechish shart emas! O'zingizga savol bering: 'Qaysi 2 ta sonning ko'paytmasi 12, yig'indisi esa +7 bo'ladi?' Albatta, 3 va 4! Mana shu Viyet teoremasining kuchi.",
      rules: [
        "Umumiy formula: ax² + bx + c = 0. Diskriminant: D = b² - 4ac.",
        "D > 0 bo'lsa: 2 ta turli ildiz x₁,₂ = (-b ± √D) / (2a).",
        "D = 0 bo'lsa: 1 ta ildiz x = -b / (2a).",
        "D < 0 bo'lsa: Haqiqiy ildizlar yo'q.",
        "Viyet teoremasi: x₁ + x₂ = -b/a, x₁ · x₂ = c/a."
      ],
      traps: "Viyet formulasida ildizlar yig'indisi har doim -b/a (qarama-qarshi ishora bilan!) olinadi. x² - 5x + 6 = 0 bo'lsa, yig'indi -5 emas, +5 bo'ladi!",
      quiz: {
        question: "x² - 8x + 15 = 0 tenglamaning ildizlarini Viyet orqali toping:",
        options: [
          "x₁ = 3, x₂ = 5",
          "x₁ = -3, x₂ = -5",
          "x₁ = 1, x₂ = 15",
          "x₁ = 2, x₂ = 6"
        ],
        correct: 0,
        explanation: "Viyet teoremasiga ko'ra: x₁ + x₂ = 8 va x₁ · x₂ = 15. Ko'paytmasi 15 va yig'indisi 8 bo'lgan sonlar 3 va 5 dir."
      }
    },
    {
      id: "pre-6",
      icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line><polyline points="2 7 8 1 14 7"></polyline></svg>',
      number: "0.6-Modul",
      title: "Koordinatalar tekisligi va Funksiya g'oyasi: y = kx + b",
      shortDesc: "Funksiya mashinasi, chiziqning qiyaligi (k) va 9-sinf parabolalariga to'g'ridan-to'g'ri ko'prik.",
      analogy: "Funksiya bu konveyer mashinasi: Siz unga x (xom-ashyo) berasiz, uning ichida qoida bor (masalan, 2 ga ko'paytirib 1 ni qo'shish: 2x+1), va natijada y (tayyor mahsulot) chiqadi. Masalan x=3 bersangiz, mashina y=7 chiqaradi. Buni tekislikda (3; 7) nuqta sifatida belgilaymiz.",
      rules: [
        "Dekart tekisligi: Gorizontal o'q — abssissa (x), vertikal o'q — ordinata (y).",
        "Chiziqli funksiya y = kx + b: Grafigi to'g'ri chiziq.",
        "k — burchak koeffitsiyenti (chiziq qiyaligi). Agar k > 0 bo'lsa, chiziq o'ngga ko'tariladi; k < 0 bo'lsa, pastga tushadi.",
        "b — erkin had: to'g'ri chiziq y o'qini (0; b) nuqtada kesib o'tadi."
      ],
      traps: "Bu poydevorsiz 9-sinfdagi parabola (y = ax² + bx + c) va uning grafigini tushunib bo'lmaydi. Parabola — to'g'ri chiziqning egri singlisidir!",
      quiz: {
        question: "y = -3x + 6 to'g'ri chiziq ordinata (y) o'qini qaysi nuqtada kesib o'tadi?",
        options: [
          "(0; 6)",
          "(6; 0)",
          "(0; -3)",
          "(2; 0)"
        ],
        correct: 0,
        explanation: "To'g'ri chiziq y o'qini kesib o'tganda x = 0 bo'ladi. x = 0 qo'ysak: y = -3(0) + 6 = 6. Demak, nuqta (0; 6)."
      }
    }
  ];

  function renderPreAlgebraSectionHTML() {
    var cards = POYDEVOR_MODULES.map(function(m) {
      return (
        '<div class="poydevor-card" data-pid="' + m.id + '">' +
          '<div>' +
            '<div class="poydevor-card-icon">' + m.icon + '</div>' +
            '<div class="poydevor-card-num">' + escapeHtml(m.number) + '</div>' +
            '<h3 class="poydevor-card-h">' + escapeHtml(m.title) + '</h3>' +
            '<p class="poydevor-card-p">' + escapeHtml(m.shortDesc) + '</p>' +
          '</div>' +
          '<div class="poydevor-card-btn">' +
            '<span>O\'rganish va Mashq</span>' +
            '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>' +
          '</div>' +
        '</div>'
      );
    }).join("");

    return (
      '<section class="poydevor-section" id="bob-poydevor">' +
        '<div class="poydevor-header">' +
          '<div>' +
            '<div class="poydevor-badge">' +
              '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>' +
              '0-Bosqich · Litseyga Poydevor (Pre-Algebra)' +
            '</div>' +
            '<h2 class="poydevor-title">Algebrani Noldan Boshlayotganlar Uchun Mahorat Darslari</h2>' +
            '<p class="poydevor-desc">9-sinf darslariga o\'tishdan oldin bilish SHART bo\'lgan 6 ta asosiy tushuncha. Agar siz formulalarni yodlay olmayotgan bo\'lsangiz yoki X dan qo\'rqsangiz — avval ushbu 6 ta modulni o\'rganing!</p>' +
          '</div>' +
        '</div>' +
        '<div class="poydevor-grid">' + cards + '</div>' +
      '</section>'
    );
  }

  // 1. Gamifikatsiya vitrinasi HTML
  function renderAchievementsHTML() {
    var xp = window.JA_GAMIFICATION ? window.JA_GAMIFICATION.getXp() : 0;
    var lvl = window.JA_GAMIFICATION ? window.JA_GAMIFICATION.getLevel(xp) : { lvl: 1, nom: "Boshlang'ich", next: 100, min: 0 };
    var lvlProgress = Math.min(100, Math.round(((xp - lvl.min) / (lvl.next - lvl.min)) * 100));
    var badges = window.JA_GAMIFICATION ? window.JA_GAMIFICATION.BADGES : {};

    var badgesHtml = Object.keys(badges).map(function (bId) {
      var b = badges[bId];
      var isUnlocked = window.JA_GAMIFICATION ? window.JA_GAMIFICATION.hasBadge(bId) : false;
      return (
        '<div class="badge-card ' + (isUnlocked ? "is-unlocked" : "is-locked") + '" title="' + escapeHtml(b.desc) + '">' +
          '<div class="badge-card-icon">' + b.icon + '</div>' +
          '<div class="badge-card-title">' + escapeHtml(b.title) + '</div>' +
          '<div class="badge-card-status">' + (isUnlocked ? "Zabt etildi" : "Qulflangan") + '</div>' +
        '</div>'
      );
    }).join("");

    return (
      '<section class="dashboard-achievements">' +
        '<div class="achievements-head">' +
          '<div>' +
            '<h2>Mening Yutuqlarim va Reytingim</h2>' +
            '<p style="margin:4px 0 0; color:var(--ink-soft); font-size:0.9rem;">To\'plangan tajriba: <strong>' + xp + ' XP</strong> · Daraja: <strong>' + lvl.lvl + '-daraja (' + lvl.nom + ')</strong></p>' +
          '</div>' +
          '<div style="width:200px;">' +
            '<div style="display:flex; justify-content:space-between; font-size:0.75rem; color:var(--ink-soft); margin-bottom:4px;">' +
              '<span>' + xp + ' XP</span><span>Keyingi: ' + lvl.next + ' XP</span>' +
            '</div>' +
            '<div class="bar"><span style="width:' + lvlProgress + '%;"></span></div>' +
          '</div>' +
        '</div>' +
        '<div class="badges-grid">' + badgesHtml + '</div>' +
      '</section>'
    );
  }

  // 2. Litsey Mock Banner HTML
  function renderMockBannerHTML() {
    return (
      '<section class="dashboard-mock-banner">' +
        '<div>' +
          '<div style="display:inline-flex; align-items:center; gap:6px; background:rgba(194,75,42,0.12); color:var(--accent); padding:4px 12px; border-radius:20px; font-weight:700; font-size:0.8rem; margin-bottom:10px;">' +
            '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.45 1-1 1H7"></path><path d="M14 14.66V17c0 .55.45 1 1 1h2"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path></svg>' +
            'Litsey Kirish Simulyatori' +
          '</div>' +
          '<h2 class="mock-banner-title">Westminster (ALWIUT), PM va Aniq Fanlar Litseylari Mock Testi</h2>' +
          '<p class="mock-banner-desc">60 daqiqalik to\'liq kirish imtihoni simulyatori: 25 ta test va 5 ta yozma masala. Darslarning barcha murakkab mavzularini qamrab oladi.</p>' +
        '</div>' +
        '<div>' +
          '<button type="button" class="btn" id="btnStartMockSimulator" style="background:var(--accent); color:#fff; font-weight:700; padding:14px 28px; border-radius:12px; font-size:1rem; cursor:pointer; box-shadow:0 6px 18px rgba(194,75,42,0.25); white-space:nowrap;">' +
            'Simulyatsiyani boshlash' +
          '</button>' +
        '</div>' +
      '</section>'
    );
  }

  // 3. Jonli Formulalar Qomusi HTML
  function renderFormulasHTML() {
    return (
      '<section class="dashboard-formulas" id="sectionFormulas">' +
        '<div class="formulas-header">' +
          '<div>' +
            '<h2 style="margin:0 0 4px; font-family:var(--font-serif); font-size:1.4rem;">Jonli Formulalar Qomusi</h2>' +
            '<p style="margin:0; color:var(--ink-soft); font-size:0.9rem;">9-sinf algebrasi bo\'yicha barcha fundamental formulalar, vizual isbotlar va tegishli darsga havolalar.</p>' +
          '</div>' +
          '<div class="formulas-search-box">' +
            '<svg class="formulas-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>' +
            '<input type="text" class="formulas-search-input" id="formulaSearchInput" placeholder="Formulani qidiring (masalan: Viyet, Koshi)...">' +
          '</div>' +
        '</div>' +
        '<div class="formulas-filter-tabs" id="formulaFilterTabs">' +
          '<button type="button" class="filter-tab-btn is-active" data-bob="all">Barchasi (66 ta)</button>' +
          '<button type="button" class="filter-tab-btn" data-bob="0">0-bob · Poydevor (12)</button>' +
          '<button type="button" class="filter-tab-btn" data-bob="1">I bob · Kvadrat funksiya</button>' +
          '<button type="button" class="filter-tab-btn" data-bob="2">II bob · Sistemalar</button>' +
          '<button type="button" class="filter-tab-btn" data-bob="3">III bob · Trigonometriya</button>' +
          '<button type="button" class="filter-tab-btn" data-bob="4">IV bob · Progressiyalar</button>' +
          '<button type="button" class="filter-tab-btn" data-bob="5">V bob · Ehtimollik</button>' +
        '</div>' +
        '<div class="formulas-grid" id="formulasGrid"></div>' +
      '</section>'
    );
  }

  root.innerHTML =
    '<section class="hero">' +
      "<div>" +
        "<h1>9-sinf Algebra<br>Interaktiv Majmuasi</h1>" +
        "<p>O'zbekiston Respublikasi umumiy o'rta ta'lim davlat standarti va Sh.A. Alimov darsligi (2019) asosida yaratilgan interaktiv elektron kurs. Barcha 38 ta mavzu to'liq interaktiv grafik sahnalar, qat'iy matematik ta'riflar va darslik skanerlari bilan ta'minlangan.</p>" +
      "</div>" +
      '<aside class="stats">' +
        '<div class="stats-label">O\'quv dasturi holati</div>' +
        '<div class="stats-num">' + counts.ready + " / " + counts.total + "</div>" +
        '<div class="bar" role="progressbar" aria-valuenow="' + percent + '" aria-valuemin="0" aria-valuemax="100">' +
          '<span style="width:' + percent + '%"></span>' +
        "</div>" +
      "</aside>" +
    "</section>" +
    renderPreAlgebraSectionHTML() +
    renderAchievementsHTML() +
    renderMockBannerHTML() +
    renderFormulasHTML() +
    '<nav class="toc" aria-label="Boblar">' + toc + "</nav>" +
    chapters +
    '<p class="note">9-sinf algebra kursi barcha 38 ta paragrafni to\'liq qamrab olgan (1-§ dan 38-§ gacha). Har bir mavzu avtonom ishlaydi va internet talab qilmaydi.</p>' +
    '<div id="modalOverlay" style="display:none;"></div>';

  // Formulalar gridini render qilish va qidiruv/filtr bilan bog'lash
  function initFormulasModule() {
    var grid = document.getElementById("formulasGrid");
    var searchInput = document.getElementById("formulaSearchInput");
    var filterTabs = document.querySelectorAll(".filter-tab-btn");
    var formulas = window.JA_FORMULALAR || [];
    if (!grid) return;

    var activeBob = "all";
    var searchQuery = "";

    function renderCards() {
      var filtered = formulas.filter(function (f) {
        var matchesBob = activeBob === "all" || String(f.bob) === String(activeBob);
        var q = searchQuery.toLowerCase().trim();
        var matchesSearch = !q || (f.title.toLowerCase().indexOf(q) !== -1 || f.formula.toLowerCase().indexOf(q) !== -1 || f.desc.toLowerCase().indexOf(q) !== -1);
        return matchesBob && matchesSearch;
      });

      if (filtered.length === 0) {
        grid.innerHTML = '<p style="grid-column:1/-1; text-align:center; color:var(--ink-soft); padding:32px 0;">Qidiruv bo\'yicha formula topilmadi.</p>';
        return;
      }

      grid.innerHTML = filtered.map(function (f) {
        return (
          '<div class="formula-card" data-fid="' + f.id + '">' +
            '<div>' +
              '<div class="formula-card-sub">' + escapeHtml(f.bobNom) + '</div>' +
              '<div class="formula-card-title">' + escapeHtml(f.title) + '</div>' +
            '</div>' +
            '<div class="formula-card-math">' + f.formula + '</div>' +
          '</div>'
        );
      }).join("");

      grid.querySelectorAll(".formula-card").forEach(function (card) {
        card.addEventListener("click", function () {
          var fId = card.getAttribute("data-fid");
          var item = formulas.find(function (x) { return x.id === fId; });
          if (item) openFormulaModal(item);
        });
      });
    }

    renderCards();

    if (searchInput) {
      searchInput.addEventListener("input", function () {
        searchQuery = searchInput.value;
        renderCards();
      });
    }

    filterTabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        filterTabs.forEach(function (t) { t.classList.remove("is-active"); });
        tab.classList.add("is-active");
        activeBob = tab.getAttribute("data-bob");
        renderCards();
      });
    });
  }

  function openFormulaModal(f) {
    var overlay = document.getElementById("modalOverlay");
    if (!overlay) return;

    overlay.className = "formula-modal-backdrop";
    overlay.style.display = "flex";

    var targetUrl = window.JA_FORMULA_DIRECTORY ? window.JA_FORMULA_DIRECTORY.getDeepLinkUrl(f) : f.lessonLink;
    if (f.bob === 0 || f.lessonLink === "#poydevor" || f.lessonLink === "#bob-poydevor") {
      targetUrl = "#bob-poydevor";
    }

    overlay.innerHTML =
      '<div class="formula-modal">' +
        '<div style="display:flex; justify-content:space-between; align-items:start; gap:16px; margin-bottom:14px;">' +
          '<div>' +
            '<div style="font-size:0.75rem; text-transform:uppercase; color:var(--accent-2); font-weight:700;">' + escapeHtml(f.bobNom) + ' · ' + f.lessonId + '-dars</div>' +
            '<h3 style="margin:4px 0 0; font-size:1.3rem; color:var(--ink); font-family:var(--font-serif);">' + escapeHtml(f.title) + '</h3>' +
          '</div>' +
          '<button type="button" id="closeFormulaModal" style="background:transparent; border:none; cursor:pointer; color:var(--ink-soft); padding:4px;">' +
            '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>' +
          '</button>' +
        '</div>' +
        '<div style="background:var(--paper); border:1px solid var(--line); border-radius:12px; padding:16px; margin-bottom:16px; text-align:center;">' +
          '<div style="font-family:var(--font-serif); font-size:1.4rem; font-weight:700; color:var(--accent);">' + f.formula + '</div>' +
        '</div>' +
        '<div style="margin-bottom:14px; line-height:1.6; color:var(--ink);">' +
          '<strong>Ta\'rifi va ma\'nosi:</strong> ' + escapeHtml(f.desc) +
        '</div>' +
        '<div style="margin-bottom:20px; line-height:1.6; color:var(--ink-soft); background:rgba(0,0,0,0.02); border-left:3px solid var(--accent-2); padding:10px 14px; border-radius:0 8px 8px 0;">' +
          '<strong>Mantiqiy isboti:</strong> ' + f.isbot +
        '</div>' +
        '<div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">' +
          '<a class="btn btn-jonli-korish" id="btnJonliKorish" href="' + escapeHtml(targetUrl) + '" style="background:var(--accent); color:#fff; font-weight:600; text-decoration:none; padding:10px 20px; border-radius:8px; display:inline-flex; align-items:center; gap:8px;">' +
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 18h8"></path><path d="M3 22h18"></path><path d="M14 22a7 7 0 1 0-14 0"></path><path d="M9 14h2"></path><path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z"></path><path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3"></path></svg>' +
            'Jonli ko\'rish &rarr;' +
          '</a>' +
          '<button type="button" class="btn" id="btnModalCloseSecondary" style="padding:10px 18px; border-radius:8px;">Yopish</button>' +
        '</div>' +
      '</div>';

    function closeModal() {
      overlay.style.display = "none";
      overlay.innerHTML = "";
    }

    var btnClose1 = document.getElementById("closeFormulaModal");
    var btnClose2 = document.getElementById("btnModalCloseSecondary");
    var btnJonli = document.getElementById("btnJonliKorish");

    if (btnClose1) btnClose1.addEventListener("click", closeModal);
    if (btnClose2) btnClose2.addEventListener("click", closeModal);
    if (btnJonli) {
      btnJonli.addEventListener("click", function (e) {
        closeModal();
        if (targetUrl.startsWith("#")) {
          e.preventDefault();
          var targetEl = document.querySelector(targetUrl);
          if (targetEl) {
            targetEl.scrollIntoView({ behavior: "smooth" });
          }
        }
      });
    }
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) closeModal();
    });
  }

  // Litsey Mock Testini boshlash
  function initMockLauncher() {
    var btn = document.getElementById("btnStartMockSimulator");
    var overlay = document.getElementById("modalOverlay");
    if (!btn || !overlay) return;

    btn.addEventListener("click", function () {
      overlay.className = "formula-modal-backdrop";
      overlay.style.display = "flex";
      overlay.innerHTML =
        '<div class="formula-modal" style="max-width:880px; max-height:92vh;">' +
          '<div style="text-align:right; margin-bottom:8px;">' +
            '<button type="button" id="closeMockModal" style="background:transparent; border:none; cursor:pointer; color:var(--ink-soft); padding:4px;">' +
              '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>' +
            '</button>' +
          '</div>' +
          '<div id="mockExamActiveRoot"></div>' +
        '</div>';

      var closeBtn = document.getElementById("closeMockModal");
      if (closeBtn) {
        closeBtn.addEventListener("click", function () {
          overlay.style.display = "none";
          overlay.innerHTML = "";
        });
      }

      var rootEl = document.getElementById("mockExamActiveRoot");
      if (window.JA_EXAM && window.JA_EXAM.startLyceumMock) {
        window.JA_EXAM.startLyceumMock(rootEl);
      }
    });
  }

  // Bob Nazorat Testlarini boshlash (Chapter Mastery Exams)
  function initChapterExamLaunchers() {
    var overlay = document.getElementById("modalOverlay");
    if (!overlay) return;

    document.querySelectorAll(".btn-chapter-exam").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var bobId = parseInt(btn.getAttribute("data-bob"), 10);
        if (!bobId) return;

        overlay.className = "formula-modal-backdrop";
        overlay.style.display = "flex";
        overlay.innerHTML =
          '<div class="formula-modal" style="max-width:880px; max-height:92vh;">' +
            '<div style="text-align:right; margin-bottom:8px;">' +
              '<button type="button" id="closeChapterExamModal" style="background:transparent; border:none; cursor:pointer; color:var(--ink-soft); padding:4px;">' +
                '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>' +
              '</button>' +
            '</div>' +
            '<div id="chapterExamActiveRoot"></div>' +
          '</div>';

        var closeBtn = document.getElementById("closeChapterExamModal");
        if (closeBtn) {
          closeBtn.addEventListener("click", function () {
            overlay.style.display = "none";
            overlay.innerHTML = "";
          });
        }

        var rootEl = document.getElementById("chapterExamActiveRoot");
        if (window.JA_EXAM && window.JA_EXAM.startChapterExam) {
          window.JA_EXAM.startChapterExam(bobId, rootEl);
        }
      });
    });
  }

  // Tezkor klaviatura qidiruvi: "/" tugmasi formulalar qidiruviga o'tkazadi
  document.addEventListener("keydown", function (e) {
    if (e.key === "/" && document.activeElement && document.activeElement.tagName !== "INPUT" && document.activeElement.tagName !== "TEXTAREA") {
      var sInp = document.getElementById("formulaSearchInput");
      if (sInp) {
        e.preventDefault();
        sInp.focus();
        sInp.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  });

  function openPreAlgebraModal(m) {
    var overlay = document.getElementById("modalOverlay");
    if (!overlay) return;

    overlay.className = "formula-modal-backdrop";
    overlay.style.display = "flex";

    var rulesHtml = m.rules.map(function (r) {
      return '<li style="margin-bottom:8px; line-height:1.5;">' + r + '</li>';
    }).join("");

    var quizOptionsHtml = m.quiz.options.map(function (opt, idx) {
      return (
        '<label style="display:flex; align-items:center; gap:10px; padding:10px 14px; border:1px solid var(--line); border-radius:10px; margin-bottom:8px; cursor:pointer; background:var(--paper); transition:background 0.15s ease;">' +
          '<input type="radio" name="poydevorQuizOpt" value="' + idx + '" style="cursor:pointer;">' +
          '<span style="font-size:0.95rem; font-weight:600;">' + escapeHtml(opt) + '</span>' +
        '</label>'
      );
    }).join("");

    overlay.innerHTML =
      '<div class="formula-modal" style="max-width:760px; max-height:92vh; overflow-y:auto;">' +
        '<div style="display:flex; justify-content:space-between; align-items:start; gap:16px; margin-bottom:16px;">' +
          '<div>' +
            '<div style="font-size:0.75rem; text-transform:uppercase; color:var(--accent); font-weight:800; letter-spacing:0.05em;">' + escapeHtml(m.number) + ' · Litsey Poydevori</div>' +
            '<h3 style="margin:4px 0 0; font-size:1.35rem; color:var(--ink); font-family:var(--font-serif); display:flex; align-items:center; gap:8px;">' +
              '<span>' + m.icon + '</span> ' + escapeHtml(m.title) +
            '</h3>' +
          '</div>' +
          '<button type="button" id="closePoydevorModal" style="background:transparent; border:none; cursor:pointer; color:var(--ink-soft); padding:4px;">' +
            '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>' +
          '</button>' +
        '</div>' +
        '<div style="background:rgba(194,75,42,0.06); border-left:4px solid var(--accent); border-radius:0 12px 12px 0; padding:14px 18px; margin-bottom:18px;">' +
          '<div style="font-weight:700; color:var(--accent); font-size:0.85rem; text-transform:uppercase; margin-bottom:6px; display:flex; align-items:center; gap:6px;"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18h6"></path><path d="M10 22h4"></path><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"></path></svg>Hayotiy misol va Mantiqiy tushuntirish</div>' +
          '<p style="margin:0; font-size:0.95rem; line-height:1.6; color:var(--ink);">' + escapeHtml(m.analogy) + '</p>' +
        '</div>' +
        '<div style="margin-bottom:18px;">' +
          '<h4 style="margin:0 0 10px; font-size:1rem; color:var(--ink); display:flex; align-items:center; gap:6px;"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 22h20"></path><path d="M4 18h16"></path><path d="M6 14h12"></path></svg>Asosiy Qoidalar va Formulalar:</h4>' +
          '<ul style="margin:0; padding-left:20px; color:var(--ink);">' + rulesHtml + '</ul>' +
        '</div>' +
        '<div style="background:rgba(217,119,6,0.08); border-radius:12px; padding:14px 16px; margin-bottom:20px; border:1px solid rgba(217,119,6,0.2);">' +
          '<strong style="color:#b45309; font-size:0.85rem; text-transform:uppercase; display:flex; align-items:center; gap:6px; margin-bottom:4px;"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>Imtihonda eng ko\'p uchraydigan tuzoq:</strong>' +
          '<span style="font-size:0.92rem; color:var(--ink); line-height:1.5;">' + escapeHtml(m.traps) + '</span>' +
        '</div>' +
        '<div style="border-top:1px solid var(--line); padding-top:18px; margin-bottom:18px;">' +
          '<h4 style="margin:0 0 6px; font-size:1rem; color:var(--ink); display:flex; align-items:center; gap:6px;"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>O\'zingni sinab ko\'r:</h4>' +
          '<p style="margin:0 0 12px; font-weight:600; color:var(--ink);">' + escapeHtml(m.quiz.question) + '</p>' +
          '<div id="poydevorQuizContainer">' + quizOptionsHtml + '</div>' +
          '<div id="poydevorFeedback" style="display:none; margin:12px 0; padding:12px 14px; border-radius:10px; font-size:0.9rem; line-height:1.5;"></div>' +
          '<div style="display:flex; justify-content:space-between; align-items:center; margin-top:14px; flex-wrap:wrap; gap:10px;">' +
            '<button type="button" class="btn" id="btnCheckPoydevorQuiz" style="background:var(--accent); color:#fff; font-weight:700; padding:9px 20px; border-radius:8px;">Tekshirish</button>' +
            '<button type="button" class="btn" id="btnClosePoydevorSecondary" style="padding:9px 18px; border-radius:8px;">Tushundim, yopish</button>' +
          '</div>' +
        '</div>' +
      '</div>';

    function closeModal() {
      overlay.style.display = "none";
      overlay.innerHTML = "";
    }

    var closeBtn = document.getElementById("closePoydevorModal");
    var closeBtnSec = document.getElementById("btnClosePoydevorSecondary");
    if (closeBtn) closeBtn.addEventListener("click", closeModal);
    if (closeBtnSec) closeBtnSec.addEventListener("click", closeModal);
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) closeModal();
    });

    var checkBtn = document.getElementById("btnCheckPoydevorQuiz");
    var feedbackEl = document.getElementById("poydevorFeedback");
    if (checkBtn && feedbackEl) {
      checkBtn.addEventListener("click", function () {
        var selected = document.querySelector('input[name="poydevorQuizOpt"]:checked');
        if (!selected) {
          alert("Iltimos, avval variantlardan birini tanlang!");
          return;
        }
        var val = parseInt(selected.value, 10);
        feedbackEl.style.display = "block";
        if (val === m.quiz.correct) {
          feedbackEl.style.background = "rgba(43, 107, 79, 0.12)";
          feedbackEl.style.border = "1px solid rgba(43, 107, 79, 0.3)";
          feedbackEl.style.color = "var(--ink)";
          feedbackEl.innerHTML = '<strong style="color:var(--accent-2); display:flex; align-items:center; gap:6px; margin-bottom:4px;"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>Barakalla, to\'g\'ri javob! +15 XP</strong>' + escapeHtml(m.quiz.explanation);
          if (window.JA_GAMIFICATION && window.JA_GAMIFICATION.addXp) {
            window.JA_GAMIFICATION.addXp(15, m.id + "_quiz");
          }
          checkBtn.style.display = "none";
        } else {
          feedbackEl.style.background = "rgba(194, 75, 42, 0.1)";
          feedbackEl.style.border = "1px solid rgba(194, 75, 42, 0.3)";
          feedbackEl.style.color = "var(--ink)";
          feedbackEl.innerHTML = '<strong style="color:var(--accent); display:flex; align-items:center; gap:6px; margin-bottom:4px;"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>Noto\'g\'ri, qayta urinib ko\'ring!</strong>' + escapeHtml(m.quiz.explanation);
        }
      });
    }
  }

  function initPreAlgebraModule() {
    var cards = document.querySelectorAll(".poydevor-card");
    cards.forEach(function (card) {
      card.addEventListener("click", function () {
        var pid = card.getAttribute("data-pid");
        var m = POYDEVOR_MODULES.find(function (x) { return x.id === pid; });
        if (m) openPreAlgebraModal(m);
      });
    });
  }

  initPreAlgebraModule();
  initFormulasModule();
  initMockLauncher();
  initChapterExamLaunchers();
})();
