/* Jonli Algebra — Whiteboard (sodda, zamonaviy)
   Float tugma → to'liq ekran taxta. Minimal asboblar.
   data.json.features.whiteboard === false bo'lsa o'chiriladi. */
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
    var path = location.pathname || "";
    var m = path.match(/lessons\/math\/9\/(\d+)/);
    return STORAGE_PREFIX + (m ? m[1] : "global");
  }

  function injectStyles() {
    if (document.getElementById("ka-wb-styles")) return;
    var css = [
      "#kaWbFab{",
      "position:fixed;right:22px;bottom:26px;z-index:9000;",
      "width:52px;height:52px;border-radius:50%;border:none;",
      "background:#111;color:#fff;",
      "box-shadow:0 4px 20px rgba(0,0,0,.18);",
      "cursor:pointer;display:grid;place-items:center;",
      "transition:transform .2s cubic-bezier(.2,.8,.2,1),box-shadow .2s;",
      "}",
      "#kaWbFab:hover{transform:scale(1.08);box-shadow:0 8px 28px rgba(0,0,0,.22)}",
      "#kaWbFab:active{transform:scale(.95)}",
      "#kaWbFab svg{width:22px;height:22px}",

      "#kaWbOverlay{",
      "position:fixed;inset:0;z-index:9500;display:none;",
      "flex-direction:column;background:#0d0d0d;",
      "}",
      "#kaWbOverlay.is-open{display:flex}",

      "#kaWbBar{",
      "flex:0 0 auto;display:flex;align-items:center;gap:8px;",
      "padding:12px 16px;background:rgba(255,255,255,.04);",
      "backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);",
      "border-bottom:1px solid rgba(255,255,255,.06);",
      "}",
      "#kaWbBar button{",
      "font:inherit;font-size:13px;font-weight:500;letter-spacing:.01em;",
      "border:none;background:transparent;color:rgba(255,255,255,.7);",
      "border-radius:10px;padding:8px 14px;cursor:pointer;",
      "transition:background .15s,color .15s;",
      "}",
      "#kaWbBar button:hover{background:rgba(255,255,255,.08);color:#fff}",
      "#kaWbBar button.is-on{background:rgba(255,255,255,.12);color:#fff}",
      "#kaWbBar .ka-sep{",
      "width:1px;height:20px;background:rgba(255,255,255,.1);margin:0 4px",
      "}",
      "#kaWbColors{display:flex;gap:6px;align-items:center}",
      "#kaWbColors button{",
      "width:22px;height:22px;border-radius:50%;padding:0;",
      "border:2px solid transparent;box-shadow:inset 0 0 0 1px rgba(0,0,0,.15)",
      "}",
      "#kaWbColors button.is-on{border-color:#fff;transform:scale(1.15)}",
      "#kaWbSize{",
      "width:72px;height:4px;accent-color:#fff;cursor:pointer;",
      "}",
      "#kaWbBack{",
      "margin-left:auto!important;",
      "background:rgba(255,255,255,.1)!important;color:#fff!important;",
      "border-radius:10px!important;padding:8px 16px!important;",
      "}",
      "#kaWbBack:hover{background:rgba(255,255,255,.18)!important}",

      "#kaWbStage{flex:1 1 auto;position:relative;overflow:hidden;touch-action:none}",
      "#kaWbCanvas{display:block;width:100%;height:100%;cursor:crosshair}",

      "@media(max-width:560px){",
      "#kaWbFab{right:16px;bottom:18px;width:48px;height:48px}",
      "#kaWbBar{padding:10px 12px;gap:4px;overflow-x:auto}",
      "#kaWbBar button{padding:7px 10px;font-size:12px}",
      "}"
    ].join("");
    var s = document.createElement("style");
    s.id = "ka-wb-styles";
    s.textContent = css;
    document.head.appendChild(s);
  }

  var COLORS = ["#ffffff", "#ff6b6b", "#ffd93d", "#6bcb77", "#4d96ff"];

  function createUI() {
    injectStyles();

    var fab = document.createElement("button");
    fab.id = "kaWbFab";
    fab.type = "button";
    fab.setAttribute("aria-label", "Doska");
    fab.title = "Doska";
    fab.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>' +
      '<path d="m15 5 4 4"/></svg>';
    document.body.appendChild(fab);

    var colorBtns = COLORS.map(function (c, i) {
      return (
        '<button type="button" data-color="' +
        c +
        '" style="background:' +
        c +
        '"' +
        (i === 0 ? ' class="is-on"' : "") +
        ' aria-label="Rang"></button>'
      );
    }).join("");

    var overlay = document.createElement("div");
    overlay.id = "kaWbOverlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-label", "Doska");
    overlay.innerHTML =
      '<div id="kaWbBar">' +
      '  <button type="button" data-tool="pen" class="is-on">Chizish</button>' +
      '  <button type="button" data-tool="eraser">O\'chirish</button>' +
      '  <span class="ka-sep"></span>' +
      '  <div id="kaWbColors">' +
      colorBtns +
      "  </div>" +
      '  <span class="ka-sep"></span>' +
      '  <input type="range" id="kaWbSize" min="2" max="28" value="4" title="Qalinlik">' +
      '  <span class="ka-sep"></span>' +
      '  <button type="button" id="kaWbClear">Tozalash</button>' +
      '  <button type="button" id="kaWbBack">Yopish</button>' +
      "</div>" +
      '<div id="kaWbStage"><canvas id="kaWbCanvas"></canvas></div>';
    document.body.appendChild(overlay);

    return {
      fab: fab,
      overlay: overlay,
      canvas: overlay.querySelector("#kaWbCanvas"),
      size: overlay.querySelector("#kaWbSize"),
      clearBtn: overlay.querySelector("#kaWbClear"),
      backBtn: overlay.querySelector("#kaWbBack"),
      toolBtns: overlay.querySelectorAll("[data-tool]"),
      colorBtns: overlay.querySelectorAll("#kaWbColors button"),
    };
  }

  function init() {
    if (!featureEnabled()) return;
    if (document.getElementById("kaWbFab")) return;

    var ui = createUI();
    var canvas = ui.canvas;
    var ctx = canvas.getContext("2d");
    var tool = "pen";
    var color = COLORS[0];
    var drawing = false;
    var lastX = 0;
    var lastY = 0;
    var BG = "#0d0d0d";

    function resize() {
      var wrap = canvas.parentElement;
      var w = wrap.clientWidth;
      var h = wrap.clientHeight;
      if (w < 1 || h < 1) return;
      var ratio = window.devicePixelRatio || 1;
      canvas.width = Math.floor(w * ratio);
      canvas.height = Math.floor(h * ratio);
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      ctx.fillStyle = BG;
      ctx.fillRect(0, 0, w, h);
      loadSaved();
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
          ctx.drawImage(img, 0, 0, canvas.clientWidth, canvas.clientHeight);
        };
        img.src = data;
      } catch (e) {}
    }

    function pos(e) {
      var rect = canvas.getBoundingClientRect();
      var t = e.touches && e.touches[0] ? e.touches[0] : e;
      return { x: t.clientX - rect.left, y: t.clientY - rect.top };
    }

    function startDraw(e) {
      e.preventDefault();
      drawing = true;
      var p = pos(e);
      lastX = p.x;
      lastY = p.y;
      stroke(p.x, p.y, p.x, p.y);
    }

    function moveDraw(e) {
      if (!drawing) return;
      e.preventDefault();
      var p = pos(e);
      stroke(lastX, lastY, p.x, p.y);
      lastX = p.x;
      lastY = p.y;
    }

    function endDraw() {
      if (!drawing) return;
      drawing = false;
      persist();
    }

    function stroke(x0, y0, x1, y1) {
      var size = parseInt(ui.size.value, 10) || 4;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      if (tool === "eraser") {
        ctx.strokeStyle = BG;
        ctx.lineWidth = size * 3;
      } else {
        ctx.strokeStyle = color;
        ctx.lineWidth = size;
      }
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
      ctx.stroke();
    }

    function clearBoard() {
      var w = canvas.clientWidth;
      var h = canvas.clientHeight;
      ctx.fillStyle = BG;
      ctx.fillRect(0, 0, w, h);
      persist();
    }

    function open() {
      ui.overlay.classList.add("is-open");
      requestAnimationFrame(resize);
    }

    function close() {
      ui.overlay.classList.remove("is-open");
      persist();
    }

    ui.fab.addEventListener("click", open);
    ui.backBtn.addEventListener("click", close);
    ui.clearBtn.addEventListener("click", clearBoard);

    ui.toolBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        tool = btn.getAttribute("data-tool");
        ui.toolBtns.forEach(function (b) {
          b.classList.toggle("is-on", b === btn);
        });
      });
    });

    ui.colorBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        color = btn.getAttribute("data-color");
        tool = "pen";
        ui.colorBtns.forEach(function (b) {
          b.classList.toggle("is-on", b === btn);
        });
        ui.toolBtns.forEach(function (b) {
          b.classList.toggle("is-on", b.getAttribute("data-tool") === "pen");
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
      if (e.key === "Escape" && ui.overlay.classList.contains("is-open")) close();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
