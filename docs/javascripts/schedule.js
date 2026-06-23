/* Two-week onboarding schedule: live editing, per-browser autosave, print, reset. */
(function () {
  var STORAGE_PREFIX = "mh-schedule:v2:";

  function initSchedule() {
    var grid = document.querySelector("[data-schedule]");
    if (!grid || grid.dataset.bound === "1") return;
    grid.dataset.bound = "1";

    var root = grid.parentNode;
    var cells = grid.querySelectorAll("[data-key]");
    var statusEl = root.querySelector("[data-status]");
    var statusTimer;

    function setStatus(msg) {
      if (!statusEl) return;
      statusEl.textContent = msg;
      clearTimeout(statusTimer);
      statusTimer = setTimeout(function () { statusEl.textContent = ""; }, 2000);
    }

    // Restore any edits previously saved in this browser.
    cells.forEach(function (cell) {
      var saved = localStorage.getItem(STORAGE_PREFIX + cell.dataset.key);
      if (saved !== null) cell.innerHTML = saved;
    });

    // Autosave (debounced) as the user types.
    var timers = {};
    cells.forEach(function (cell) {
      cell.addEventListener("input", function () {
        var key = cell.dataset.key;
        clearTimeout(timers[key]);
        timers[key] = setTimeout(function () {
          localStorage.setItem(STORAGE_PREFIX + key, cell.innerHTML);
          setStatus("Saved to this browser");
        }, 400);
      });
    });

    var printBtn = root.querySelector("[data-print]");
    if (printBtn) printBtn.addEventListener("click", function () { window.print(); });

    var resetBtn = root.querySelector("[data-reset]");
    if (resetBtn) resetBtn.addEventListener("click", function () {
      if (!window.confirm("Clear the edits saved in this browser and restore the published schedule?")) return;
      cells.forEach(function (cell) { localStorage.removeItem(STORAGE_PREFIX + cell.dataset.key); });
      window.location.reload();
    });
  }

  // Material for MkDocs uses instant navigation; document$ fires on every page.
  if (window.document$ && typeof window.document$.subscribe === "function") {
    window.document$.subscribe(initSchedule);
  } else if (document.readyState !== "loading") {
    initSchedule();
  } else {
    document.addEventListener("DOMContentLoaded", initSchedule);
  }
})();
