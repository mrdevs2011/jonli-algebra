/**
 * sahna-system-methods.js — 14-dars: bir sistema, uch usul
 * method: 0=grafik, 1=almashtirish, 2=qo‘shish
 */
(function () {
  "use strict";

  function init(container, cfg) {
    var vars = cfg.vars || {};
    var methodVar = vars.method || { value: 0, min: 0, max: 2, step: 1 };
    var current = methodVar.value || 0;

    var root = document.createElement("div");
    root.className = "sahna-system-methods";
    root.style.cssText = "display:flex;flex-direction:column;gap:12px;padding:8px;";

    // Method buttons
    var btns = document.createElement("div");
    btns.style.cssText = "display:flex;gap:8px;flex-wrap:wrap;";
    var labels = ["Grafik usul", "Almashtirish", "Qo‘shish"];
    labels.forEach(function (lab, i) {
      var b = document.createElement("button");
      b.textContent = lab;
      b.type = "button";
      b.style.cssText = "padding:6px 12px;border-radius:8px;border:1px solid #ccc;cursor:pointer;background:#f5f5f5;";
      if (i === current) b.style.background = "#e0f2fe";
      b.onclick = function () {
        current = i;
        update();
        Array.from(btns.children).forEach(function (c, j) {
          c.style.background = j === current ? "#e0f2fe" : "#f5f5f5";
        });
      };
      btns.appendChild(b);
    });
    root.appendChild(btns);

    // Content area
    var content = document.createElement("div");
    content.style.cssText = "min-height:220px;border:1px solid #e5e7eb;border-radius:12px;padding:12px;background:#fff;";
    root.appendChild(content);

    // Note
    var note = document.createElement("div");
    note.className = "sahna-note";
    note.style.cssText = "font-size:14px;color:#374151;";
    root.appendChild(note);

    function update() {
      var notes = cfg.notes || {};
      if (current === 0) {
        content.innerHTML = '<svg width="320" height="220" viewBox="0 0 320 220">' +
          '<line x1="20" y1="110" x2="300" y2="110" stroke="#94a3b8" stroke-width="1"/>' +
          '<line x1="160" y1="20" x2="160" y2="200" stroke="#94a3b8" stroke-width="1"/>' +
          '<line x1="40" y1="170" x2="280" y2="50" stroke="#2563eb" stroke-width="2"/>' +
          '<line x1="40" y1="50" x2="280" y2="170" stroke="#dc2626" stroke-width="2"/>' +
          '<circle cx="160" cy="110" r="6" fill="#16a34a"/>' +
          '<text x="170" y="105" font-size="12" fill="#16a34a">(2;3)</text>' +
          '</svg>' +
          '<p style="margin:8px 0 0;font-size:13px;">y = x + 1 va y = −x + 5 kesishadi: <strong>(2; 3)</strong></p>';
        note.textContent = notes.graph || "Grafik usul: kesishish nuqtasi yechim.";
      } else if (current === 1) {
        content.innerHTML = '<div style="font-family:monospace;font-size:14px;line-height:1.6;">' +
          '<div>{ y = x + 1</div><div>&nbsp;&nbsp;y = −x + 5 }</div>' +
          '<div style="margin-top:8px;">x + 1 = −x + 5</div>' +
          '<div>2x = 4</div>' +
          '<div><strong>x = 2</strong></div>' +
          '<div>y = 2 + 1 = <strong>3</strong></div>' +
          '</div>';
        note.textContent = notes.subst || "Almashtirish: birini ifodalab qo‘yamiz.";
      } else {
        content.innerHTML = '<div style="font-family:monospace;font-size:14px;line-height:1.6;">' +
          '<div>{ x + y = 5</div><div>&nbsp;&nbsp;x − y = 1 }</div>' +
          '<div style="margin-top:8px;">(x + y) + (x − y) = 5 + 1</div>' +
          '<div>2x = 6</div>' +
          '<div><strong>x = 3</strong></div>' +
          '<div>3 + y = 5 → <strong>y = 2</strong></div>' +
          '</div>';
        note.textContent = notes.add || "Qo‘shish: o‘zgaruvchini yo‘qotamiz.";
      }
    }

    update();
    container.appendChild(root);
  }

  window.KA_SAHNA = window.KA_SAHNA || {};
  // dars-render.js builder(stage, cfg) deb chaqiradi — funksiya bo'lishi shart
  window.KA_SAHNA["system-methods"] = function (stage, cfg) {
    init(stage, cfg || {});
  };
})();
