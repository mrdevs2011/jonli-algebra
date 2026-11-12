/**
 * Jonli Algebra — dars render
 *
 * Har bir dars papkasidagi index.html endi faqat shablon.
 * Butun mazmun shu darsning data.json faylidan keladi
 * (build vaqtida <script type="application/json" id="dars-data"> ichiga joylashtiriladi —
 * offline file:// rejimida ham ishlashi uchun, hech qanday fetch() ishlatilmaydi).
 *
 * Bu fayl 38 ta darsning barchasi uchun BITTA umumiy fayl — o'zgarmaydi.
 * Har dars faqat o'zining data.json'ini yozadi.
 */
(function () {
  "use strict";

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (ch) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch];
    });
  }

  function el(tag, attrs, html) {
    var e = document.createElement(tag);
    if (attrs) {
      for (var k in attrs) {
        if (attrs[k] === undefined || attrs[k] === null) continue;
        e.setAttribute(k, attrs[k]);
      }
    }
    if (html !== undefined) e.innerHTML = html;
    return e;
  }

  function readData() {
    var tag = document.getElementById("dars-data");
    if (!tag) throw new Error("dars-data topilmadi — index.html noto'g'ri build qilingan");
    return JSON.parse(tag.textContent);
  }

  // ---- kichik render funksiyalari, har biri bitta blok uchun ----

  function renderMeta(d) {
    var title = d.paragraf + " " + d.title + " — Jonli Algebra";
    document.title = title;
    var descTag = document.querySelector('meta[name="description"]');
    if (descTag) descTag.setAttribute("content", d.lead);

    var kicker = document.getElementById("darsKicker");
    if (kicker) kicker.textContent = d.bob.roman + " bob · " + d.paragraf + " · dars " + d.id + "/38";

    var h1 = document.getElementById("darsTitle");
    if (h1) h1.textContent = d.title;

    var lead = document.getElementById("darsLead");
    if (lead) lead.textContent = d.lead;

    var footMid = document.getElementById("footerMid");
    if (footMid) footMid.textContent = d.paragraf;

    var next = document.getElementById("footerNext");
    if (next) {
      if (d.next) { next.href = d.next.href; next.textContent = d.next.label; next.hidden = false; }
      else next.hidden = true;
    }
    var prev = document.getElementById("footerPrev");
    if (prev) {
      if (d.prev) { prev.href = d.prev.href; prev.textContent = d.prev.label; prev.hidden = false; }
      else prev.hidden = true;
    }
  }

  function renderAgenda(d) {
    var wrap = document.getElementById("agendaSteps");
    if (!wrap || !d.agenda) return;
    d.agenda.forEach(function (step) {
      var li = el("li", { "data-min": step.min });
      li.appendChild(el("span", { class: "agenda-step-time" }, step.min + " daq"));
      li.appendChild(el("span", { class: "agenda-step-name" }, escapeHtml(step.name)));
      wrap.appendChild(li);
    });
  }

  function renderKirish(d) {
    var wrap = document.getElementById("blockKirish");
    if (!wrap || !d.kirish) return;
    d.kirish.forEach(function (html) { wrap.insertAdjacentHTML("beforeend", html); });
  }

  function renderReja(d) {
    var wrap = document.getElementById("blockReja");
    if (wrap && d.reja) wrap.textContent = d.reja;
  }

  function renderQoida(d) {
    var wrap = document.getElementById("blockQoida");
    if (wrap && d.qoida) wrap.innerHTML = d.qoida;
  }

  function renderSavollar(d) {
    var wrap = document.getElementById("savollar");
    if (!wrap || !d.savollar) return;
    d.savollar.forEach(function (item, qi) {
      var box = el("div", { class: "savol" });
      box.appendChild(el("p", { class: "savol-q" }, (qi + 1) + ". " + escapeHtml(item.savol)));
      var opts = el("div", { class: "savol-opts" });
      item.variantlar.forEach(function (variant, vi) {
        var btn = el("button", { type: "button" }, escapeHtml(variant));
        btn.addEventListener("click", function () {
          if (opts.querySelector("button.togri, button.notogri")) return; // faqat bitta urinish
          opts.querySelectorAll("button").forEach(function (b, bi) {
            if (bi === item.togri) b.classList.add("togri");
            else if (bi === vi) b.classList.add("notogri");
          });
        });
        opts.appendChild(btn);
      });
      box.appendChild(opts);
      wrap.appendChild(box);
    });
  }

  function renderEslab(d) {
    var wrap = document.getElementById("blockEslab");
    if (!wrap || !d.eslabQol) return;
    var ul = el("ul");
    d.eslabQol.forEach(function (html) { ul.appendChild(el("li", null, html)); });
    wrap.appendChild(ul);
  }

  function renderKitob(d) {
    if (!d.kitob) return;
    var betWrap = document.getElementById("kitobBetlar");
    if (betWrap) betWrap.textContent = d.kitob.betlar;

    var wrap = document.getElementById("kitobSahifalar");
    if (!wrap) return;
    d.kitob.sahifalar.forEach(function (p) {
      var a = el("a", { class: "kitob-sahifa", href: p.img });
      a.appendChild(el("img", { src: p.img, alt: "Darslik, " + p.bet, loading: "lazy", width: p.width, height: p.height }));
      a.appendChild(el("span", null, p.bet + " · kattalashtirish"));
      wrap.appendChild(a);
    });
  }

  function renderDoska(d) {
    if (!d.doska) return;
    var introWrap = document.getElementById("doskaIntro");
    if (introWrap) introWrap.textContent = d.doska.intro;

    var wrap = document.getElementById("doskaMasalalar");
    if (!wrap) return;

    d.doska.masalalar.forEach(function (m) {
      var isStatic = !!m.static;
      var box = el("div", { class: "doska-masala" + (isStatic ? " doska-masala-tarif" : "") });
      if (!isStatic) box.setAttribute("data-doska", "");

      if (m.kirish) {
        box.appendChild(el("p", { class: "doska-masala-kirish" }, m.kirish));
      }

      // "img" hozircha yo'q (qayta olinmoqda) — shu holatda faqat caption
      // bilan bo'sh joy ko'rsatiladi, matn (steps/static) baribir ishlaydi.
      var imgWrap = el("div", { class: "doska-masala-img" });
      if (m.img) {
        var a = el("a", { href: m.img, target: "_blank", rel: "noopener", class: "doska-img" });
        a.appendChild(el("img", { src: m.img, alt: m.alt, loading: "lazy", width: m.width, height: m.height }));
        imgWrap.appendChild(a);
      } else {
        imgWrap.classList.add("doska-masala-img-pending");
        imgWrap.appendChild(el("div", { class: "doska-img-placeholder" }, "Rasm tayyorlanmoqda"));
      }
      imgWrap.appendChild(el("span", { class: "doska-img-cap" }, m.caption));
      box.appendChild(imgWrap);

      if (isStatic) {
        var staticWrap = el("div", { class: "doska-steps doska-steps-static" });
        staticWrap.appendChild(el("p", null, m.static));
        box.appendChild(staticWrap);
      } else {
        var stepsWrap = el("div", { class: "doska-steps" });
        var ol = el("ol", { class: "doska-steps-list", "data-doska-list": "" });
        m.steps.forEach(function (stepHtml) { ol.appendChild(el("li", null, stepHtml)); });
        stepsWrap.appendChild(ol);
        var controls = el("div", { class: "doska-steps-controls" });
        controls.appendChild(el("button", { type: "button", class: "btn doska-step-next", "data-doska-next": "" }, "Keyingi qadam"));
        controls.appendChild(el("button", { type: "button", class: "btn btn-ghost doska-step-reset", "data-doska-reset": "" }, "Boshidan"));
        stepsWrap.appendChild(controls);
        box.appendChild(stepsWrap);
      }
      wrap.appendChild(box);
    });

    // Qadam-baqadam ochish — barcha [data-doska] bloklar uchun umumiy
    document.querySelectorAll("[data-doska]").forEach(function (box) {
      var items = box.querySelectorAll("[data-doska-list] li");
      var nextBtn = box.querySelector("[data-doska-next]");
      var resetBtn = box.querySelector("[data-doska-reset]");
      var shown = 0;

      function update() {
        items.forEach(function (li, i) { li.classList.toggle("is-shown", i < shown); });
        if (shown >= items.length) {
          nextBtn.disabled = true;
          nextBtn.textContent = "Barcha qadamlar ko'rsatildi";
        } else {
          nextBtn.disabled = false;
          nextBtn.textContent = "Keyingi qadam";
        }
      }

      nextBtn.addEventListener("click", function () { if (shown < items.length) shown++; update(); });
      resetBtn.addEventListener("click", function () { shown = 0; update(); });
      update();
    });
  }

  function renderMashqlar(d) {
    if (!d.mashqlar) return;
    var head = document.getElementById("mashqHead");
    if (head) head.textContent = "Darslikdan mashqlar · " + d.mashqlar.betlar;
    var introWrap = document.getElementById("mashqIntro");
    if (introWrap) {
      var introText = d.mashqlar.intro || "Mashqlarni mustaqil yeching va javobingizni tekshiring.";
      introText = introText.replace(/daftarga yeching\.?\s*/gi, "").replace(/o'qituvchi doskada tekshiradi\.?\s*/gi, "").trim();
      introWrap.textContent = introText || "Mashqlarni mustaqil yeching va javobingizni tekshiring.";
    }

    var wrap = document.getElementById("mashqList");
    if (!wrap) return;

    var storagePrefix = "ja_mashq_" + d.id + "_";
    var solvedCount = 0;
    var totalCount = d.mashqlar.items ? d.mashqlar.items.length : 0;

    var progressPill = document.createElement("span");
    progressPill.className = "mashqlar-progress-pill";
    progressPill.id = "mashqlarProgressPill";

    var headWrap = head ? head.parentElement : null;
    if (headWrap && !document.getElementById("mashqlarProgressPill")) {
      var pRow = document.createElement("div");
      pRow.className = "mashqlar-progress-wrap";
      pRow.appendChild(progressPill);
      headWrap.appendChild(pRow);
    }

    function updateProgressBadge() {
      if (progressPill) {
        progressPill.textContent = "Mashqlar: " + solvedCount + " / " + totalCount + " yechildi";
      }
    }

    (d.mashqlar.items || []).forEach(function (item, idx) {
      var itemId = item.id || ("ex-" + (idx + 1));
      var storageKey = storagePrefix + itemId;
      var isSolved = false;
      try { isSolved = localStorage.getItem(storageKey) === "1"; } catch (e) {}
      if (isSolved) solvedCount++;

      var card = el("li", { class: "mashq-item-card" + (isSolved ? " is-correct" : "") });

      var topRow = el("div", { class: "mashq-header-row" });
      var titleText = item.title || ((idx + 1) + "-mashq");
      topRow.appendChild(el("h3", { class: "mashq-title" }, titleText));

      var daraja = item.daraja || "asosiy";
      var darajaLabel = daraja === "litsey" ? "Litsey" : daraja === "ortacha" ? "O'rtacha" : "Asosiy";
      topRow.appendChild(el("span", { class: "mashq-badge daraja-" + daraja }, darajaLabel));
      card.appendChild(topRow);

      var savolText = item.savol || item.body || "";
      card.appendChild(el("p", { class: "mashq-savol-text" }, savolText));
      if (item.sub) card.appendChild(el("p", { class: "mashq-sub" }, item.sub));

      var formRow = el("div", { class: "mashq-action-row" });
      var input = el("input", {
        type: "text",
        class: "mashq-input",
        placeholder: item.inputPlaceholder || "Javobni kiriting...",
        "aria-label": titleText + " javobi"
      });
      if (isSolved) {
        input.value = (item.togriJavob && item.togriJavob[0]) || (item.yechim && item.yechim.javob) || "Yechilgan";
        input.disabled = true;
      }
      formRow.appendChild(input);

      var btnCheck = el("button", { type: "button", class: "btn-check" }, isSolved ? "Yechilgan" : "Tekshirish");
      if (isSolved) btnCheck.disabled = true;
      formRow.appendChild(btnCheck);

      var btnHint = null;
      if (item.hint) {
        btnHint = el("button", { type: "button", class: "btn-hint-toggle" }, "Maslahat");
        formRow.appendChild(btnHint);
      }
      card.appendChild(formRow);

      var feedback = el("div", { class: "mashq-feedback" });
      if (isSolved) {
        feedback.className = "mashq-feedback is-success";
        feedback.textContent = "Ofarin! To'g'ri topdingiz!";
      }
      card.appendChild(feedback);

      var hintBox = null;
      if (item.hint) {
        hintBox = el("div", { class: "mashq-hint-box", style: "display:none;" }, item.hint);
        card.appendChild(hintBox);
        btnHint.addEventListener("click", function () {
          var isHidden = hintBox.style.display === "none";
          hintBox.style.display = isHidden ? "block" : "none";
        });
      }

      var yechimBox = el("details", { class: "mashq-yechim-accordion", style: isSolved ? "" : "display:none;" });
      yechimBox.appendChild(el("summary", null, "To'liq yechimni ko'rish"));

      if (item.yechim && item.yechim.qadamlar) {
        var stepsBox = el("div", { class: "mashq-yechim-steps", style: "padding-left:4px; margin-top:8px;" });
        item.yechim.qadamlar.forEach(function (q) {
          stepsBox.appendChild(el("div", { class: "mashq-step-line", style: "margin-bottom:6px; line-height:1.5;" }, q));
        });
        yechimBox.appendChild(stepsBox);
        if (item.yechim.javob) {
          yechimBox.appendChild(el("p", { style: "margin-top:6px; font-weight:700;" }, "Javob: " + item.yechim.javob));
        }
      } else {
        var pAns = el("p", { style: "margin-top:6px; font-weight:700;" }, "Javob: " + ((item.togriJavob && item.togriJavob[0]) || ""));
        yechimBox.appendChild(pAns);
      }
      card.appendChild(yechimBox);

      var attempts = 0;
      function checkAnswer() {
        if (card.classList.contains("is-correct")) return;
        var val = (input.value || "").trim().toLowerCase();
        if (!val) {
          input.focus();
          return;
        }

        var isCorrect = false;
        if (item.validationRegex) {
          try {
            var re = new RegExp(item.validationRegex, "i");
            if (re.test(val)) isCorrect = true;
          } catch (e) {}
        }
        if (!isCorrect && item.togriJavob) {
          var answers = Array.isArray(item.togriJavob) ? item.togriJavob : [item.togriJavob];
          for (var a = 0; a < answers.length; a++) {
            var normA = String(answers[a]).trim().toLowerCase();
            if (val === normA || val.replace(/\s+/g, "") === normA.replace(/\s+/g, "")) {
              isCorrect = true;
              break;
            }
          }
        }

        if (isCorrect) {
          card.classList.add("is-correct");
          feedback.className = "mashq-feedback is-success";
          feedback.textContent = "Ofarin! To'g'ri topdingiz! (+10 XP)";
          input.disabled = true;
          btnCheck.disabled = true;
          btnCheck.textContent = "Yechilgan";
          yechimBox.style.display = "";
          solvedCount++;
          updateProgressBadge();
          try { localStorage.setItem(storageKey, "1"); } catch (e) {}
          if (window.JA_SOUND && window.JA_SOUND.playCorrect) window.JA_SOUND.playCorrect();
          if (window.JA_GAMIFICATION && window.JA_GAMIFICATION.addXp) window.JA_GAMIFICATION.addXp(10);
        } else {
          attempts++;
          input.classList.remove("shake");
          void input.offsetWidth;
          input.classList.add("shake");
          feedback.className = "mashq-feedback is-error";
          feedback.textContent = "Noto'g'ri. Yana bir bor urinib ko'ring yoki maslahatni oching.";
          if (window.JA_SOUND && window.JA_SOUND.playError) window.JA_SOUND.playError();
          if (attempts >= 2) {
            yechimBox.style.display = "";
          }
        }
      }

      btnCheck.addEventListener("click", checkAnswer);
      input.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
          e.preventDefault();
          checkAnswer();
        }
      });

      wrap.appendChild(card);
    });

    updateProgressBadge();
  }

  function renderOlimpiada(d) {
    if (!d.olimpiada) return;
    var main = document.querySelector("main");
    if (!main) return;

    var sec = el("section", { class: "block block-olimpiada", id: "blockOlimpiada" });
    sec.appendChild(el("div", { class: "olimpiada-badge" }, d.olimpiada.qiyinlik || "Litsey va Olimpiada tayyorgarligi"));
    sec.appendChild(el("h2", null, d.olimpiada.sarlavha || d.olimpiada.nomi || "Nostandart mantiqiy masala"));
    var leadText = d.olimpiada.korsatma || d.olimpiada.izoh;
    if (leadText) {
      sec.appendChild(el("p", { class: "olimpiada-lead" }, leadText));
    }

    var card = el("div", { class: "olimpiada-card" });
    card.appendChild(el("p", { class: "olimpiada-savol" }, d.olimpiada.masala || d.olimpiada.shart || ""));

    if (d.olimpiada.yechim) {
      var det = el("details", { class: "olimpiada-details" });
      det.appendChild(el("summary", null, "Qadamma-qadam tahlil va matematik yechim"));
      var analysisBox = el("div", { class: "olimpiada-analysis" });
      if (d.olimpiada.yechim.tahlil) {
        analysisBox.appendChild(el("p", null, "<strong>Mantiqiy tahlil:</strong> " + d.olimpiada.yechim.tahlil));
      }
      if (d.olimpiada.yechim.qadamlar) {
        var ol = el("ol", { style: "padding-left:20px; line-height:1.6;" });
        d.olimpiada.yechim.qadamlar.forEach(function (st) {
          ol.appendChild(el("li", null, st));
        });
        analysisBox.appendChild(ol);
      }
      if (d.olimpiada.yechim.javob) {
        analysisBox.appendChild(el("p", { style: "margin-top:10px; font-weight:700; color:var(--accent);" }, "Javob: " + d.olimpiada.yechim.javob));
      }

      var olimpKey = "ja_olimp_" + d.id;
      var isClaimed = false;
      try { isClaimed = localStorage.getItem(olimpKey) === "1"; } catch (e) {}
      var btnClaim = el("button", { type: "button", class: "btn", style: "margin-top:12px; font-size:0.86rem; padding:6px 14px; background:var(--paper); border:1px solid var(--line-strong);" }, isClaimed ? "Zabt etildi (+25 XP olindi)" : "Yechimni tushundim (+25 XP)");
      if (isClaimed) btnClaim.disabled = true;
      btnClaim.addEventListener("click", function () {
        btnClaim.disabled = true;
        btnClaim.textContent = "Zabt etildi (+25 XP olindi)";
        try { localStorage.setItem(olimpKey, "1"); } catch (e) {}
        if (window.JA_GAMIFICATION && window.JA_GAMIFICATION.addXp) window.JA_GAMIFICATION.addXp(25);
        if (window.JA_SOUND && window.JA_SOUND.playCorrect) window.JA_SOUND.playCorrect();
      });
      analysisBox.appendChild(btnClaim);

      det.appendChild(analysisBox);
      card.appendChild(det);
    }

    sec.appendChild(card);

    var xulosaBlock = document.querySelector(".block-xulosa");
    if (xulosaBlock && xulosaBlock.parentElement) {
      xulosaBlock.parentElement.insertBefore(sec, xulosaBlock);
    } else {
      main.appendChild(sec);
    }
  }

  function renderChapterExam(d) {
    var chapterMap = { 12: 1, 16: 2, 27: 3, 33: 4, 38: 5 };
    var bobNum = chapterMap[d.id];
    if (!bobNum) return;

    var main = document.querySelector("main");
    if (!main) return;

    var sec = el("section", { class: "block block-chapter-exam", id: "blockChapterExam", style: "margin-top:28px; background:var(--white); border:2px solid var(--accent); border-radius:16px; padding:24px; box-shadow:0 8px 24px rgba(0,0,0,0.05);" });

    sec.innerHTML =
      '<div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px; margin-bottom:12px;">' +
        '<div style="display:inline-flex; align-items:center; gap:6px; background:rgba(194,75,42,0.1); color:var(--accent); font-weight:700; padding:4px 12px; border-radius:20px; font-size:0.85rem;">' +
          '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>' +
          'Bob Nazorat Testi' +
        '</div>' +
        '<div style="font-size:0.9rem; color:var(--ink-soft); font-weight:600;">10 ta savol · 15 daqiqa · +100 XP</div>' +
      '</div>' +
      '<h2 style="margin:0 0 10px; font-size:1.35rem; color:var(--ink);">' + (d.bob ? d.bob.roman : "") + ' Bobni Mustahkamlash va Nazorat Testi</h2>' +
      '<p style="color:var(--ink-soft); margin-bottom:18px; line-height:1.6;">' +
        'Siz ' + (d.bob ? d.bob.nom : "") + ' bobini to\'liq yakunladingiz! 10 ta saralangan masala (6 ta standart va 4 ta litsey imtihoni savoli) orqali bilimingizni sinang. 80%+ natijada +100 XP va maxsus Bob Medali beriladi.' +
      '</p>' +
      '<div id="chapterExamContainer">' +
        '<button type="button" class="btn" id="btnStartChapterExam" style="background:var(--accent); color:#fff; font-weight:700; padding:12px 26px; border-radius:10px; cursor:pointer;">' +
          'Nazorat testini boshlash (15 daqiqa)' +
        '</button>' +
      '</div>';

    var xulosaBlock = document.querySelector(".block-xulosa");
    if (xulosaBlock && xulosaBlock.parentElement) {
      xulosaBlock.parentElement.insertBefore(sec, xulosaBlock);
    } else {
      main.appendChild(sec);
    }

    var startBtn = sec.querySelector("#btnStartChapterExam");
    var examContainer = sec.querySelector("#chapterExamContainer");
    if (startBtn && examContainer) {
      startBtn.addEventListener("click", function () {
        if (window.JA_EXAM && window.JA_EXAM.startChapterExam) {
          window.JA_EXAM.startChapterExam(bobNum, examContainer);
        }
      });
    }
  }

  function initModeToggle() {
    var btnStudent = document.getElementById("modeStudent");
    var btnTeacher = document.getElementById("modeTeacher");
    if (!btnStudent || !btnTeacher) return;

    var urlParam = "";
    try {
      var params = new URLSearchParams(window.location.search);
      urlParam = params.get("mode") || "";
    } catch (e) {}

    var savedMode = "";
    try {
      savedMode = localStorage.getItem("jonli-algebra-user-mode") || "";
    } catch (e) {}

    var isTeacher = urlParam === "teacher" || savedMode === "teacher";

    function applyMode(teacher) {
      document.documentElement.classList.toggle("teacher-mode", teacher);
      btnStudent.classList.toggle("is-active", !teacher);
      btnTeacher.classList.toggle("is-active", teacher);
      btnStudent.setAttribute("aria-checked", !teacher ? "true" : "false");
      btnTeacher.setAttribute("aria-checked", teacher ? "true" : "false");
      try {
        localStorage.setItem("jonli-algebra-user-mode", teacher ? "teacher" : "student");
      } catch (e) {}
    }

    applyMode(isTeacher);

    btnStudent.addEventListener("click", function () { applyMode(false); });
    btnTeacher.addEventListener("click", function () { applyMode(true); });
  }

  function renderXulosa(d) {
    var wrap = document.getElementById("xulosaList");
    if (wrap && d.xulosa) {
      d.xulosa.forEach(function (html) { wrap.appendChild(el("li", null, html)); });
    }
    var boardWrap = document.getElementById("xulosaBoardList");
    if (boardWrap && d.xulosaBoard) {
      d.xulosaBoard.forEach(function (item) { boardWrap.appendChild(el("li", null, item.html)); });
    }
  }

  function renderSahna(d) {
    var stage = document.getElementById("sahna");
    if (!stage || !d.sahna) return;
    stage.setAttribute("aria-label", d.sahna.ariaLabel || "");

    // Deep-link parametrlarini sahna o'zgaruvchilariga singdirish
    try {
      var urlParams = new URLSearchParams(window.location.search);
      if (d.sahna.vars) {
        Object.keys(d.sahna.vars).forEach(function (vKey) {
          if (urlParams.has(vKey)) {
            var parsedVal = parseFloat(urlParams.get(vKey));
            if (!isNaN(parsedVal)) {
              d.sahna.vars[vKey].value = parsedVal;
            }
          }
        });
      }
    } catch (e) {}

    var builder = window.KA_SAHNA && window.KA_SAHNA[d.sahna.type];
    if (!builder) {
      console.error("Noma'lum sahna turi:", d.sahna.type);
      stage.insertAdjacentHTML(
        "beforeend",
        '<p class="sahna-fallback">Vizualizator yuklanmadi (' +
          String(d.sahna.type || "?") +
          "). Sahifani yangilang.</p>"
      );
      return;
    }
    try {
      builder(stage, d.sahna);
      if (window.location.hash === "#sahna") {
        setTimeout(function () {
          stage.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 150);
      }
    } catch (err) {
      console.error("Sahna xatosi:", err);
      stage.insertAdjacentHTML(
        "beforeend",
        '<p class="sahna-fallback">Vizualizator ishlamadi. Sahifani yangilang.</p>'
      );
    }
  }

  function init() {
    var d = readData();
    renderMeta(d);
    renderAgenda(d);
    renderSahna(d);
    renderKirish(d);
    renderReja(d);
    renderQoida(d);
    renderSavollar(d);
    renderEslab(d);
    renderKitob(d);
    renderDoska(d);
    renderMashqlar(d);
    renderOlimpiada(d);
    renderChapterExam(d);
    renderXulosa(d);
    initModeToggle();

    if (window.KA_AGENDA && KA_AGENDA.init) KA_AGENDA.init();
    if (window.KA_CLASSTIMER && KA_CLASSTIMER.init) KA_CLASSTIMER.init();
    if (window.KA_KITOB && KA_KITOB.init) KA_KITOB.init();
    if (window.KA_SAHNA_EXPAND) window.KA_SAHNA_EXPAND.init();
    if (window.KA && KA.onLessonOpen) KA.onLessonOpen(d.id);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
