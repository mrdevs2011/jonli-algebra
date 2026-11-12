/**
 * Jonli Algebra — Web Audio API Tovush Sintezatori (0 KB audio fayl)
 * Tashqi fayllarsiz toza chastotali sintez: To'g'ri (Chime), Xato (Thud), G'alaba (Fanfare).
 */
(function () {
  "use strict";

  var SOUND_KEY = "ja_sound";
  var ctx = null;

  function getAudioContext() {
    if (!ctx) {
      var AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        ctx = new AudioCtx();
      }
    }
    if (ctx && ctx.state === "suspended") {
      ctx.resume().catch(function () {});
    }
    return ctx;
  }

  function isMuted() {
    try {
      return localStorage.getItem(SOUND_KEY) === "off";
    } catch (e) {
      return false;
    }
  }

  function setMuted(muted) {
    try {
      localStorage.setItem(SOUND_KEY, muted ? "off" : "on");
    } catch (e) {}
    updateSoundButtons();
  }

  function toggleMute() {
    setMuted(!isMuted());
  }

  function updateSoundButtons() {
    var muted = isMuted();
    document.querySelectorAll(".sound-toggle-btn").forEach(function (btn) {
      btn.setAttribute("aria-label", muted ? "Tovushni yoqish" : "Tovushni o'chirish");
      btn.title = muted ? "Tovush o'chirilgan" : "Tovush yoqilgan";
      var icon = btn.querySelector(".sound-icon");
      if (icon) {
        if (muted) {
          // Volume-x SVG
          icon.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>';
        } else {
          // Volume-2 SVG
          icon.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>';
        }
      }
    });
  }

  // To'g'ri javob uchun: Mayin uch ovozli akkord (C5, E5, G5)
  function playCorrect() {
    if (isMuted()) return;
    var ac = getAudioContext();
    if (!ac) return;

    var notes = [523.25, 659.25, 783.99]; // C5, E5, G5
    var now = ac.currentTime;

    notes.forEach(function (freq, i) {
      var osc = ac.createOscillator();
      var gain = ac.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + i * 0.06);

      gain.gain.setValueAtTime(0.001, now + i * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.18, now + i * 0.06 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.06 + 0.55);

      osc.connect(gain);
      gain.connect(ac.destination);

      osc.start(now + i * 0.06);
      osc.stop(now + i * 0.06 + 0.6);
    });
  }

  // Xato javob uchun: Yumshoq past chastotali tebranish
  function playError() {
    if (isMuted()) return;
    var ac = getAudioContext();
    if (!ac) return;

    var now = ac.currentTime;
    var osc = ac.createOscillator();
    var gain = ac.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.28);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.32);

    osc.connect(gain);
    gain.connect(ac.destination);

    osc.start(now);
    osc.stop(now + 0.35);
  }

  // G'alaba tantanasi (Fanfare)
  function playFanfare() {
    if (isMuted()) return;
    var ac = getAudioContext();
    if (!ac) return;

    var melody = [
      { f: 523.25, t: 0.0, d: 0.12 }, // C5
      { f: 659.25, t: 0.14, d: 0.12 }, // E5
      { f: 783.99, t: 0.28, d: 0.14 }, // G5
      { f: 1046.50, t: 0.44, d: 0.45 } // C6
    ];

    var now = ac.currentTime;
    melody.forEach(function (note) {
      var osc = ac.createOscillator();
      var gain = ac.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(note.f, now + note.t);

      gain.gain.setValueAtTime(0.001, now + note.t);
      gain.gain.exponentialRampToValueAtTime(0.22, now + note.t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + note.t + note.d);

      osc.connect(gain);
      gain.connect(ac.destination);

      osc.start(now + note.t);
      osc.stop(now + note.t + note.d + 0.05);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    updateSoundButtons();
    document.querySelectorAll(".sound-toggle-btn").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        // User gesture unlocks audio context on mobile
        getAudioContext();
        toggleMute();
      });
    });
  });

  window.JA_SOUND = {
    playCorrect: playCorrect,
    playError: playError,
    playFanfare: playFanfare,
    isMuted: isMuted,
    setMuted: setMuted,
    toggleMute: toggleMute
  };
})();
