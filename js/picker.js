/* Jonli Algebra — Doskaga kim chiqadi? (tasodifiy o'quvchi tanlash)
   Barcha darslarda bir xil ishlaydi: har bir dars sahifasida
   #pickerSpinBtn / #pickerName va h.k. ID'lari bo'lsa, avtomatik ulanadi.
   Ismlar ro'yxati localStorage'da saqlanadi — bir marta kiritilsa,
   barcha darslar orasida umumiy bo'lib qoladi. */
(function () {
  document.addEventListener("DOMContentLoaded", function () {
    var displayEl = document.getElementById("pickerDisplay");
    var nameEl = document.getElementById("pickerName");
    var spinBtn = document.getElementById("pickerSpinBtn");
    var listBtn = document.getElementById("pickerListBtn");
    var namesPanel = document.getElementById("pickerNamesPanel");
    var namesInput = document.getElementById("pickerNamesInput");
    var namesSave = document.getElementById("pickerNamesSave");
    var noRepeatBox = document.getElementById("pickerNoRepeat");
    if (!spinBtn || !nameEl) return;

    var STORE_KEY = "ka-sinf-royxati";
    var USED_KEY = "ka-sinf-royxati-used";
    var DEFAULT_NAMES = [
      "Abduhalilova Shukrona",
      "Abdurahimova Zulayho",
      "Ahmadilyev Muhammadrizo",
      "Ahmadjonov Abdulloh",
      "Ahmadzulunov Abdunazar",
      "Alixonova Muqaddasxon",
      "Ashurboyev Saydjalol",
      "Bahodirjonova Sojida",
      "Begijonova Robiya",
      "Ibragimova Shoxsanam",
      "Ma'rufjonov Nabijon",
      "Madaminxojayeva Munisa",
      "Muxtorjonova Oydinoy",
      "Nizomov Muhammadaziz",
      "O'ktamova Shirinoy",
      "Odiljonov Ubaydulloh",
      "Qobiljonova Mohlaroy",
      "Qodirjonov Muhammadali",
      "Qosimov Muhammadrasul",
      "Rafuqjonov Abdulboriy",
      "Rafuqjonov Abdurahmon",
      "Sobirov Muhammadsodiq",
      "Tolqinboyev Abdulloh",
      "Tolqinboyeva Oisha",
      "Ubaydullayev Muhammadyusuf",
      "Yoqubjonov Mominjon",
      "Ziyohiddinova Oisha"
    ];
    var names = [];
    var used = [];
    var spinning = false;

    function loadNames() {
      try {
        var raw = localStorage.getItem(STORE_KEY);
        names = raw ? JSON.parse(raw) : DEFAULT_NAMES.slice();
        if (!raw) { try { localStorage.setItem(STORE_KEY, JSON.stringify(names)); } catch (e) {} }
      } catch (e) { names = DEFAULT_NAMES.slice(); }
      try {
        var rawUsed = sessionStorage.getItem(USED_KEY);
        used = rawUsed ? JSON.parse(rawUsed) : [];
      } catch (e) { used = []; }
      namesInput.value = names.join("\n");
    }

    function saveNames() {
      names = namesInput.value
        .split("\n")
        .map(function (s) { return s.trim(); })
        .filter(Boolean);
      try { localStorage.setItem(STORE_KEY, JSON.stringify(names)); } catch (e) {}
      used = [];
      try { sessionStorage.setItem(USED_KEY, JSON.stringify(used)); } catch (e) {}
    }

    function pickPool() {
      if (!noRepeatBox.checked) return names;
      var pool = names.filter(function (n) { return used.indexOf(n) === -1; });
      if (pool.length === 0) {
        used = []; // hammasi chiqdi — aylanadan qayta boshlaymiz
        pool = names;
      }
      return pool;
    }

    function beep(freq, dur) {
      try {
        var Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return;
        if (!beep.ctx) beep.ctx = new Ctx();
        var ctx = beep.ctx;
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();
        osc.type = "square";
        osc.frequency.value = freq;
        gain.gain.value = 0.05;
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
        osc.connect(gain).connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + dur);
      } catch (e) {}
      if (navigator.vibrate) navigator.vibrate(8);
    }

    function spin() {
      if (spinning) return;
      if (names.length === 0) {
        nameEl.textContent = "Avval ismlarni kiriting";
        namesPanel.hidden = false;
        return;
      }
      spinning = true;
      spinBtn.disabled = true;
      nameEl.classList.add("is-spinning");

      var pool = pickPool();
      var finalName = pool[Math.floor(Math.random() * pool.length)];

      // Ease-out sekinlashish + o'rtada bitta "fake-out" sakrash —
      // bir ismda to'xtayotgandek bo'lib, birdan boshqasiga otilib ketadi.
      var baseDelay = 45;
      var totalTicks = 22 + Math.floor(Math.random() * 5);
      var fakeOutAt = totalTicks - (3 + Math.floor(Math.random() * 2)); // oxiridan 3-4 tik oldin
      var tick = 0;

      function step() {
        var randomName;
        if (tick === totalTicks) {
          randomName = finalName;
        } else if (tick === fakeOutAt) {
          // "to'xtayotgandek" bo'lib, tasodifan boshqa ismga sakraydi
          var others = names.filter(function (n) { return n !== finalName; });
          randomName = others.length ? others[Math.floor(Math.random() * others.length)] : finalName;
        } else {
          randomName = names[Math.floor(Math.random() * names.length)];
        }
        nameEl.textContent = randomName;

        var progress = tick / totalTicks;
        var delay;
        if (tick < fakeOutAt - 2) {
          // 1: asta-sekin sekinlashish (ease-out)
          delay = baseDelay * Math.pow(1.14, tick);
        } else if (tick < fakeOutAt) {
          // sekinlashish avjida — "hozir to'xtaydi" hissi
          delay = baseDelay * Math.pow(1.14, fakeOutAt - 2) * 1.6;
        } else if (tick === fakeOutAt) {
          // 2: fake-out — birdan tezlashib sakraydi
          beep(320, 0.05);
          delay = baseDelay * 0.7;
        } else {
          // sakragandan keyin yana ease-out bilan yakuniy to'xtash
          var afterFake = tick - fakeOutAt;
          delay = baseDelay * 1.3 * Math.pow(1.35, afterFake);
        }

        beep(tick === totalTicks ? 520 : 260 + progress * 120, tick === totalTicks ? 0.12 : 0.03);

        if (tick >= totalTicks) {
          nameEl.classList.remove("is-spinning");
          nameEl.classList.add("is-landed");
          window.setTimeout(function () { nameEl.classList.remove("is-landed"); }, 380);
          if (noRepeatBox.checked) {
            used.push(finalName);
            try { sessionStorage.setItem(USED_KEY, JSON.stringify(used)); } catch (e) {}
          }
          spinning = false;
          spinBtn.disabled = false;
          return;
        }
        tick++;
        window.setTimeout(step, delay);
      }

      step();
    }

    spinBtn.addEventListener("click", spin);
    listBtn.addEventListener("click", function () {
      namesPanel.hidden = !namesPanel.hidden;
    });
    namesSave.addEventListener("click", function () {
      saveNames();
      namesPanel.hidden = true;
      nameEl.textContent = "Tayyor";
    });

    loadNames();
  });
})();
