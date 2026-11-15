// Talking to the server, and keeping this device's drawings in step with
// the account. Drawings are always saved on the device first (local.js);
// pushDrawings sends what changed here, pullDrawings brings in what changed
// on other devices. Both stop quietly when there's no internet.

import { allDrawings, deleteDrawingRecord, dirtyDrawings, getDrawing, putDrawing } from "./local.js";

export class AuthError extends Error {}
export class OfflineError extends Error {}

export async function api(path, { method = "GET", data } = {}) {
  let res;
  try {
    res = await fetch(path, {
      method,
      credentials: "same-origin",
      cache: "no-store",
      headers: data ? { "Content-Type": "application/json" } : undefined,
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
        ({ stats } = await api(`/api/drawings/c/${record.cid}`, { method: "DELETE" }));
        const now = await getDrawing(record.cid);
        if (now && now.rev === record.rev) await deleteDrawingRecord(record.cid);
      } else {
        ({ stats } = await api(`/api/drawings/c/${record.cid}`, {
          method: "PUT",
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
  const { drawings: remote } = await api("/api/drawings?meta=1");
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
    const { drawings } = await api(`/api/drawings?ids=${ids.join(",")}`);
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
