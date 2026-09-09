/* Jonli Algebra — Doska (elektron taxta / UHB) rejimi
   Barcha sahifalarda bir xil ishlaydi: header'ga tugma qo'shadi,
   katta shrift/tugma rejimini yoqadi va to'liq ekranga o'tkazadi.
   localStorage orqali tanlov saqlanadi, darslar orasida yo'qolmaydi. */
(function () {
  var STORAGE_KEY = 'jonli-algebra-board-mode';

  function isOn() {
    try { return localStorage.getItem(STORAGE_KEY) === '1'; } catch (e) { return false; }
  }

  function save(on) {
    try { localStorage.setItem(STORAGE_KEY, on ? '1' : '0'); } catch (e) {}
  }

  function requestFs() {
    try {
      var el = document.documentElement;
      var req = el.requestFullscreen || el.webkitRequestFullscreen || el.msRequestFullscreen;
      if (req && !document.fullscreenElement) req.call(el);
    } catch (e) {}
  }

  function exitFs() {
    try {
      var exit = document.exitFullscreen || document.webkitExitFullscreen || document.msExitFullscreen;
      if (document.fullscreenElement && exit) exit.call(document);
    } catch (e) {}
  }

  var ICON_MONITOR = '<svg class="btn-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="13" rx="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>';
  var ICON_CHECK = '<svg class="btn-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"></polyline></svg>';

  function updateBtn(btn, on) {
    if (!btn) return;
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    btn.innerHTML = (on ? ICON_CHECK : ICON_MONITOR) + ' Doska rejimi';
  }

  function apply(on) {
    document.documentElement.classList.toggle('board-mode', on);
    save(on);
    updateBtn(document.getElementById('boardModeBtn'), on);
  }

  // Sahifa yuklanganda avvalgi tanlovni tiklaymiz (fullscreen'ga majburlamaymiz —
  // brauzerlar bunga foydalanuvchi ishorasi bo'lmasa ruxsat bermaydi).
  if (isOn()) {
    document.documentElement.classList.add('board-mode');
  }

  document.addEventListener('DOMContentLoaded', function () {
    var header = document.querySelector('.site-header');
    if (!header || document.getElementById('boardModeBtn')) return;

    var btn = document.createElement('button');
    btn.id = 'boardModeBtn';
    btn.type = 'button';
    btn.className = 'btn btn-board';
    updateBtn(btn, isOn());

    btn.addEventListener('click', function () {
      var next = !document.documentElement.classList.contains('board-mode');
      apply(next);
      if (next) requestFs(); else exitFs();
    });

    header.appendChild(btn);
  });
})();
