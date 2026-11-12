/**
 * Jonli Algebra — dashboard
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

  // Hozircha faqat 9-sinf algebra. Kelajakda boshqa fan/sinf qo'shilsa,
  // KA_DARSLAR ga "path" maydoni qo'shib, shu yerda ishlatiladi.
  var LESSONS_BASE = "lessons/math/9/";

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function pill(state) {
    if (state === "done") return '<span class="pill pill-done">O‘tilgan</span>';
    if (state === "ready") return '<span class="pill pill-ready">Tayyor</span>';
    return '<span class="pill pill-soon">Tez orada</span>';
  }

  var toc = KA_BOBLAR.map(function (b) {
    return '<a href="#bob-' + b.id + '">' + escapeHtml(b.roman) + " bob</a>";
  }).join("");

  var chapters = KA_BOBLAR.map(function (bob) {
    var lessons = KA_DARSLAR.filter(function (d) {
      return d.bob === bob.id;
    });

    var rows = lessons.map(function (d) {
      var state = KA.state(d.id);
      return (
        '<a class="lesson" href="' + LESSONS_BASE + d.id + '/">' +
          '<div class="lesson-num">' + escapeHtml(d.paragraf) + "</div>" +
          "<div>" +
            "<h3>" + escapeHtml(d.nom) + "</h3>" +
            "<p>" + escapeHtml(d.qisqa) + "</p>" +
          "</div>" +
          pill(state) +
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
        "</div>" +
        '<div class="lessons">' + rows + "</div>" +
      "</section>"
    );
  }).join("");

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
    '<nav class="toc" aria-label="Boblar">' + toc + "</nav>" +
    chapters +
    '<p class="note">9-sinf algebra kursi barcha 38 ta paragrafni to\'liq qamrab olgan (1-§ dan 38-§ gacha). Har bir mavzu avtonom ishlaydi va internet talab qilmaydi.</p>';
})();
