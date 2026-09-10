/* Jonli Algebra — Whiteboard (chiziladigan taxta)
   Har darsda bitta float doira tugma: bosilsa to'liq ekran taxta ochiladi.
   Rang, qalinlik, o'chirgich, tozalash, darsga qaytish.
   Chizma localStorage'da saqlanadi (dars yo'liga bog'langan).
   data.json.features.whiteboard === false bo'lsa tugma qo'shilmaydi. */
(function () {
  "use strict";

  var STORAGE_PREFIX = "jonli-algebra-wb-";

  function featureEnabled() {
    try {
      var el = document.getElementById("dars-data");
      if (!el) return true;
      var data = JSON.parse(el.textContent);
      var f = data && data.features;
      return !(f && f.whiteboard === false);
    } catch (e) {
      return true;
    }
  }

  function storageKey() {
    // Dars yo'li bo'yicha alohida saqlash (masalan /lessons/math/9/1/)
    var path = location.pathname || "";
    var m = path.match(/lessons\/math\/9\/(\d+)/);
    var id = m ? m[1] : "global";
    return STORAGE_PREFIX + id;
  }

  function injectStyles() {
    if (document.getElementById("ka-wb-styles")) return;
    var css = [
      "#kaWbFab{",
      "position:fixed;right:20px;bottom:24px;z-index:9000;",
      "width:56px;height:56px;border-radius:50%;border:none;",
      "background:var(--accent,#c24b2a);color:#fff;",
      "box-shadow:0 8px 24px rgba(26,34,28,.22);",
      "cursor:pointer;display:flex;align-items:center;justify-content:center;",
      "transition:transform .15s ease,box-shadow .15s ease;",
      "}",
      "#kaWbFab:hover{transform:scale(1.06);box-shadow:0 10px 28px rgba(26,34,28,.28)}",
      "#kaWbFab:active{transform:scale(.97)}",
      "#kaWbFab svg{width:26px;height:26px;pointer-events:none}",
      "#kaWbOverlay{",
      "position:fixed;inset:0;z-index:9500;display:none;",
      "flex-direction:column;background:#1a3a2a;",
      "}",
      "#kaWbOverlay.is-open{display:flex}",
      "#kaWbToolbar{",
      "flex:0 0 auto;display:flex;flex-wrap:wrap;align-items:center;gap:10px;",
      "padding:10px 14px;background:rgba(0,0,0,.35);color:#f3eee4;",
      "}",
      "#kaWbToolbar .ka-wb-group{display:flex;align-items:center;gap:6px}",
      "#kaWbToolbar button,#kaWbToolbar label{",
      "font:inherit;font-size:.9rem;font-weight:600;",
      "border:1.5px solid rgba(243,238,228,.35);background:rgba(255,255,255,.08);",
      "color:#f3eee4;border-radius:999px;padding:7px 14px;cursor:pointer;",
      "}",
      "#kaWbToolbar button:hover{background:rgba(255,255,255,.16)}",
      "#kaWbToolbar button.is-active{",
      "background:var(--accent,#c24b2a);border-color:var(--accent,#c24b2a);color:#fff",
      "}",
      "#kaWbToolbar input[type=color]{",
      "width:36px;height:36px;border:none;border-radius:50%;padding:0;",
      "background:transparent;cursor:pointer;",
      "}",
      "#kaWbToolbar input[type=range]{width:90px;accent-color:var(--accent,#c24b2a)}",
      "#kaWbBack{",
      "margin-left:auto;background:var(--accent,#c24b2a)!important;",
      "border-color:var(--accent,#c24b2a)!important;color:#fff!important",
      "}",
      "#kaWbCanvasWrap{flex:1 1 auto;position:relative;overflow:hidden;touch-action:none}",
      "#kaWbCanvas{display:block;width:100%;height:100%;cursor:crosshair}",
      "@media (max-width:640px){",
      "#kaWbFab{right:14px;bottom:16px;width:50px;height:50px}",
      "#kaWbToolbar{gap:8px;padding:8px 10px}",
      "#kaWbToolbar button{padding:6px 10px;font-size:.82rem}",
      "}"
    ].join("");
    var style = document.createElement("style");
    style.id = "ka-wb-styles";
    style.textContent = css;
    document.head.appendChild(style);
  }

  function createUI() {
    injectStyles();

    // Float tugma
    var fab = document.createElement("button");
    fab.id = "kaWbFab";
    fab.type = "button";
    fab.setAttribute("aria-label", "Whiteboard ochish");
    fab.title = "Whiteboard";
    fab.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<path d="M12 19l7-7 3 3-7 7-3-3z"></path>' +
      '<path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>' +
      '<path d="M2 2l7.586 7.586"></path>' +
      '<circle cx="11" cy="11" r="2"></circle></svg>';
    document.body.appendChild(fab);

    // Overlay
    var overlay = document.createElement("div");
    overlay.id = "kaWbOverlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-label", "Whiteboard");
    overlay.innerHTML =
      '<div id="kaWbToolbar">' +
      '  <div class="ka-wb-group">' +
      '    <button type="button" data-tool="pen" class="is-active">Qalam</button>' +
      '    <button type="button" data-tool="eraser">O\'chirgich</button>' +
      "  </div>" +
      '  <div class="ka-wb-group">' +
      '    <input type="color" id="kaWbColor" value="#ffffff" title="Rang">' +
      '    <label>Qalinlik <input type="range" id="kaWbSize" min="2" max="32" value="4"></label>' +
      "  </div>" +
      '  <div class="ka-wb-group">' +
      '    <button type="button" id="kaWbClear">Tozalash</button>' +
      '    <button type="button" id="kaWbUndo">Orqaga</button>' +
      "  </div>" +
      '  <button type="button" id="kaWbBack">← Darsga qaytish</button>' +
      "</div>" +
      '<div id="kaWbCanvasWrap"><canvas id="kaWbCanvas"></canvas></div>';
    document.body.appendChild(overlay);

    return {
      fab: fab,
      overlay: overlay,
      canvas: overlay.querySelector("#kaWbCanvas"),
      color: overlay.querySelector("#kaWbColor"),
      size: overlay.querySelector("#kaWbSize"),
      clearBtn: overlay.querySelector("#kaWbClear"),
      undoBtn: overlay.querySelector("#kaWbUndo"),
      backBtn: overlay.querySelector("#kaWbBack"),
      toolBtns: overlay.querySelectorAll("[data-tool]"),
    };
  }

  function init() {
    if (!featureEnabled()) return;
    if (document.getElementById("kaWbFab")) return;

    var ui = createUI();
    var canvas = ui.canvas;
    var ctx = canvas.getContext("2d");
    var tool = "pen";
    var drawing = false;
    var lastX = 0;
    var lastY = 0;
    var history = [];
    var maxHistory = 30;

    function resize() {
      var wrap = canvas.parentElement;
      var w = wrap.clientWidth;
      var h = wrap.clientHeight;
      if (w < 1 || h < 1) return;
      // Saqlangan rasmni saqlab qolish uchun vaqtinchalik
      var img = null;
      if (canvas.width > 0 && canvas.height > 0) {
        try {
          img = ctx.getImageData(0, 0, canvas.width, canvas.height);
        } catch (e) {}
      }
      var ratio = window.devicePixelRatio || 1;
      canvas.width = Math.floor(w * ratio);
      canvas.height = Math.floor(h * ratio);
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      // Yashil taxta fon
      ctx.fillStyle = "#1a3a2a";
      ctx.fillRect(0, 0, w, h);
      if (img) {
        try {
          // Eski rasmni yangi o'lchamga moslashtirish murakkab — oddiy: saqlangan PNG dan yuklaymiz
        } catch (e) {}
      }
      loadSaved();
    }

    function saveSnapshot() {
      try {
        if (history.length >= maxHistory) history.shift();
        history.push(canvas.toDataURL("image/png"));
      } catch (e) {}
    }

    function persist() {
      try {
        localStorage.setItem(storageKey(), canvas.toDataURL("image/png"));
      } catch (e) {}
    }

    function loadSaved() {
      try {
        var data = localStorage.getItem(storageKey());
        if (!data) return;
        var img = new Image();
        img.onload = function () {
          var w = canvas.clientWidth;
          var h = canvas.clientHeight;
          ctx.drawImage(img, 0, 0, w, h);
        };
        img.src = data;
      } catch (e) {}
    }

    function pos(e) {
      var rect = canvas.getBoundingClientRect();
      var t = e.touches && e.touches[0] ? e.touches[0] : e;
      return {
        x: t.clientX - rect.left,
        y: t.clientY - rect.top,
      };
    }

    function startDraw(e) {
      e.preventDefault();
      drawing = true;
      saveSnapshot();
      var p = pos(e);
      lastX = p.x;
      lastY = p.y;
      // Nuqta uchun ham
      drawLine(p.x, p.y, p.x, p.y);
    }

    function moveDraw(e) {
      if (!drawing) return;
      e.preventDefault();
      var p = pos(e);
      drawLine(lastX, lastY, p.x, p.y);
      lastX = p.x;
      lastY = p.y;
    }

    function endDraw(e) {
      if (!drawing) return;
      drawing = false;
      persist();
    }

    function drawLine(x0, y0, x1, y1) {
      var size = parseInt(ui.size.value, 10) || 4;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = size;
      if (tool === "eraser") {
        // Taxta foniga "o'chirish"
        ctx.strokeStyle = "#1a3a2a";
        ctx.lineWidth = size * 2.2;
      } else {
        ctx.strokeStyle = ui.color.value || "#ffffff";
      }
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
      ctx.stroke();
    }

    function clearBoard() {
      saveSnapshot();
      var w = canvas.clientWidth;
      var h = canvas.clientHeight;
      ctx.fillStyle = "#1a3a2a";
      ctx.fillRect(0, 0, w, h);
      persist();
    }

    function undo() {
      if (!history.length) return;
      var data = history.pop();
      var img = new Image();
      img.onload = function () {
        var w = canvas.clientWidth;
        var h = canvas.clientHeight;
        ctx.fillStyle = "#1a3a2a";
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);
        persist();
      };
      img.src = data;
    }

    function open() {
      ui.overlay.classList.add("is-open");
      // Keyingi frame'da o'lcham olish
      requestAnimationFrame(function () {
        resize();
      });
    }

    function close() {
      ui.overlay.classList.remove("is-open");
      persist();
    }

    // Events
    ui.fab.addEventListener("click", open);
    ui.backBtn.addEventListener("click", close);
    ui.clearBtn.addEventListener("click", clearBoard);
    ui.undoBtn.addEventListener("click", undo);

    ui.toolBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        tool = btn.getAttribute("data-tool");
        ui.toolBtns.forEach(function (b) {
          b.classList.toggle("is-active", b === btn);
        });
      });
    });

    canvas.addEventListener("mousedown", startDraw);
    canvas.addEventListener("mousemove", moveDraw);
    window.addEventListener("mouseup", endDraw);
    canvas.addEventListener("mouseleave", endDraw);

    canvas.addEventListener("touchstart", startDraw, { passive: false });
    canvas.addEventListener("touchmove", moveDraw, { passive: false });
    canvas.addEventListener("touchend", endDraw);
    canvas.addEventListener("touchcancel", endDraw);

    window.addEventListener("resize", function () {
      if (ui.overlay.classList.contains("is-open")) resize();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && ui.overlay.classList.contains("is-open")) {
        close();
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
