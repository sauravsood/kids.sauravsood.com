// Feedback bubble for sauravsood.com and every subdomain. One line per page:
//   <script src="https://kids.sauravsood.com/feedback/bubble.js" defer></script>
// Options as data attributes on that script tag:
//   data-corner="bottom-left"   bottom-right (default), bottom-left, top-right, top-left
//   data-color="#d8f03c"        bubble colour; data-ink="#142238" its icon colour
//   data-accent="#2f5f93"       colour of the Send button
//   data-size="44px"            bubble size (default 52px)
//   data-grownup                ask the grown-up sum first (kids site)
// The widget is our fork of Feedback Fin (Apache-2.0, see LICENSE.txt), which
// posts to /api/feedback on this same Worker.
(function () {
  "use strict";
  if (window.top !== window) return; // not inside embedded frames
  if (document.getElementById("feedbackfin__bubble") || window.__sauravFeedback) return;
  window.__sauravFeedback = true;

  const me = document.currentScript;
  const base = new URL(".", (me && me.src) || location.href);
  const d = (me && me.dataset) || {};
  const api = new URL("/api/feedback", base).href;

  const vars = [];
  if (d.color) vars.push(`--feedbackfin-bubble-bg:${d.color}`);
  if (d.ink) vars.push(`--feedbackfin-bubble-color:${d.ink}`);
  if (d.accent) vars.push(`--feedbackfin-primary-color:${d.accent}`, `--feedbackfin-focus-color:${d.accent}`);
  if (d.size) vars.push(`--feedbackfin-bubble-size:${d.size}`);
  if (d.opacity) vars.push(`--feedbackfin-bubble-opacity:${d.opacity}`);
  if (vars.length) {
    const s = document.createElement("style");
    s.textContent = `:root{${vars.join(";")}}`;
    document.head.appendChild(s);
  }

  const config = {
    url: api,
    user: { site: location.hostname },
    bubble: d.corner || true,
    bubbleLabel: "Send feedback",
    disableErrorAlert: true,
  };
  if ("grownup" in d) {
    config.bubbleLabel = "Feedback for grown-ups";
    config.beforeOpen = () =>
      typeof window.askGrownUp === "function"
        ? window.askGrownUp("Sending feedback is for grown-ups.", "Next")
        : Promise.resolve();
  }
  window.feedbackfin = { config };

  const s = document.createElement("script");
  s.src = new URL("feedbackfin.js?v=1", base).href;
  s.async = true;
  document.head.appendChild(s);
})();
