/**
 * Jonli Algebra — Gamifikatsiya va O'quvchi Motivatsiyasi (Duolingo-Style Retention)
 * Kinetic floating XP particles, Circadian streak engine, SVG Metallic Badge Foundry.
 */
(function () {
  "use strict";

  var BADGES = {
    "badge-parabola-master": {
      id: "badge-parabola-master",
      title: "Parabola va Funksiyalar Ustasi",
      desc: "I bobni 100% muvaffaqiyatli yakunlagan va kvadrat funksiyalarni to'liq o'zlashtirgan o'quvchi.",
      icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>'
    },
    "badge-systems-virtuoso": {
      id: "badge-systems-virtuoso",
      title: "Tizimlar va Tengsizliklar Grossmeysteri",
      desc: "II bobni tugatib, chiziqli va kvadrat tenglamalar sistemalarini mohirona yechgan o'quvchi.",
      icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>'
    },
    "badge-trig-luminary": {
      id: "badge-trig-luminary",
      title: "Trigonometriya Dahosi",
      desc: "III bob bo'yicha barcha trigonometrik ayniyatlar va keltirish formulalarini zabt etgan bilimdon.",
      icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M12 3v9l6 3"></path></svg>'
    },
    "badge-progression-wizard": {
      id: "badge-progression-wizard",
      title: "Progressiyalar Sehrgari",
      desc: "IV bobning arifmetik va geometrik zanjirlarini hamda cheksiz yig'indilarni hisoblagan mutaxassis.",
      icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>'
    },
    "badge-probability-analyst": {
      id: "badge-probability-analyst",
      title: "Ehtimollik va Statistika Tahlilchisi",
      desc: "V bob bo'yicha hodisalar ehtimolligi va statistik qonuniyatlarni mukammal tahlil qilgan o'quvchi.",
      icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><circle cx="15.5" cy="15.5" r="1.5"></circle><circle cx="8.5" cy="15.5" r="1.5"></circle><circle cx="15.5" cy="8.5" r="1.5"></circle><circle cx="12" cy="12" r="1.5"></circle></svg>'
    },
    "badge-lyceum-grandmaster": {
      id: "badge-lyceum-grandmaster",
      title: "Litseyga 100% Tayyor Gran-pri",
      desc: "Westminster, Prezident va Aniq fanlar litseylariga kirish uchun barcha 38 ta olimpiada masalasini zabt etgan o'quvchi!",
      icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.45 1-1 1H7"></path><path d="M14 14.66V17c0 .55.45 1 1 1h2"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path></svg>'
    }
  };

  // Legacy ID mapping
  var BADGE_ALIASES = {
    "bob-1": "badge-parabola-master",
    "bob-2": "badge-systems-virtuoso",
    "bob-3": "badge-trig-luminary",
    "bob-4": "badge-progression-wizard",
    "bob-5": "badge-probability-analyst",
    "lyceum-grandprix": "badge-lyceum-grandmaster"
  };

  function getXp() {
    if (window.JA_STATE) {
      return window.JA_STATE.get().gamification.totalXp;
    }
    try {
      return parseInt(localStorage.getItem("ja_xp") || "0", 10);
    } catch (e) {
      return 0;
    }
  }

  function getLevel(xp) {
    if (xp >= 1000) return { lvl: 5, nom: "Algebra Grossmeysteri", next: 1500, min: 1000 };
    if (xp >= 600) return { lvl: 4, nom: "Litsey Aspiranti", next: 1000, min: 600 };
    if (xp >= 300) return { lvl: 3, nom: "Teorema Bilimdoni", next: 600, min: 300 };
    if (xp >= 100) return { lvl: 2, nom: "Izlanuvchan Matematik", next: 300, min: 100 };
    return { lvl: 1, nom: "Boshlang'ich Algebrachi", next: 100, min: 0 };
  }

  function addXp(amount, sourceElement) {
    var cur = getXp();
    var next = cur + amount;

    if (window.JA_STATE) {
      window.JA_STATE.update(function (st) {
        st.gamification.totalXp = next;
      });
    } else {
      try { localStorage.setItem("ja_xp", String(next)); } catch (e) {}
    }

    recordActivity();
    if (sourceElement) {
      spawnFloatingXpParticle(sourceElement, amount);
    }
    animateHUDCount(cur, next);
    return next;
  }

  // 2.1. Kinetic Floating XP Micro-Interactions
  function spawnFloatingXpParticle(el, amount) {
    if (!el || !el.getBoundingClientRect) return;
    var rect = el.getBoundingClientRect();
    var particle = document.createElement("div");
    particle.className = "floating-xp-particle";
    particle.textContent = "+" + amount + " XP";

    particle.style.left = (rect.left + rect.width / 2) + "px";
    particle.style.top = (rect.top + window.scrollY - 10) + "px";

    document.body.appendChild(particle);

    setTimeout(function () {
      if (particle.parentElement) {
        particle.parentElement.removeChild(particle);
      }
    }, 950);
  }

  function animateHUDCount(startVal, endVal) {
    var xpElements = document.querySelectorAll(".hud-xp-val");
    if (xpElements.length === 0) return;

    var duration = 400;
    var startTime = performance.now();

    function frame(now) {
      var progress = Math.min((now - startTime) / duration, 1);
      var current = Math.round(startVal + (endVal - startVal) * progress);
      xpElements.forEach(function (el) {
        el.textContent = current;
      });
      if (progress < 1) {
        requestAnimationFrame(frame);
      }
    }
    requestAnimationFrame(frame);
  }

  function getTodayStr() {
    var d = new Date();
    var year = d.getFullYear();
    var month = String(d.getMonth() + 1).padStart(2, "0");
    var day = String(d.getDate()).padStart(2, "0");
    return year + "-" + month + "-" + day;
  }

  function getStreak() {
    if (window.JA_STATE) {
      return window.JA_STATE.get().gamification.currentStreak;
    }
    try {
      return parseInt(localStorage.getItem("ja_streak") || "1", 10);
    } catch (e) {
      return 1;
    }
  }

  // 2.2. Algorithmic Daily Streak Calculation (Circadian Sync)
  function recordActivity() {
    var today = getTodayStr();

    if (window.JA_STATE) {
      window.JA_STATE.update(function (st) {
        var lastDate = st.gamification.lastActiveDate;
        if (lastDate === today) return;

        if (lastDate) {
          var last = new Date(lastDate);
          var cur = new Date(today);
          var diffDays = Math.round((cur.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
          if (diffDays === 1) {
            st.gamification.currentStreak++;
          } else if (diffDays > 1) {
            st.gamification.currentStreak = 1;
          }
        } else {
          st.gamification.currentStreak = 1;
        }

        st.gamification.lastActiveDate = today;
        if (st.gamification.streakHistory.indexOf(today) === -1) {
          st.gamification.streakHistory.push(today);
        }
      });
    } else {
      var lastDate = "";
      try { lastDate = localStorage.getItem("ja_last_active_date") || ""; } catch (e) {}
      if (lastDate === today) return;

      var streak = getStreak();
      if (lastDate) {
        var last = new Date(lastDate);
        var cur = new Date(today);
        var diffDays = Math.round((cur.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) streak++;
        else if (diffDays > 1) streak = 1;
      } else {
        streak = 1;
      }
      try {
        localStorage.setItem("ja_streak", String(streak));
        localStorage.setItem("ja_last_active_date", today);
      } catch (e) {}
    }

    updateHUD();
  }

  function getBadges() {
    if (window.JA_STATE) {
      return window.JA_STATE.get().gamification.earnedBadges.map(function (b) { return b.id; });
    }
    try {
      var raw = localStorage.getItem("ja_badges");
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function hasBadge(badgeId) {
    var realId = BADGE_ALIASES[badgeId] || badgeId;
    var list = getBadges();
    return list.indexOf(realId) !== -1 || list.indexOf(badgeId) !== -1;
  }

  // 2.3. Vector Badge Foundry
  function unlockBadge(badgeId) {
    var realId = BADGE_ALIASES[badgeId] || badgeId;
    var badgeObj = BADGES[realId];
    if (!badgeObj) return false;

    if (hasBadge(realId)) return false;

    if (window.JA_STATE) {
      window.JA_STATE.update(function (st) {
        st.gamification.earnedBadges.push({ id: realId, unlockedAt: Date.now() });
      });
    } else {
      var list = getBadges();
      list.push(realId);
      try { localStorage.setItem("ja_badges", JSON.stringify(list)); } catch (e) {}
    }

    if (window.JA_SOUND && window.JA_SOUND.playFanfare) {
      window.JA_SOUND.playFanfare();
    }

    showBadgeToast(badgeObj);
    updateHUD();
    return true;
  }

  function showBadgeToast(badge) {
    var toast = document.createElement("div");
    toast.className = "badge-unlock-toast";
    toast.innerHTML =
      '<div class="badge-toast-icon">' + badge.icon + '</div>' +
      '<div class="badge-toast-text">' +
        '<div class="badge-toast-sub">Yangi nishon ochildi!</div>' +
        '<strong class="badge-toast-title">' + badge.title + '</strong>' +
      '</div>';
    document.body.appendChild(toast);
    setTimeout(function () {
      toast.classList.add("is-visible");
    }, 50);
    setTimeout(function () {
      toast.classList.remove("is-visible");
      setTimeout(function () {
        if (toast.parentElement) toast.parentElement.removeChild(toast);
      }, 400);
    }, 4500);
  }

  function updateHUD() {
    var xp = getXp();
    var lvl = getLevel(xp);
    var streak = getStreak();

    document.querySelectorAll(".hud-xp-val").forEach(function (el) {
      el.textContent = xp;
    });
    document.querySelectorAll(".hud-level-val").forEach(function (el) {
      el.textContent = lvl.lvl + "-daraja (" + lvl.nom + ")";
    });
    document.querySelectorAll(".hud-streak-val").forEach(function (el) {
      el.textContent = streak;
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    updateHUD();
  });

  window.JA_GAMIFICATION = {
    getXp: getXp,
    getLevel: getLevel,
    addXp: addXp,
    getStreak: getStreak,
    recordActivity: recordActivity,
    getBadges: getBadges,
    hasBadge: hasBadge,
    unlockBadge: unlockBadge,
    spawnFloatingXpParticle: spawnFloatingXpParticle,
    BADGES: BADGES,
    BADGE_ALIASES: BADGE_ALIASES,
    updateHUD: updateHUD
  };
})();
