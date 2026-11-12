/**
 * Jonli Algebra — Gamifikatsiya va O'quvchi Motivatsiyasi (Duolingo-Style Retention)
 * XP (Tajriba ballari), Kunlik ketma-ketlik (Streak) va Virtual nishonlar (Badges).
 */
(function () {
  "use strict";

  var XP_KEY = "ja_xp";
  var STREAK_KEY = "ja_streak";
  var LAST_DATE_KEY = "ja_last_active_date";
  var BADGES_KEY = "ja_badges";

  var BADGES = {
    "bob-1": {
      id: "bob-1",
      title: "Parabola va Funksiyalar Ustasi",
      desc: "I bobni muvaffaqiyatli yakunlagan va kvadrat funksiyalarni to'liq o'zlashtirgan o'quvchi.",
      icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>'
    },
    "bob-2": {
      id: "bob-2",
      title: "Tenglamalar Tizimi Grossmeysteri",
      desc: "II bobni tugatib, chiziqli va kvadrat tenglamalar sistemalarini mohirona yechgan o'quvchi.",
      icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>'
    },
    "bob-3": {
      id: "bob-3",
      title: "Trigonometriya Dahosi",
      desc: "III bob bo'yicha barcha trigonometrik ayniyatlar va keltirish formulalarini zabt etgan bilimdon.",
      icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M12 3v9l6 3"></path></svg>'
    },
    "bob-4": {
      id: "bob-4",
      title: "Progressiyalar Sehrgari",
      desc: "IV bobning arifmetik va geometrik zanjirlarini hamda cheksiz yig'indilarni hisoblagan mutaxassis.",
      icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>'
    },
    "bob-5": {
      id: "bob-5",
      title: "Ehtimollik va Ma'lumotlar Mutaxassisi",
      desc: "V bob bo'yicha hodisalar ehtimolligi va statistik qonuniyatlarni mukammal tahlil qilgan o'quvchi.",
      icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><circle cx="15.5" cy="15.5" r="1.5"></circle><circle cx="8.5" cy="15.5" r="1.5"></circle><circle cx="15.5" cy="8.5" r="1.5"></circle><circle cx="12" cy="12" r="1.5"></circle></svg>'
    },
    "lyceum-grandprix": {
      id: "lyceum-grandprix",
      title: "Litseyga 100% Tayyor Gran-pri",
      desc: "Westminster, Prezident va Aniq fanlar litseylariga kirish uchun barcha nostandart masalalarni zabt etgan apex o'quvchi!",
      icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.45 1-1 1H7"></path><path d="M14 14.66V17c0 .55.45 1 1 1h2"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path></svg>'
    }
  };

  function getXp() {
    try {
      return parseInt(localStorage.getItem(XP_KEY) || "0", 10);
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

  function addXp(amount) {
    var cur = getXp();
    var next = cur + amount;
    try {
      localStorage.setItem(XP_KEY, String(next));
    } catch (e) {}
    recordActivity();
    updateHUD();
    return next;
  }

  function getTodayStr() {
    var d = new Date();
    var year = d.getFullYear();
    var month = String(d.getMonth() + 1).padStart(2, "0");
    var day = String(d.getDate()).padStart(2, "0");
    return year + "-" + month + "-" + day;
  }

  function getStreak() {
    try {
      return parseInt(localStorage.getItem(STREAK_KEY) || "1", 10);
    } catch (e) {
      return 1;
    }
  }

  function recordActivity() {
    var today = getTodayStr();
    var lastDate = "";
    try {
      lastDate = localStorage.getItem(LAST_DATE_KEY) || "";
    } catch (e) {}

    if (lastDate === today) {
      return; // Already recorded today
    }

    var streak = getStreak();
    if (lastDate) {
      var last = new Date(lastDate);
      var cur = new Date(today);
      var diffDays = Math.round((cur.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        streak++;
      } else if (diffDays > 1) {
        streak = 1;
      }
    } else {
      streak = 1;
    }

    try {
      localStorage.setItem(STREAK_KEY, String(streak));
      localStorage.setItem(LAST_DATE_KEY, today);
    } catch (e) {}

    updateHUD();
  }

  function getBadges() {
    try {
      var raw = localStorage.getItem(BADGES_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function hasBadge(badgeId) {
    var badges = getBadges();
    return badges.indexOf(badgeId) !== -1;
  }

  function unlockBadge(badgeId) {
    if (!BADGES[badgeId]) return false;
    var list = getBadges();
    if (list.indexOf(badgeId) === -1) {
      list.push(badgeId);
      try {
        localStorage.setItem(BADGES_KEY, JSON.stringify(list));
      } catch (e) {}
      if (window.JA_SOUND && window.JA_SOUND.playFanfare) {
        window.JA_SOUND.playFanfare();
      }
      showBadgeToast(BADGES[badgeId]);
      updateHUD();
      return true;
    }
    return false;
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

    // Update XP elements
    document.querySelectorAll(".hud-xp-val").forEach(function (el) {
      el.textContent = xp;
    });

    // Update Level elements
    document.querySelectorAll(".hud-level-val").forEach(function (el) {
      el.textContent = lvl.lvl + "-daraja (" + lvl.nom + ")";
    });

    // Update Streak elements
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
    BADGES: BADGES,
    updateHUD: updateHUD
  };
})();
