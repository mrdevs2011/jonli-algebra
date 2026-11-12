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

  function pill(lessonId) {
    if (isLessonDone(lessonId)) {
      return '<span class="pill pill-done" style="display:inline-flex; align-items:center; gap:4px;"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>O‘zlashtirildi</span>';
    }
    return '<span class="lesson-meta-tag" style="font-size:0.75rem; color:var(--ink-soft); font-weight:600; padding:3px 8px; border-radius:12px; background:rgba(0,0,0,0.04);">35 daq</span>';
  }

  // TOC
  var toc = KA_BOBLAR.map(function (b) {
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
          '<div class="lesson-num">' + escapeHtml(d.paragraf) + "</div>" +
          "<div>" +
            "<h3>" + escapeHtml(d.nom) + "</h3>" +
            "<p>" + escapeHtml(d.qisqa) + "</p>" +
          "</div>" +
          pill(d.id) +
        "</a>"
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
          '<button type="button" class="filter-tab-btn is-active" data-bob="all">Barchasi (38+)</button>' +
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
          '<a class="btn" href="' + (window.JA_FORMULA_DIRECTORY ? window.JA_FORMULA_DIRECTORY.getDeepLinkUrl(f) : f.lessonLink) + '" style="background:var(--accent); color:#fff; font-weight:600; text-decoration:none; padding:10px 20px; border-radius:8px; display:inline-flex; align-items:center; gap:8px;">' +
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 18h8"></path><path d="M3 22h18"></path><path d="M14 22a7 7 0 1 0-14 0"></path><path d="M9 14h2"></path><path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z"></path><path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3"></path></svg>' +
            'Jonli Sahnada Sinash &rarr;' +
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
    if (btnClose1) btnClose1.addEventListener("click", closeModal);
    if (btnClose2) btnClose2.addEventListener("click", closeModal);
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

  initFormulasModule();
  initMockLauncher();
  initChapterExamLaunchers();
})();
