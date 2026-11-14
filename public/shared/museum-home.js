// Added to every page of the 3D Dino museum build (see scripts/build-dino.sh):
// a Home button back to kids.sauravsood.com, and the grown-up check on links
// that leave the site.
(function () {
  "use strict";
  const s = document.createElement("script");
  s.src = "/shared/grownup.js";
  document.head.appendChild(s);

  const style = document.createElement("style");
  style.textContent = `
    .kids-home { position: fixed; z-index: 2147483000; left: max(14px, env(safe-area-inset-left));
      bottom: calc(max(14px, env(safe-area-inset-bottom)) + 120px); width: 60px; height: 60px; border-radius: 50%;
      background: #fff; box-shadow: 0 4px 0 rgba(58,63,75,.15), 0 2px 12px rgba(0,0,0,.12);
      display: grid; place-items: center; -webkit-tap-highlight-color: transparent; }
    .kids-home svg { width: 28px; height: 28px; fill: none; stroke: #3a3f4b; stroke-width: 2.4;
      stroke-linecap: round; stroke-linejoin: round; }
    .kids-home:active { transform: translateY(2px); }`;
  document.head.appendChild(style);

  function add() {
    const a = document.createElement("a");
    a.className = "kids-home";
    a.href = "/";
    a.setAttribute("aria-label", "Home");
    a.innerHTML = '<svg viewBox="0 0 24 24"><path d="M3.5 11.5 L12 4 L20.5 11.5 M6 9.5 V20 H10 V14.5 H14 V20 H18 V9.5"/></svg>';
    document.body.appendChild(a);
  }
  if (document.body) add(); else addEventListener("DOMContentLoaded", add);
})();
