// Talking to the server, and keeping this device's drawings in step with
// the account. Drawings are always saved on the device first (local.js);
// pushDrawings sends what changed here, pullDrawings brings in what changed
// on other devices. Both stop quietly when there's no internet.

import { allDrawings, allMine, deleteDrawingRecord, dirtyDrawings, getDrawing, getMine, putDrawing, putMine } from "./local.js";

export class AuthError extends Error {}
export class OfflineError extends Error {}

// The day on this device, "2026-11-27". Time spent is counted by local day,
// so "today" starts at midnight here (as Screen Time and Family Link do).
export function localDay(at = Date.now()) {
  const d = new Date(at);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// `kid`: the child (account id) this request is for. Sent as X-Kid so a
// sync that started before someone switched kids still goes to the right one.
export async function api(path, { method = "GET", data, kid } = {}) {
  const headers = { "X-Day": localDay() };
  if (data) headers["Content-Type"] = "application/json";
  if (kid && /^\d+$/.test(kid)) headers["X-Kid"] = kid;
  let res;
  try {
    res = await fetch(path, {
      method,
      credentials: "same-origin",
      cache: "no-store",
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });
  } catch {
    throw new OfflineError("No internet");
  }
  if (res.status === 401) throw new AuthError("Signed out");
  const body = await res.json().catch(() => null);
  // A captive portal or an offline page from the service worker isn't JSON.
  if (body === null && res.status >= 500) throw new OfflineError("Server unreachable");
  if (!res.ok) {
    const err = new Error((body && body.error) || `Request failed (${res.status})`);
    err.status = res.status;
    throw err;
  }
  return body || {};
}

// Sends every change made on this device. Returns the latest stats, or null
// if there was nothing to send.
export async function pushDrawings(owner) {
  let stats = null;
  for (const record of await dirtyDrawings(owner)) {
    try {
      if (record.deleted) {
        // Always ask the server too: a send may have been on its way when it was deleted.
        ({ stats } = await api(`/api/drawings/c/${record.cid}`, { method: "DELETE", kid: owner }));
        const now = await getDrawing(record.cid);
        if (now && now.rev === record.rev) await deleteDrawingRecord(record.cid);
      } else {
        ({ stats } = await api(`/api/drawings/c/${record.cid}`, {
          method: "PUT",
          kid: owner,
          data: {
            animal: record.animal,
            strokes: record.strokes,
            thumb: record.thumb,
            seconds: record.seconds,
            createdAt: record.createdAt,
            updatedAt: record.updatedAt,
          },
        }));
        const now = await getDrawing(record.cid);
        if (now) await putDrawing({ ...now, onServer: true, dirty: now.rev === record.rev ? 0 : 1 });
      }
    } catch (err) {
      if (err instanceof AuthError || err instanceof OfflineError) throw err;
      // The server refused this one (too big, say). Keep it here and carry on.
      console.error("Couldn't sync drawing", record.cid, err);
    }
  }
  return stats;
}

// Brings this device up to date with the account. Returns true if anything
// here changed.
export async function pullDrawings(owner) {
  const { drawings: remote } = await api("/api/drawings?meta=1", { kid: owner });
  const remoteById = new Map(remote.map((d) => [d.clientId, d]));
  const locals = new Map((await allDrawings(owner)).map((r) => [r.cid, r]));
  let changed = false;

  // Deleted on another device (and not changed here since).
  for (const record of locals.values()) {
    if (record.onServer && !record.dirty && !remoteById.has(record.cid)) {
      await deleteDrawingRecord(record.cid);
      changed = true;
    }
  }

  const wanted = remote
    .filter((d) => {
      const mine = locals.get(d.clientId);
      return !mine || (!mine.dirty && d.updatedAt > mine.updatedAt);
    })
    .map((d) => d.clientId);

  for (let i = 0; i < wanted.length; i += 10) {
    const ids = wanted.slice(i, i + 10);
    const { drawings } = await api(`/api/drawings?ids=${ids.join(",")}`, { kid: owner });
    for (const d of drawings) {
      const now = await getDrawing(d.clientId);
      if (now && now.dirty) continue; // changed here while downloading: ours wins
      await putDrawing({
        cid: d.clientId,
        owner,
        animal: d.animal,
        strokes: d.strokes,
        thumb: d.thumb,
        seconds: d.seconds,
        createdAt: d.createdAt,
        updatedAt: d.updatedAt,
        rev: (now?.rev || 0) + 1,
        dirty: 0,
        deleted: false,
        onServer: true,
      });
      changed = true;
    }
  }
  return changed;
}

// ---------- My Animals ----------

// Outlines go into the page as SVG, so only plain paths made by photo.js are
// accepted (the server checks the same).
const SHAPE_RE = /^<path (class="line" )?d="[MQLZ0-9 -]{3,20000}"\/>$/;
const PHOTO_RE = /^data:image\/jpeg;base64,[A-Za-z0-9+/=]{100,60000}$/;
export function validMine(d) {
  return Array.isArray(d.shapes) && d.shapes.length > 0 && d.shapes.length <= 40
    && d.shapes.every((s) => typeof s === "string" && SHAPE_RE.test(s))
    && (d.photo == null || PHOTO_RE.test(d.photo))
    && /^#[0-9a-f]{6}$/.test(d.tint || "");
}

// Sends new, changed or removed My Animals. Removing only hides one.
export async function pushMine(owner) {
  for (const record of (await allMine(owner)).filter((r) => r.dirty)) {
    try {
      await api(`/api/mine/${record.cid}`, {
        method: "PUT",
        kid: owner,
        data: {
          shapes: record.shapes,
          photo: record.photo,
          tint: record.tint,
          hidden: !!record.hidden,
          createdAt: record.createdAt,
          updatedAt: record.updatedAt,
        },
      });
      const now = await getMine(record.cid);
      if (now) await putMine({ ...now, onServer: true, dirty: now.rev === record.rev ? 0 : 1 });
    } catch (err) {
      if (err instanceof AuthError || err instanceof OfflineError) throw err;
      console.error("Couldn't sync my animal", record.cid, err);
    }
  }
}

// Brings in My Animals made or changed on other devices. True if any changed.
export async function pullMine(owner) {
  const { animals: remote } = await api("/api/mine?meta=1", { kid: owner });
  const locals = new Map((await allMine(owner)).map((r) => [r.cid, r]));
  const wanted = remote
    .filter((d) => {
      const mine = locals.get(d.id);
      return !mine || (!mine.dirty && d.updatedAt > mine.updatedAt);
    })
    .map((d) => d.id);
  let changed = false;
  for (let i = 0; i < wanted.length; i += 10) {
    const { animals } = await api(`/api/mine?ids=${wanted.slice(i, i + 10).join(",")}`, { kid: owner });
    for (const d of animals) {
      if (!validMine(d)) continue;
      const now = await getMine(d.id);
      if (now && now.dirty) continue; // changed here meanwhile: ours wins
      await putMine({
        cid: d.id,
        owner,
        shapes: d.shapes,
        photo: d.photo,
        tint: d.tint,
        hidden: !!d.hidden,
        createdAt: d.createdAt,
        updatedAt: d.updatedAt,
        rev: (now?.rev || 0) + 1,
        dirty: 0,
        onServer: true,
      });
      changed = true;
    }
  }
  return changed;
}
