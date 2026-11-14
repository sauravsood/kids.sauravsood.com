// Calm-by-design rule: links that leave kids.sauravsood.com need a grown-up.
// Any tap on a link to another site opens a small check with a sum that a
// young child can't easily answer. Add to a page with:
//   <script src="/shared/grownup.js" defer></script>
(function () {
  "use strict";

  function css() {
    const s = document.createElement("style");
    s.textContent = `
      .gu { border: 0; border-radius: 28px; padding: 28px; max-width: min(420px, calc(100vw - 32px));
            background: #fff; color: #3a3f4b; box-shadow: 0 10px 40px rgba(58,63,75,.25);
            font-family: ui-rounded, "SF Pro Rounded", "Nunito", system-ui, -apple-system, sans-serif; }
      .gu::backdrop { background: rgba(58,63,75,.45); }
      .gu h2 { margin: 0 0 6px; font-size: 24px; }
      .gu p { margin: 0 0 16px; color: #7b8291; font-size: 16px; line-height: 1.4; word-break: break-word; }
      .gu label { display: block; font-size: 20px; font-weight: 800; margin-bottom: 10px; }
      .gu input { width: 100%; font: inherit; font-size: 24px; padding: 12px 16px; border-radius: 16px;
                  border: 2px solid #f1e6d6; box-sizing: border-box; -webkit-user-select: text; user-select: text; }
      .gu .row { display: flex; gap: 12px; justify-content: flex-end; margin-top: 18px; }
      .gu button { font: inherit; font-size: 18px; font-weight: 800; border: 0; border-radius: 999px;
                   padding: 14px 24px; min-height: 56px; cursor: pointer; }
      .gu .stay { background: #f1e6d6; color: #3a3f4b; }
      .gu .go2 { background: #3a3f4b; color: #fff; }
      .gu .bad { color: #d6455d; font-size: 15px; min-height: 20px; margin: 8px 0 0; }`;
    document.head.appendChild(s);
  }

  let dialog = null;
  function ask(url) {
    if (!dialog) {
      css();
      dialog = document.createElement("dialog");
      dialog.className = "gu";
      dialog.innerHTML = `
        <form method="dialog">
          <h2>Ask a grown-up</h2>
          <p>This goes to another website: <b class="host"></b></p>
          <label><span class="q"></span> = ?</label>
          <input class="a" inputmode="numeric" pattern="[0-9]*" autocomplete="off" aria-label="Answer">
          <p class="bad" aria-live="polite"></p>
          <div class="row">
            <button class="stay" value="stay" type="submit">Stay here</button>
            <button class="go2" value="go" type="submit">Go</button>
          </div>
        </form>`;
      document.body.appendChild(dialog);
    }
    const a = 12 + Math.floor(Math.random() * 30);
    const b = 11 + Math.floor(Math.random() * 30);
    dialog.querySelector(".host").textContent = url.hostname;
    dialog.querySelector(".q").textContent = `${a} + ${b}`;
    const input = dialog.querySelector(".a");
    const bad = dialog.querySelector(".bad");
    input.value = "";
    bad.textContent = "";
    const form = dialog.querySelector("form");
    form.onsubmit = (e) => {
      if (e.submitter && e.submitter.value === "go") {
        if (Number(input.value) === a + b) {
          dialog.close();
          location.href = url.href;
        } else {
          e.preventDefault();
          bad.textContent = "Not quite. Ask a grown-up to help.";
        }
      }
    };
    dialog.showModal();
  }

  document.addEventListener("click", (e) => {
    const link = e.target.closest && e.target.closest("a[href]");
    if (!link) return;
    let url;
    try { url = new URL(link.href, location.href); } catch { return; }
    if (!/^https?:$/.test(url.protocol) || url.origin === location.origin) return;
    e.preventDefault();
    ask(url);
  });
})();
