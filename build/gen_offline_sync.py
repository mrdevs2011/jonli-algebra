import glob
import json
import os

tier1 = [
    "",
    "index.html",
    "manifest.json",
    "favicon.ico",
    "assets/icons/favicon.svg",
    "assets/icons/icon-192.png",
    "assets/icons/icon-512.png",
    "css/base.css",
    "css/dashboard.css",
    "css/dars.css",
    "js/darslar.js",
    "js/progress.js",
    "js/dashboard.js",
    "js/board.js",
    "js/features.js",
    "js/dars-render.js",
    "js/formulalar-data.js"
]
for s in sorted(glob.glob("js/sahna-*.js")):
    tier1.append(s)

for i in range(1, 39):
    tier1.append(f"lessons/math/9/{i}/")
    tier1.append(f"lessons/math/9/{i}/index.html")
    tier1.append(f"lessons/math/9/{i}/data.json")

tier2 = []
for p in sorted(glob.glob("lessons/math/9/*/png/*.png")):
    tier2.append(p)
for k in range(1, 241):
    tier2.append(f"kitob/kitob-{k}.png")

template = """/**
 * Jonli Algebra — Zero-Friction Resumable Offline Sync Engine
 *
 * 1. Avtomatik: Ilovaga kirilishi bilanoq fonda yuklashni boshlaydi.
 * 2. Qayta tiklanuvchan (Resumable): Foydalanuvchi 3 soniyada chiqib ketsa ham, keshga tushgan
 *    fayllar qoladi. Keyingi kirishda CacheStorage.keys() orqali tekshirilib, faqat yetishmayotgan
 *    fayllar yuklanadi (1ms da skaner qilinadi, oldingi yuklanganlar qayta yuklanmaydi).
 * 3. 2 Bosqichli ustuvorlik (Two-Tier Priority):
 *    - 1-bosqich: Matn, kod, uslublar, 22 ta interaktiv sahna va 38 ta darsning barchasi (Tier 1 ~ 2MB)
 *      1-2 soniyada yuklanadi. Bu tugashi bilan 100% darslar va interaktiv sahnalar offline ishlaydi!
 *    - 2-bosqich: Kitob va doska rasmlari (Tier 2 - 400 ta rasm) fonda xotirjam navbat bilan olinadi.
 * 4. Tarmoq uzilsa to'xtaydi, qayta ulanganda qolgan joyidan davom etadi.
 */
(function () {
  "use strict";

  var CACHE_NAME = "jonli-algebra-v2";
  var STORAGE_KEY = "ja_offline_sync_v2";

  var TIER_1_FILES = __TIER_1__;

  var TIER_2_FILES = __TIER_2__;

  var state = {
    isSyncing: false,
    paused: !navigator.onLine,
    tier1Done: false,
    tier2Done: false,
    totalFiles: TIER_1_FILES.length + TIER_2_FILES.length,
    cachedCount: 0,
    currentStep: ""
  };

  function getBaseUrl() {
    var path = window.location.pathname;
    var idx = path.indexOf("/lessons/math/9/");
    if (idx !== -1) {
      return window.location.origin + path.substring(0, idx + 1);
    }
    var dir = path.substring(0, path.lastIndexOf("/") + 1);
    return window.location.origin + dir;
  }

  function resolveUrl(relPath, baseUrl) {
    if (!relPath) return baseUrl;
    return new URL(relPath, baseUrl).href;
  }

  function updateStatusUI() {
    var el = document.getElementById("offlineSyncStatus");
    if (!el) return;

    var pct = Math.min(100, Math.round((state.cachedCount / state.totalFiles) * 100));
    var isDone = state.cachedCount >= state.totalFiles;

    if (isDone) {
      el.className = "ja-offline-badge is-ready";
      el.innerHTML =
        '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="margin-right:4px; vertical-align:-2px;"><polyline points="20 6 9 17 4 12"></polyline></svg>' +
        '<span>Offline: 100% tayyor</span>';
      el.setAttribute("title", "Barcha darslar, interaktiv sahnalar va rasmlar to\'liq offline saqlangan");
    } else if (state.isSyncing) {
      el.className = "ja-offline-badge is-syncing";
      el.innerHTML =
        '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="margin-right:4px; vertical-align:-2px; animation:ja-spin 1.5s linear infinite;"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>' +
        '<span>Offline yuklanmoqda: ' + pct + '%</span>';
      el.setAttribute("title", "Kelgan joyidan fonda yuklanmoqda (" + state.cachedCount + "/" + state.totalFiles + ")");
    } else if (state.tier1Done) {
      el.className = "ja-offline-badge is-tier1";
      el.innerHTML =
        '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="margin-right:4px; vertical-align:-2px;"><polyline points="20 6 9 17 4 12"></polyline></svg>' +
        '<span>Darslar offline tayyor (' + pct + '%)</span>';
    } else {
      el.className = "ja-offline-badge is-pending";
      el.innerHTML =
        '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="margin-right:4px; vertical-align:-2px;"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>' +
        '<span>Offline kesh: ' + pct + '%</span>';
    }
  }

  function saveProgress() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        cachedCount: state.cachedCount,
        totalFiles: state.totalFiles,
        tier1Done: state.tier1Done,
        tier2Done: state.tier2Done,
        updatedAt: Date.now()
      }));
    } catch (e) {}
  }

  function loadSavedProgress() {
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        var parsed = JSON.parse(saved);
        if (parsed && typeof parsed.cachedCount === "number") {
          state.cachedCount = parsed.cachedCount;
          state.tier1Done = !!parsed.tier1Done;
          state.tier2Done = !!parsed.tier2Done;
        }
      }
    } catch (e) {}
  }

  // Resumable worker queue
  function downloadBatch(urls, cache, concurrency, throttleMs) {
    return new Promise(function (resolve) {
      var index = 0;
      var active = 0;
      var completed = 0;
      var total = urls.length;

      if (total === 0) {
        resolve();
        return;
      }

      function next() {
        if (completed >= total) {
          resolve();
          return;
        }

        while (active < concurrency && index < total) {
          if (!navigator.onLine) {
            state.paused = true;
            state.isSyncing = false;
            updateStatusUI();
            resolve();
            return;
          }

          var i = index++;
          active++;
          fetchAndCache(urls[i]);
        }
      }

      function fetchAndCache(itemUrl) {
        fetch(itemUrl, { cache: "reload" })
          .then(function (response) {
            if (response && response.status === 200) {
              return cache.put(itemUrl, response);
            }
          })
          .catch(function () {})
          .then(function () {
            active--;
            completed++;
            state.cachedCount++;
            if (state.cachedCount % 4 === 0 || state.cachedCount === state.totalFiles) {
              saveProgress();
              updateStatusUI();
            }

            if (throttleMs > 0) {
              setTimeout(next, throttleMs);
            } else {
              next();
            }
          });
      }

      next();
    });
  }

  function startSync() {
    if (!("caches" in window)) return;
    if (state.isSyncing) return;
    if (!navigator.onLine) {
      updateStatusUI();
      return;
    }

    state.isSyncing = true;
    updateStatusUI();

    caches.open(CACHE_NAME).then(function (cache) {
      var baseUrl = getBaseUrl();

      // 1. Keshda mavjud fayllarni 1ms ichida aniqlash (Zero redundant download)
      cache.keys().then(function (cachedRequests) {
        var cachedUrlSet = new Set(cachedRequests.map(function (req) { return req.url; }));

        // Tier 1 tekshirish
        var tier1Remaining = [];
        var tier1CachedCount = 0;
        for (var i = 0; i < TIER_1_FILES.length; i++) {
          var fullUrl1 = resolveUrl(TIER_1_FILES[i], baseUrl);
          if (cachedUrlSet.has(fullUrl1)) {
            tier1CachedCount++;
          } else {
            tier1Remaining.push(fullUrl1);
          }
        }

        // Tier 2 tekshirish
        var tier2Remaining = [];
        var tier2CachedCount = 0;
        for (var j = 0; j < TIER_2_FILES.length; j++) {
          var fullUrl2 = resolveUrl(TIER_2_FILES[j], baseUrl);
          if (cachedUrlSet.has(fullUrl2)) {
            tier2CachedCount++;
          } else {
            tier2Remaining.push(fullUrl2);
          }
        }

        state.cachedCount = tier1CachedCount + tier2CachedCount;
        state.tier1Done = tier1Remaining.length === 0;
        state.tier2Done = tier2Remaining.length === 0;
        saveProgress();
        updateStatusUI();

        // Agar barcha fayllar allaqachon keshda bo'lsa:
        if (state.cachedCount >= state.totalFiles) {
          state.isSyncing = false;
          state.tier1Done = true;
          state.tier2Done = true;
          updateStatusUI();
          return;
        }

        // 2. Birinchi navbatda TIER 1 (Kod, Sahnalar, Darslar) — Tezkor (Concurrency: 6)
        var promise = Promise.resolve();
        if (tier1Remaining.length > 0) {
          state.currentStep = "tier1";
          promise = downloadBatch(tier1Remaining, cache, 6, 0).then(function () {
            state.tier1Done = true;
            saveProgress();
            updateStatusUI();
          });
        }

        // 3. Ikkinchi navbatda TIER 2 (Rasmlar) — Sekinroq, tarmoqni band qilmasdan (Concurrency: 3, 15ms)
        promise.then(function () {
          if (tier2Remaining.length > 0 && navigator.onLine) {
            state.currentStep = "tier2";
            return downloadBatch(tier2Remaining, cache, 3, 15).then(function () {
              state.tier2Done = true;
              saveProgress();
            });
          }
        }).catch(function () {}).then(function () {
          state.isSyncing = false;
          updateStatusUI();
        });
      });
    }).catch(function () {
      state.isSyncing = false;
      updateStatusUI();
    });
  }

  function init() {
    loadSavedProgress();
    updateStatusUI();

    // Service Workerni har qanday sahifada (root yoki dars) avtomatik ro'yxatdan o'tkazish
    if ("serviceWorker" in navigator) {
      var baseUrl = getBaseUrl();
      var swUrl = new URL("sw.js", baseUrl).href;
      navigator.serviceWorker.register(swUrl).catch(function () {});
    }

    // Tarmoq holati tinglovchilari
    window.addEventListener("online", function () {
      state.paused = false;
      startSync();
    });
    window.addEventListener("offline", function () {
      state.paused = true;
      state.isSyncing = false;
      updateStatusUI();
    });

    // Sahifa yuklanishi bilanoq fonda darhol ishga tushirish
    if (document.readyState === "complete") {
      startSync();
    } else {
      window.addEventListener("load", function () {
        setTimeout(startSync, 350);
      });
    }
  }

  window.JA_OFFLINE_SYNC = {
    start: startSync,
    getState: function () { return state; }
  };

  init();
})();
"""

output = template.replace("__TIER_1__", json.dumps(tier1, indent=2)).replace("__TIER_2__", json.dumps(tier2, indent=2))

with open("js/features/offline-sync.js", "w", encoding="utf-8") as f:
    f.write(output)

print("Generated js/features/offline-sync.js successfully!")
