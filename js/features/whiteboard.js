/* Jonli Algebra — Whiteboard (sodda, zamonaviy, silliq)
   Canvas only — chizish paytida DOM ga tegilmaydi.
   Fullscreen tugma bor. data.json.features.whiteboard === false → off. */
(function () {
  "use strict";

  var STORAGE_PREFIX = "jonli-algebra-wb-";
  var BG = "#0d0d0d";
  var COLORS = ["#ffffff", "#ff6b6b", "#ffd93d", "#6bcb77", "#4d96ff"];

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
    var css =
      "#kaWbFab{position:fixed;right:22px;bottom:26px;z-index:9000;width:52px;height:52px;" +
      "border-radius:50%;border:none;background:#111;color:#fff;box-shadow:0 4px 20px rgba(0,0,0,.18);" +
      "cursor:pointer;display:grid;place-items:center;" +
      "transition:transform .2s cubic-bezier(.2,.8,.2,1),box-shadow .2s}" +
      "#kaWbFab:hover{transform:scale(1.08);box-shadow:0 8px 28px rgba(0,0,0,.22)}" +
      "#kaWbFab:active{transform:scale(.95)}" +
      "#kaWbFab svg{width:22px;height:22px;pointer-events:none}" +
      "#kaWbOverlay{position:fixed;inset:0;z-index:9500;display:none;flex-direction:column;background:#0d0d0d}" +
      "#kaWbOverlay.is-open{display:flex}" +
      "#kaWbBar{flex:0 0 auto;display:flex;align-items:center;gap:6px;padding:10px 14px;" +
      "background:rgba(255,255,255,.04);border-bottom:1px solid rgba(255,255,255,.06)}" +
      "#kaWbBar button{font:inherit;font-size:13px;font-weight:500;border:none;background:transparent;" +
      "color:rgba(255,255,255,.7);border-radius:10px;padding:8px 12px;cursor:pointer;" +
      "transition:background .15s,color .15s}" +
      "#kaWbBar button:hover{background:rgba(255,255,255,.08);color:#fff}" +
      "#kaWbBar button.is-on{background:rgba(255,255,255,.12);color:#fff}" +
      "#kaWbBar .ka-sep{width:1px;height:18px;background:rgba(255,255,255,.1);margin:0 4px;flex-shrink:0}" +
      "#kaWbColors{display:flex;gap:6px;align-items:center}" +
      "#kaWbColors button{width:20px;height:20px;border-radius:50%;padding:0;" +
      "border:2px solid transparent;box-shadow:inset 0 0 0 1px rgba(0,0,0,.2)}" +
      "#kaWbColors button.is-on{border-color:#fff;transform:scale(1.18)}" +
      "#kaWbSize{width:70px;height:3px;accent-color:#fff;cursor:pointer}" +
      "#kaWbFs{width:36px;height:36px;padding:0!important;display:grid;place-items:center;" +
      "border-radius:8px!important;flex-shrink:0}" +
      "#kaWbFs svg{width:16px;height:16px;pointer-events:none}" +
      "#kaWbBack{margin-left:auto!important;background:rgba(255,255,255,.1)!important;" +
      "color:#fff!important;border-radius:10px!important;padding:8px 14px!important}" +
      "#kaWbBack:hover{background:rgba(255,255,255,.18)!important}" +
      "#kaWbStage{flex:1 1 auto;position:relative;overflow:hidden;touch-action:none;" +
      "-webkit-user-select:none;user-select:none}" +
      "#kaWbCanvas{display:block;width:100%;height:100%;cursor:crosshair;" +
      "touch-action:none;-webkit-user-select:none;user-select:none}" +
      "@media(max-width:560px){" +
      "#kaWbFab{right:16px;bottom:18px;width:48px;height:48px}" +
      "#kaWbBar{padding:8px 10px;gap:4px;overflow-x:auto}" +
      "#kaWbBar button{padding:6px 10px;font-size:12px}" +
      "}";
    var s = document.createElement("style");
    s.id = "ka-wb-styles";
    s.textContent = css;
    document.head.appendChild(s);
  }

  /* Fullscreen iconlar — oddiy kvadrat SVG */
  var ICON_FS_ENTER =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/>' +
    '<path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/></svg>';
  var ICON_FS_EXIT =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M8 3v3a2 2 0 0 1-2 2H3"/><path d="M21 8h-3a2 2 0 0 1-2-2V3"/>' +
    '<path d="M3 16h3a2 2 0 0 1 2 2v3"/><path d="M16 21v-3a2 2 0 0 1 2-2h3"/></svg>';

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

    var colorHtml = "";
    for (var i = 0; i < COLORS.length; i++) {
      colorHtml +=
        '<button type="button" data-color="' +
        COLORS[i] +
        '" style="background:' +
        COLORS[i] +
        '"' +
        (i === 0 ? ' class="is-on"' : "") +
        "></button>";
    }

    var overlay = document.createElement("div");
    overlay.id = "kaWbOverlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-label", "Doska");
    overlay.innerHTML =
      '<div id="kaWbBar">' +
      '<button type="button" data-tool="pen" class="is-on">Chizish</button>' +
      '<button type="button" data-tool="eraser">O\'chirish</button>' +
      '<span class="ka-sep"></span>' +
      '<div id="kaWbColors">' +
      colorHtml +
      "</div>" +
      '<span class="ka-sep"></span>' +
      '<input type="range" id="kaWbSize" min="2" max="28" value="4" title="Qalinlik">' +
      '<span class="ka-sep"></span>' +
      '<button type="button" id="kaWbClear">Tozalash</button>' +
      '<button type="button" id="kaWbFs" title="Fullscreen" aria-label="Fullscreen">' +
      ICON_FS_ENTER +
      "</button>" +
      '<button type="button" id="kaWbBack">Yopish</button>' +
      "</div>" +
      '<div id="kaWbStage"><canvas id="kaWbCanvas"></canvas></div>';
    document.body.appendChild(overlay);

    return {
      fab: fab,
      overlay: overlay,
      canvas: overlay.querySelector("#kaWbCanvas"),
      stage: overlay.querySelector("#kaWbStage"),
      size: overlay.querySelector("#kaWbSize"),
      clearBtn: overlay.querySelector("#kaWbClear"),
      fsBtn: overlay.querySelector("#kaWbFs"),
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
    var ctx = canvas.getContext("2d", { alpha: false, desynchronized: true });

    /* --- chizish holati (DOM dan mustaqil) --- */
    var tool = "pen";
    var color = COLORS[0];
    var size = 4;
    var drawing = false;
    var lastX = 0;
    var lastY = 0;
    var rectLeft = 0;
    var rectTop = 0;
    var cssW = 0;
    var cssH = 0;
    var dpr = 1;
    var saveTimer = 0;

    function paintBg() {
      ctx.fillStyle = BG;
      ctx.fillRect(0, 0, cssW, cssH);
    }

    function resize() {
      var wrap = ui.stage;
      cssW = wrap.clientWidth;
      cssH = wrap.clientHeight;
      if (cssW < 1 || cssH < 1) return;

      /* eski rasmni saqlab qolish */
      var prev = null;
      if (canvas.width > 0) {
        try {
          prev = canvas.toDataURL("image/png");
        } catch (e) {}
      }

      dpr = window.devicePixelRatio || 1;
      canvas.width = (cssW * dpr) | 0;
      canvas.height = (cssH * dpr) | 0;
      canvas.style.width = cssW + "px";
      canvas.style.height = cssH + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      paintBg();

      if (prev) {
        var img = new Image();
        img.onload = function () {
          ctx.drawImage(img, 0, 0, cssW, cssH);
        };
        img.src = prev;
      } else {
        loadSaved();
      }
    }

    function cacheRect() {
      var r = canvas.getBoundingClientRect();
      rectLeft = r.left;
      rectTop = r.top;
    }

    function persistNow() {
      try {
        localStorage.setItem(storageKey(), canvas.toDataURL("image/png"));
      } catch (e) {}
    }

    /* Saqlashni kechiktirish — chizish paytida localStorage qotmasin */
    function persistLater() {
      if (saveTimer) clearTimeout(saveTimer);
      saveTimer = setTimeout(persistNow, 400);
    }

    function loadSaved() {
      try {
        var data = localStorage.getItem(storageKey());
        if (!data) return;
        var img = new Image();
        img.onload = function () {
          ctx.drawImage(img, 0, 0, cssW, cssH);
        };
        img.src = data;
      } catch (e) {}
    }

    /* --- silliq chiziq: faqat canvas, hech qanday DOM --- */
    function stroke(x0, y0, x1, y1) {
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
      ctx.stroke();
    }

    function pointerXY(e) {
      /* e.clientX/Y — pointer event yoki mouse/touch dan keladi */
      return {
        x: e.clientX - rectLeft,
        y: e.clientY - rectTop,
      };
    }

    function onDown(e) {
      if (e.button != null && e.button !== 0) return;
      e.preventDefault();
      cacheRect();
      drawing = true;
      var p = pointerXY(e);
      lastX = p.x;
      lastY = p.y;

      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      if (tool === "eraser") {
        ctx.strokeStyle = BG;
        ctx.lineWidth = size * 3;
      } else {
        ctx.strokeStyle = color;
        ctx.lineWidth = size;
      }
      /* nuqta uchun ham */
      stroke(p.x, p.y, p.x, p.y);

      if (canvas.setPointerCapture && e.pointerId != null) {
        try {
          canvas.setPointerCapture(e.pointerId);
        } catch (err) {}
      }
    }

    function onMove(e) {
      if (!drawing) return;
      e.preventDefault();
      var p = pointerXY(e);
      /* katta sakrashlarni silliqroq qilish: oraliq nuqta */
      var dx = p.x - lastX;
      var dy = p.y - lastY;
      if (dx * dx + dy * dy > 64) {
        var mx = (lastX + p.x) * 0.5;
        var my = (lastY + p.y) * 0.5;
        stroke(lastX, lastY, mx, my);
        stroke(mx, my, p.x, p.y);
      } else {
        stroke(lastX, lastY, p.x, p.y);
      }
      lastX = p.x;
      lastY = p.y;
    }

    function onUp(e) {
      if (!drawing) return;
      drawing = false;
      persistLater();
    }

    function clearBoard() {
      paintBg();
      persistNow();
    }

    /* --- Fullscreen --- */
    function isFs() {
      return !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.msFullscreenElement
      );
    }

    function updateFsIcon() {
      ui.fsBtn.innerHTML = isFs() ? ICON_FS_EXIT : ICON_FS_ENTER;
    }

    function toggleFs() {
      var el = ui.overlay;
      if (!isFs()) {
        var req =
          el.requestFullscreen ||
          el.webkitRequestFullscreen ||
          el.msRequestFullscreen;
        if (req) {
          Promise.resolve(req.call(el)).then(updateFsIcon).catch(function () {});
        }
      } else {
        var exit =
          document.exitFullscreen ||
          document.webkitExitFullscreen ||
          document.msExitFullscreen;
        if (exit) {
          Promise.resolve(exit.call(document)).then(updateFsIcon).catch(function () {});
        }
      }
    }

    function open() {
      ui.overlay.classList.add("is-open");
      requestAnimationFrame(function () {
        resize();
        cacheRect();
      });
    }

    function close() {
      if (isFs()) {
        var exit =
          document.exitFullscreen ||
          document.webkitExitFullscreen ||
          document.msExitFullscreen;
        if (exit) {
          try {
            exit.call(document);
          } catch (e) {}
        }
      }
      ui.overlay.classList.remove("is-open");
      persistNow();
    }

    /* --- eventlar --- */
    ui.fab.addEventListener("click", open);
    ui.backBtn.addEventListener("click", close);
    ui.clearBtn.addEventListener("click", clearBoard);
    ui.fsBtn.addEventListener("click", toggleFs);

    document.addEventListener("fullscreenchange", function () {
      updateFsIcon();
      if (ui.overlay.classList.contains("is-open")) {
        requestAnimationFrame(resize);
      }
    });
    document.addEventListener("webkitfullscreenchange", function () {
      updateFsIcon();
      if (ui.overlay.classList.contains("is-open")) {
        requestAnimationFrame(resize);
      }
    });

    ui.toolBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        tool = btn.getAttribute("data-tool");
        for (var i = 0; i < ui.toolBtns.length; i++) {
          ui.toolBtns[i].classList.toggle("is-on", ui.toolBtns[i] === btn);
        }
      });
    });

    ui.colorBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        color = btn.getAttribute("data-color");
        tool = "pen";
        for (var i = 0; i < ui.colorBtns.length; i++) {
          ui.colorBtns[i].classList.toggle("is-on", ui.colorBtns[i] === btn);
        }
        for (var j = 0; j < ui.toolBtns.length; j++) {
          ui.toolBtns[j].classList.toggle(
            "is-on",
            ui.toolBtns[j].getAttribute("data-tool") === "pen"
          );
        }
      });
    });

    ui.size.addEventListener("input", function () {
      size = parseInt(ui.size.value, 10) || 4;
    });

    /* Pointer Events — bitta API, mouse + touch + stilus */
    if (window.PointerEvent) {
      canvas.addEventListener("pointerdown", onDown);
      canvas.addEventListener("pointermove", onMove);
      canvas.addEventListener("pointerup", onUp);
      canvas.addEventListener("pointercancel", onUp);
    } else {
      canvas.addEventListener("mousedown", onDown);
      canvas.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
      canvas.addEventListener(
        "touchstart",
        function (e) {
          if (e.touches.length !== 1) return;
          var t = e.touches[0];
          onDown({
            clientX: t.clientX,
            clientY: t.clientY,
            preventDefault: function () {
              e.preventDefault();
            },
            button: 0,
          });
        },
        { passive: false }
      );
      canvas.addEventListener(
        "touchmove",
        function (e) {
          if (!drawing || e.touches.length !== 1) return;
          var t = e.touches[0];
          onMove({
            clientX: t.clientX,
            clientY: t.clientY,
            preventDefault: function () {
              e.preventDefault();
            },
          });
        },
        { passive: false }
      );
      canvas.addEventListener("touchend", onUp);
      canvas.addEventListener("touchcancel", onUp);
    }

    window.addEventListener("resize", function () {
      if (ui.overlay.classList.contains("is-open")) resize();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && ui.overlay.classList.contains("is-open") && !isFs()) {
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
