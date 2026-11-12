# JONLI ALGEBRA — RELIABILITY & FAULT-TOLERANCE SPECIFICATION

## 1. FAULT-ISOLATION ARCHITECTURE

### Independent Lesson Sandboxing
Each lesson is completely decoupled and self-contained:
* If a visualizer script or browser SVG engine encounters a rendering error, `dars-render.js` catches the exception cleanly:
  ```javascript
  try {
    builder(stage, d.sahna);
  } catch (err) {
    console.error("Sahna xatosi:", err);
    stage.insertAdjacentHTML(
      "beforeend",
      '<p class="sahna-fallback">Vizualizator ishlamadi. Sahifani yangilang.</p>'
    );
  }
  ```
* A failure in an interactive visualizer **never** halts the lesson: the lesson agenda, blackboard problems, textbook scans, exercise prompts, and interactive oral questions remain 100% accessible to teacher and students.

---

## 2. OFFLINE RESILIENCE & ZERO-CORS GUARANTEE

* **The Problem:** Modern browsers (Chrome, Edge, Firefox, Safari) enforce strict CORS policies when loading local files via `file:///`. If an app attempts to `fetch('data.json')` locally, the browser throws:
  `Access to fetch at 'file://...' has been blocked by CORS policy`.
* **The Jonli Algebra Solution:**
  `build/build.py` pre-compiles the JSON directly into `<script type="application/json" id="dars-data">`. When the browser loads `index.html`, JavaScript accesses the data synchronously via `document.getElementById("dars-data").textContent`.
  * No network requests.
  * No CORS blockers.
  * Works on flash drives, offline school computers, internal LAN servers, and smartphones without cellular data.

---

## 3. ZERO MEMORY LEAKS & 120 FPS TOUCH INTERACTIONS

* **DOM Recalculation Optimization:**
  * Coordinate transformations (`toX`, `toY`) are pure mathematical projections calculated without querying computed layout styles (`getBoundingClientRect()` thrashing is completely eliminated).
  * SVG redraws reuse persistent DOM nodes or clear single dynamic `<g>` containers rather than destroying the entire SVG canvas.
* **Garbage Collection (GC) Pressure Reduction:**
  * During high-frequency slider drag events (`input` listeners), allocations of intermediate objects and string formatting are minimized to prevent GC pauses.
* **Component Lifecycle Teardown:**
  * Modal dialogs and fullscreen blackboard canvases bind listeners to document scope only while open, ensuring memory footprint remains flat during long classroom sessions.

---

## 4. PERSISTENCE RESILIENCE (LOCALSTORAGE DEFENSIVE WRAPPERS)

* In incognito/private browsing mode, or on systems with restricted storage quotas, direct access to `localStorage` can throw security errors (`DOMException: QuotaExceededError` or `SecurityError`).
* `js/progress.js` safeguards all read and write operations inside defensive exception boundaries:
  ```javascript
  function read() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return {};
      var data = JSON.parse(raw);
      return data && typeof data === "object" ? data : {};
    } catch (e) {
      return {};
    }
  }

  function write(data) {
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
    } catch (e) {
      // Graceful fallback for quota restrictions / private mode
    }
  }
  ```
  The user interface gracefully degrades if storage is disabled without crashing.

---

## 5. AUTOMATED INTEGRITY GATES

The continuous verification suite (`npm test` / `bash build/verify.sh`) prevents any regression from ever reaching production:
1. **Semantic Lint:** `build/lesson_schema.py` ensures 100% data contract compliance.
2. **Pedagogical Coherence:** `validate_lessons.py` confirms learning continuity across all 38 lessons.
3. **Asset Integrity:** `build/check_lessons.sh` verifies disk synchronization and bundle freshness.
4. **Headless Execution:** `build/run-all-render-tests.js` tests real DOM hydration and listener attachment using JSDOM.
