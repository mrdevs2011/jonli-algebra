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

      var imgWrap = el("div", { class: "doska-masala-img" });
      var a = el("a", { href: m.img, target: "_blank", rel: "noopener", class: "doska-img" });
      a.appendChild(el("img", { src: m.img, alt: m.alt, loading: "lazy", width: m.width, height: m.height }));
      imgWrap.appendChild(a);
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
    if (introWrap) introWrap.textContent = d.mashqlar.intro;

    var wrap = document.getElementById("mashqList");
    if (!wrap) return;
    d.mashqlar.items.forEach(function (item) {
      var li = el("li");
      li.appendChild(el("p", null, "<strong>" + escapeHtml(item.title) + "</strong> " + escapeHtml(item.body)));
      if (item.sub) li.appendChild(el("p", { class: "mashq-sub" }, item.sub));
      wrap.appendChild(li);
    });
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
    var builder = window.KA_SAHNA && window.KA_SAHNA[d.sahna.type];
    if (!builder) {
      console.error("Noma'lum sahna turi:", d.sahna.type);
      return;
    }
    builder(stage, d.sahna);
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
    renderXulosa(d);

    if (window.KA_SAHNA_EXPAND) window.KA_SAHNA_EXPAND.init();
    if (window.KA && KA.onLessonOpen) KA.onLessonOpen(d.id);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
