/*
 * Makes Mermaid diagrams larger and interactive.
 * - drag to pan, scroll/pinch to zoom, +/- and reset controls
 * - a "Fullscreen" button to view a diagram at full screen size
 * Works with Material's instant navigation and light/dark toggle, both of
 * which re-render the diagrams, by re-wrapping any fresh, un-enhanced SVG.
 */
(function () {
  var instances = [];

  function fitAll() {
    instances.forEach(function (pz) {
      try { pz.resize(); pz.fit(); pz.center(); } catch (e) {}
    });
  }

  // A diagram is "fresh" if Material produced a direct-child <svg> that we
  // have not yet moved into our own zoom viewport.
  function enhance(el) {
    var svg = el.querySelector(":scope > svg");
    if (!svg) return false;            // not rendered by Mermaid yet
    if (svg.closest(".mermaid-zoom-viewport")) return true; // already done

    // Toolbar
    var bar = document.createElement("div");
    bar.className = "mermaid-zoom-bar";

    var hint = document.createElement("span");
    hint.className = "mermaid-zoom-hint";
    hint.textContent = "Scroll to zoom · drag to pan";
    bar.appendChild(hint);

    var actions = document.createElement("span");
    actions.className = "mermaid-zoom-actions";

    var resetBtn = document.createElement("button");
    resetBtn.type = "button";
    resetBtn.textContent = "Reset";

    var fsBtn = document.createElement("button");
    fsBtn.type = "button";
    fsBtn.textContent = "Fullscreen";

    actions.appendChild(resetBtn);
    actions.appendChild(fsBtn);
    bar.appendChild(actions);

    // Viewport that the SVG pans/zooms inside of
    var box = document.createElement("div");
    box.className = "mermaid-zoom-viewport";

    el.insertBefore(bar, svg);
    box.appendChild(svg);
    el.appendChild(box);

    svg.style.maxWidth = "none";
    svg.style.width = "100%";
    svg.style.height = "100%";

    var pz = svgPanZoom(svg, {
      zoomEnabled: true,
      panEnabled: true,
      controlIconsEnabled: true,
      dblClickZoomEnabled: true,
      mouseWheelZoomEnabled: true,
      fit: true,
      center: true,
      minZoom: 0.3,
      maxZoom: 25,
      zoomScaleSensitivity: 0.4
    });
    instances.push(pz);

    resetBtn.addEventListener("click", function () {
      pz.resetZoom(); pz.fit(); pz.center();
    });
    fsBtn.addEventListener("click", function () {
      if (document.fullscreenElement === box) {
        document.exitFullscreen();
      } else if (box.requestFullscreen) {
        box.requestFullscreen();
      }
    });
    return true;
  }

  function run() {
    if (typeof svgPanZoom === "undefined") { setTimeout(run, 200); return; }
    document.querySelectorAll(".mermaid").forEach(function (el) {
      if (enhance(el)) return;
      // Mermaid renders asynchronously; poll briefly until the SVG appears.
      var tries = 0;
      var iv = setInterval(function () {
        if (enhance(el) || ++tries > 60) clearInterval(iv);
      }, 150);
    });
  }

  // Re-fit on fullscreen enter/exit and on window resize.
  document.addEventListener("fullscreenchange", function () {
    setTimeout(fitAll, 100);
  });
  window.addEventListener("resize", function () {
    setTimeout(fitAll, 150);
  });
  // Light/dark toggle re-renders Mermaid; re-enhance the new SVGs.
  document.addEventListener("change", function (e) {
    if (e.target && e.target.name === "__palette") {
      instances = [];
      setTimeout(run, 400);
    }
  });

  // document$ (Material instant navigation) fires on every page load.
  if (typeof document$ !== "undefined" && document$.subscribe) {
    document$.subscribe(run);
  } else if (document.readyState !== "loading") {
    run();
  } else {
    document.addEventListener("DOMContentLoaded", run);
  }
})();
