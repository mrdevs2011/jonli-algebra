(function () {
  const root = document.getElementById("app");
  if (!root) return;

  const counts = KA.counts();
  const percent = Math.round((counts.ready / counts.total) * 100) || 0;

  function pill(state) {
    if (state === "done") return '<span class="pill pill-done">O‘tilgan</span>';
    if (state === "ready") return '<span class="pill pill-ready">Tayyor</span>';
    return '<span class="pill pill-soon">Tez orada</span>';
  }

  const toc = KA_BOBLAR.map(function (b) {
    return '<a href="#bob-' + b.id + '">' + b.roman + " bob</a>";
  }).join("");

  const chapters = KA_BOBLAR.map(function (bob) {
    const lessons = KA_DARSLAR.filter(function (d) { return d.bob === bob.id; });
    const rows = lessons.map(function (d) {
      const state = KA.state(d.id);
      return (
        '<a class="lesson" href="' + d.id + '/">' +
          '<div class="lesson-num">' + d.paragraf + "</div>" +
          "<div>" +
            "<h3>" + d.nom + "</h3>" +
            "<p>" + d.qisqa + "</p>" +
          "</div>" +
          pill(state) +
        "</a>"
      );
    }).join("");

    return (
      '<section class="chapter" id="bob-' + bob.id + '">' +
        '<div class="chapter-head">' +
          '<div class="roman">' + bob.roman + "</div>" +
          "<div>" +
            "<h2>" + bob.nom + "</h2>" +
            "<p>" + bob.izoh + " · " + lessons.length + " dars</p>" +
          "</div>" +
        "</div>" +
        '<div class="lessons">' + rows + "</div>" +
      "</section>"
    );
  }).join("");

  root.innerHTML =
    '<section class="hero">' +
      "<div>" +
        "<h1>Algebra<br>ko‘rinsin.</h1>" +
        "<p>9-sinf. Alimov darsligi tartibida. Har dars — avval chizma, keyin qoida. Hozir poydevor turibdi: darslar sekin-asta, 1–2 yil ichida ochiladi.</p>" +
      "</div>" +
      '<aside class="stats">' +
        '<div class="stats-label">Ochilgan darslar</div>' +
        '<div class="stats-num">' + counts.ready + " / " + counts.total + "</div>" +
        '<div class="bar"><span style="width:' + percent + '%"></span></div>' +
      "</aside>" +
    "</section>" +
    '<nav class="toc">' + toc + "</nav>" +
    chapters +
    '<p class="note">Har kartochka o‘z papkasiga olib boradi: <code>./1/</code>, <code>./2/</code> … <code>./38/</code>. Ichida <code>index.html</code> turadi. Yoriqnoma: <code>YORIQNOMA.md</code></p>';
})();
