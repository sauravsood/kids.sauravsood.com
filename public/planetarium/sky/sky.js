// Planetarium sky view, built on Stellarium Web Engine (AGPL-3.0).
// Source of the engine: https://github.com/sauravsood/stellarium-web-engine
/* global StelWebEngine */
(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const base = new URL("./", location.href).href;
  const data = base + "skydata/";
  const D2R = Math.PI / 180;

  // Names the engine knows for each "find" button.
  const TARGETS = {
    "Moon": ["NAME Moon"],
    "Jupiter": ["NAME Jupiter"],
    "Orion": ["CON western Ori", "NAME Orion"],
    "Big Dipper": ["CON western UMa", "NAME Ursa Major"],
  };

  // Rough spot on Earth from the device's time zone, so nobody has to share
  // their location. "Use where I am" swaps in the real one.
  function guessPlace() {
    const tz = (Intl.DateTimeFormat().resolvedOptions().timeZone || "");
    const known = {
      "Asia/Kolkata": [28.6, 77.2], "Asia/Calcutta": [28.6, 77.2],
      "America/New_York": [40.7, -74], "America/Los_Angeles": [37.8, -122.4],
      "America/Chicago": [41.9, -87.6], "Europe/London": [51.5, -0.1],
      "Australia/Sydney": [-33.9, 151.2], "Asia/Singapore": [1.3, 103.8],
      "Asia/Dubai": [25.2, 55.3], "Europe/Berlin": [52.5, 13.4],
    };
    if (known[tz]) return known[tz];
    const lon = -new Date().getTimezoneOffset() / 4; // 15° per hour
    return [tz.startsWith("Australia") || tz.startsWith("Pacific/Auckland") ? -35 : 35, lon];
  }

  // "Make it night": during the day, jump to 9 pm tonight so there's
  // something to see. Off = right now.
  function skyTime(night) {
    const d = new Date();
    if (night) {
      const h = d.getHours();
      if (h >= 6 && h < 19) d.setHours(21, 0, 0, 0);
    }
    return d;
  }

  let stel = null;

  function setPlace(lat, lon) {
    stel.core.observer.latitude = lat * D2R;
    stel.core.observer.longitude = lon * D2R;
  }

  function pressed(btn, on) {
    btn.setAttribute("aria-pressed", on ? "true" : "false");
  }

  function toggle(id, apply) {
    const btn = $(id);
    btn.addEventListener("click", () => {
      const on = btn.getAttribute("aria-pressed") !== "true";
      pressed(btn, on);
      apply(on);
    });
  }

  function find(name) {
    let obj = null;
    for (const id of TARGETS[name] || []) {
      obj = stel.getObj(id);
      if (obj) break;
    }
    if (!obj) return;
    stel.core.selection = obj;
    stel.pointAndLock(obj, 1.5);
    const isConstellation = name === "Orion" || name === "Big Dipper";
    stel.zoomTo((isConstellation ? 60 : 20) * D2R, 1.5);
    if (isConstellation) {
      pressed($("t-lines"), true);
      stel.core.constellations.lines_visible = true;
    }
    showPicked(name);
    if (window.gtag) gtag("event", "planetarium_find", { target: name });
  }

  let pickedTimer = 0;
  function showPicked(text) {
    const el = $("picked");
    el.textContent = text;
    el.hidden = !text;
    clearTimeout(pickedTimer);
    pickedTimer = setTimeout(() => { el.hidden = true; }, 5000);
  }

  function nameOf(obj) {
    try {
      const names = obj.designations();
      const nice = names.find((n) => n.startsWith("NAME ")) || names[0] || "";
      return nice.replace(/^NAME /, "").replace(/^CON western /, "");
    } catch { return ""; }
  }

  StelWebEngine({
    wasmFile: base + "engine/stellarium-web-engine.wasm",
    canvas: $("sky"),
    translateFn: (domain, str) => str,
    onReady(engine) {
      stel = engine;
      const core = stel.core;
      core.stars.addDataSource({ url: data + "stars" });
      core.skycultures.addDataSource({ url: data + "skycultures/western", key: "western" });
      core.dsos.addDataSource({ url: data + "dso" });
      core.landscapes.addDataSource({ url: data + "landscapes/guereins", key: "guereins" });
      core.milkyway.addDataSource({ url: data + "surveys/milkyway" });
      core.planets.addDataSource({ url: data + "surveys/sso/moon", key: "moon" });
      core.planets.addDataSource({ url: data + "surveys/sso/sun", key: "sun" });
      core.planets.addDataSource({ url: data + "surveys/sso/moon", key: "default" });
      stel.setFont("regular", base + "fonts/Roboto-Regular.ttf", 1.38);
      stel.setFont("bold", base + "fonts/Roboto-Bold.ttf", 1.38);

      const [lat, lon] = guessPlace();
      setPlace(lat, lon);
      core.observer.utc = stel.date2MJD(skyTime(true).getTime());
      core.constellations.show_only_pointed = false; // draw every constellation, not just the one in the middle
      core.constellations.lines_visible = true;
      core.constellations.labels_visible = true;
      core.constellations.images_visible = false;
      core.landscapes.visible = true;
      core.atmosphere.visible = true;
      core.planets.hints_visible = true;
      core.fov = 100 * D2R;

      // Start facing south (north for the southern half), a bit above the horizon.
      const az = (lat >= 0 ? 180 : 0) * D2R;
      const alt = 35 * D2R;
      stel.lookAt([Math.cos(alt) * Math.cos(az), Math.cos(alt) * Math.sin(az), Math.sin(alt)], 0);

      stel.change((obj, attr) => {
        if (attr === "selection" && core.selection) showPicked(nameOf(core.selection));
      });

      toggle("t-lines", (on) => { core.constellations.lines_visible = on; core.constellations.labels_visible = on; });
      toggle("t-art", (on) => { core.constellations.images_visible = on; });
      toggle("t-ground", (on) => { core.landscapes.visible = on; core.landscapes.fog_visible = on; });
      toggle("t-night", (on) => { core.observer.utc = stel.date2MJD(skyTime(on).getTime()); });
      $("t-here").addEventListener("click", () => {
        if (!navigator.geolocation) return;
        navigator.geolocation.getCurrentPosition(
          (pos) => { setPlace(pos.coords.latitude, pos.coords.longitude); pressed($("t-here"), true); },
          () => pressed($("t-here"), false),
          { maximumAge: 3600e3, timeout: 15e3 },
        );
      });
      for (const btn of document.querySelectorAll("[data-find]")) {
        btn.addEventListener("click", () => find(btn.dataset.find));
      }
      setTimeout(() => $("loading").classList.add("done"), 400);
    },
  });

})();
