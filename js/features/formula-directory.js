/**
 * Jonli Algebra — Interaktiv Matematik Ontologiya va Formulalar Katalogi
 * Section IV: 60+ algebra formulalari, noaniq qidiruv va dars sahnasiga to'g'ridan-to'g'ri deep-linking.
 */
(function () {
  "use strict";

  // Formulalar va ularning parametrli deep-link xaritasi
  var PARAM_MAP = {
    "f-1": { lesson: 1, params: { a: 1, b: -2, c: -3 } },
    "f-2": { lesson: 2, params: { a: 1 } },
    "f-3": { lesson: 3, params: { a: 2 } },
    "f-4": { lesson: 4, params: { a: 1, b: -4, c: 3 } },
    "f-5": { lesson: 4, params: { a: 1, b: -4, c: 3 } },
    "f-6": { lesson: 5, params: { a: 1, p: 2, q: -1 } },
    "f-17": { lesson: 17, params: { t: 45 } },
    "f-18": { lesson: 18, params: { t: 60 } },
    "f-19": { lesson: 19, params: { t: 120 } },
    "f-24": { lesson: 24, params: { a: 30, b: 45 } },
    "f-25": { lesson: 25, params: { a: 30 } },
    "f-29": { lesson: 29, params: { a1: 2, d: 3 } },
    "f-31": { lesson: 31, params: { b1: 3, q: 2 } },
    "f-35": { lesson: 35, params: { n: 10, m: 3 } }
  };

  function getDeepLinkUrl(formula) {
    if (!formula) return "#";
    if (formula.bob === 0 || formula.lessonLink === "#poydevor" || formula.lessonLink === "#bob-poydevor") {
      return "#bob-poydevor";
    }
    var base = formula.lessonLink || ("lessons/math/9/" + formula.lessonId + "/");
    var mapping = PARAM_MAP[formula.id];
    if (mapping && mapping.params) {
      var query = Object.keys(mapping.params).map(function (k) {
        return encodeURIComponent(k) + "=" + encodeURIComponent(mapping.params[k]);
      }).join("&");
      return base + "?" + query + "#sahna";
    }
    return base + "#sahna";
  }

  function searchFormulas(query, bobFilter) {
    var list = window.JA_FORMULALAR || [];
    var q = (query || "").toLowerCase().trim();
    var b = bobFilter === undefined || bobFilter === null ? "all" : String(bobFilter);

    return list.filter(function (f) {
      var matchBob = b === "all" || String(f.bob) === b;
      if (!matchBob) return false;
      if (!q) return true;

      return (
        (f.title && f.title.toLowerCase().indexOf(q) !== -1) ||
        (f.formula && f.formula.toLowerCase().indexOf(q) !== -1) ||
        (f.desc && f.desc.toLowerCase().indexOf(q) !== -1) ||
        (f.bobNom && f.bobNom.toLowerCase().indexOf(q) !== -1)
      );
    });
  }

  window.JA_FORMULA_DIRECTORY = {
    getDeepLinkUrl: getDeepLinkUrl,
    searchFormulas: searchFormulas,
    PARAM_MAP: PARAM_MAP
  };
})();
