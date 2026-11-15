// Drawings kept on this device (IndexedDB), so Trace works without the
// internet. sync.js sends them to the account when it's back.
//
// A record: { cid, owner, animal, strokes, thumb, seconds, createdAt,
//   updatedAt, rev, dirty, deleted, onServer }
//   cid      id made on the device ("s<n>" for drawings from before)
//   owner    account id, so two grown-ups on one iPad never see each other's
//   rev      goes up on every local change, so sync knows if it changed mid-send
//   dirty    1 while the change still has to be sent
//   deleted  true = deleted here, waiting to be deleted on the server
//   onServer true once the server has it

const DB_NAME = "trace";
const STORE = "drawings";

let dbPromise = null;
let memory = null; // used if IndexedDB can't be opened (some private modes)

function openDb(name, onReady) {
  return new Promise((resolve) => {
    let req;
    try {
      req = indexedDB.open(name, 1);
    } catch {
      resolve(null);
      return;
    }
    req.onupgradeneeded = () => {
      const store = req.result.createObjectStore(STORE, { keyPath: "cid" });
      store.createIndex("owner", "owner");
      store.createIndex("dirty", "dirty");
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => resolve(null);
    req.onblocked = () => resolve(null);
  }).then((db) => { onReady(db); return db; });
}

function open() {
  dbPromise ??= openDb(DB_NAME, (db) => { if (!db) memory = new Map(); });
  return dbPromise;
}

// My Animals: outlines made from the child's own photos (photo.js), in a
// database of their own so the drawings database never needs an upgrade.
// A record: { cid, owner, shapes, photo, tint, createdAt, updatedAt, rev,
//   dirty, hidden, onServer }. cid is also the animal id ("my" + letters).
// Removing one only hides it, so drawings of it still open from History.
let mineDbPromise = null;
let memoryMine = null;
function openMine() {
  mineDbPromise ??= openDb("trace-mine", (db) => { if (!db) memoryMine = new Map(); });
  return mineDbPromise;
}

function run(mode, fn, opener = open) {
  return opener().then((db) => {
    if (!db) return fn(null);
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, mode);
      const result = fn(tx.objectStore(STORE));
      tx.oncomplete = () => resolve(result && "result" in result ? result.result : result);
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
  });
}

export async function getDrawing(cid) {
  const found = await run("readonly", (store) => (store ? store.get(cid) : memory.get(cid)));
  return found || null;
}

export async function allDrawings(owner) {
  const list = await run("readonly", (store) =>
    store ? store.index("owner").getAll(owner) : [...memory.values()].filter((r) => r.owner === owner));
  return list || [];
}

// Only the ones still waiting to be sent (cheap to check often).
export async function dirtyDrawings(owner) {
  const list = await run("readonly", (store) =>
    store ? store.index("dirty").getAll(1) : [...memory.values()].filter((r) => r.dirty === 1));
  return (list || []).filter((r) => r.owner === owner);
}

// How many drawings this account has on this device (not counting deleted ones).
export async function countDrawings(owner) {
  const total = await run("readonly", (store) =>
    store ? store.index("owner").count(owner) : [...memory.values()].filter((r) => r.owner === owner).length);
  const deleted = (await dirtyDrawings(owner)).filter((r) => r.deleted).length;
  return (total || 0) - deleted;
}

export function putDrawing(record) {
  return run("readwrite", (store) => {
    if (store) store.put(record);
    else memory.set(record.cid, structuredClone(record));
  });
}

export function deleteDrawingRecord(cid) {
  return run("readwrite", (store) => {
    if (store) store.delete(cid);
    else memory.delete(cid);
  });
}

// ---------- My Animals ----------

export async function allMine(owner) {
  const list = await run("readonly", (store) =>
    store ? store.index("owner").getAll(owner) : [...memoryMine.values()].filter((r) => r.owner === owner), openMine);
  return list || [];
}

export async function getMine(cid) {
  const found = await run("readonly", (store) => (store ? store.get(cid) : memoryMine.get(cid)), openMine);
  return found || null;
}

export function putMine(record) {
  return run("readwrite", (store) => {
    if (store) store.put(record);
    else memoryMine.set(record.cid, structuredClone(record));
  }, openMine);
}

export function deleteMineRecord(cid) {
  return run("readwrite", (store) => {
    if (store) store.delete(cid);
    else memoryMine.delete(cid);
  }, openMine);
}

// Ask the browser not to clear this storage when space is low.
export function keepStorage() {
  try { navigator.storage?.persist?.(); } catch { /* not supported */ }
}

// Ids for My Animals double as animal ids, which are lowercase letters only.
export function newAnimalId() {
  const bytes = crypto.getRandomValues(new Uint8Array(14));
  return `my${[...bytes].map((b) => String.fromCharCode(97 + (b % 26))).join("")}`;
}

export function newId() {
  if (crypto.randomUUID) return crypto.randomUUID().replace(/-/g, "");
  return [...crypto.getRandomValues(new Uint8Array(16))].map((b) => b.toString(16).padStart(2, "0")).join("");
}
