// My Animals: turns a photo of an animal into an outline to trace, all on
// the device. Nothing about the photo is sent anywhere while this runs.
//
// 1. U²-Net (small, "u2netp", Apache-2.0) finds the main thing in the photo
//    and gives a soft mask. It runs in onnxruntime-web (MIT), single-threaded
//    WebAssembly, so it works in Safari without special headers.
// 2. The mask is cleaned up (biggest piece, holes filled, edges smoothed) and
//    its border becomes the outline.
// 3. A light edge finder (Canny) picks a few long lines inside the animal,
//    such as legs, ears or a wing, drawn as open lines.
// 4. A small square photo of the animal is made for the tile's corner. It is
//    redrawn on a canvas, so the camera's EXIF data (place, time, device)
//    is left behind.
//
// The result uses the same 1000 x 1000 viewBox and shape strings as the
// hand-drawn outlines in animals.js.

const MODEL_URL = new URL("models/u2netp.onnx", import.meta.url).href;
const ORT_DIR = new URL("vendor/onnxruntime/", import.meta.url).href;
const NET = 320;            // the model's input size
const WORK = 480;           // long side of the image the outline is made from
const PHOTO = 160;          // tile corner photo, pixels
const MAX_LINES = 8;        // inside lines kept at most

export class NoAnimalError extends Error {}

let modelPromise = null;

// Loads the model (about 20 MB the first time, then from the cache).
export function prepareModel() {
  modelPromise ??= (async () => {
    const ort = await import("./vendor/onnxruntime/ort.wasm.min.mjs");
    ort.env.wasm.wasmPaths = ORT_DIR;
    ort.env.wasm.numThreads = 1;
    ort.env.wasm.proxy = false;
    const res = await fetch(MODEL_URL);
    if (!res.ok) throw new Error(`Model ${res.status}`);
    const bytes = new Uint8Array(await res.arrayBuffer());
    const session = await ort.InferenceSession.create(bytes, { executionProviders: ["wasm"] });
    return { ort, session };
  })().catch((err) => { modelPromise = null; throw err; });
  return modelPromise;
}

// file (from the camera) -> { shapes, photo, tint }
export async function photoToOutline(file) {
  const source = await loadImage(file);
  const sw = source.width;
  const sh = source.height;
  const k = WORK / Math.max(sw, sh);
  const W = Math.max(8, Math.round(sw * k));
  const H = Math.max(8, Math.round(sh * k));
  const rgb = pixels(source, W, H);

  const saliency = await findSubject(source, W, H);
  const mask = cleanMask(saliency, W, H);
  if (!mask) throw new NoAnimalError("No animal found");

  const box = bounds(mask.data, W, H);
  const fit = fitter(box);
  const shapes = [];
  const outline = traceBorder(mask.data, W, H);
  if (outline.length < 12) throw new NoAnimalError("No animal found");
  shapes.push(`<path d="${closedPath(simplify(smooth(outline, 2, true), 0.9, true).map(fit))}"/>`);
  for (const line of insideLines(rgb, mask.data, W, H, box)) {
    shapes.push(`<path class="line" d="${openPath(line.map(fit))}"/>`);
  }

  const photo = cornerPhoto(source, box, W);
  if (source.close) source.close();
  return { shapes, photo, tint: tintOf(rgb, mask.data) };
}

// ---------- Loading ----------

async function loadImage(file) {
  // Photos straight from an iPhone or iPad camera are rotated by their EXIF
  // tag; both ways here turn them the right way up.
  try {
    return await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    const url = URL.createObjectURL(file);
    try {
      const img = new Image();
      img.decoding = "async";
      img.src = url;
      await img.decode();
      return img;
    } finally {
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
  }
}

function canvas2d(w, h) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return [c, c.getContext("2d", { willReadFrequently: true })];
}

function pixels(source, w, h) {
  const [, ctx] = canvas2d(w, h);
  ctx.drawImage(source, 0, 0, w, h);
  return ctx.getImageData(0, 0, w, h).data;
}

// ---------- Finding the animal ----------

async function findSubject(source, W, H) {
  const { ort, session } = await prepareModel();
  const px = pixels(source, NET, NET);
  // Same preparation as rembg: scale by the brightest value, then ImageNet mean/std.
  let max = 1;
  for (let i = 0; i < px.length; i += 4) max = Math.max(max, px[i], px[i + 1], px[i + 2]);
  const mean = [0.485, 0.456, 0.406];
  const std = [0.229, 0.224, 0.225];
  const input = new Float32Array(3 * NET * NET);
  for (let i = 0, p = 0; p < NET * NET; i += 4, p++) {
    for (let c = 0; c < 3; c++) input[c * NET * NET + p] = (px[i + c] / max - mean[c]) / std[c];
  }
  const feeds = { [session.inputNames[0]]: new ort.Tensor("float32", input, [1, 3, NET, NET]) };
  const out = (await session.run(feeds))[session.outputNames[0]].data;
  let lo = Infinity;
  let hi = -Infinity;
  for (const v of out) { if (v < lo) lo = v; if (v > hi) hi = v; }
  const span = hi - lo || 1;
  // Up to the working size (bilinear).
  const sal = new Float32Array(W * H);
  for (let y = 0; y < H; y++) {
    const fy = Math.min(NET - 1, Math.max(0, ((y + 0.5) / H) * NET - 0.5));
    const y0 = Math.floor(fy);
    const y1 = Math.min(NET - 1, y0 + 1);
    const ty = fy - y0;
    for (let x = 0; x < W; x++) {
      const fx = Math.min(NET - 1, Math.max(0, ((x + 0.5) / W) * NET - 0.5));
      const x0 = Math.floor(fx);
      const x1 = Math.min(NET - 1, x0 + 1);
      const tx = fx - x0;
      const v = (out[y0 * NET + x0] * (1 - tx) + out[y0 * NET + x1] * tx) * (1 - ty)
        + (out[y1 * NET + x0] * (1 - tx) + out[y1 * NET + x1] * tx) * ty;
      sal[y * W + x] = (v - lo) / span;
    }
  }
  sal.peak = hi;
  return sal;
}

// Biggest piece, holes filled, edges rounded. Null if there's nothing there.
function cleanMask(sal, W, H) {
  let m = new Uint8Array(W * H);
  for (let i = 0; i < m.length; i++) m[i] = sal[i] > 0.5 ? 1 : 0;
  m = largestPiece(m, W, H);
  if (!m) return null;
  fillHoles(m, W, H);
  // Round off jaggies and thin bits: blur, then cut at half.
  const r = Math.max(2, Math.round(Math.max(W, H) * 0.008));
  const soft = boxBlur(Float32Array.from(m), W, H, r);
  for (let i = 0; i < m.length; i++) m[i] = soft[i] >= 0.5 ? 1 : 0;
  m = largestPiece(m, W, H);
  if (!m) return null;
  fillHoles(m, W, H);
  let area = 0;
  for (const v of m) area += v;
  const share = area / (W * H);
  if (share < 0.01 || share > 0.97) return null;
  return { data: m, area };
}

function largestPiece(m, W, H) {
  const label = new Int32Array(W * H);
  const stack = new Int32Array(W * H);
  let best = 0;
  let bestSize = 0;
  let next = 0;
  for (let s = 0; s < m.length; s++) {
    if (!m[s] || label[s]) continue;
    next++;
    let size = 0;
    let top = 0;
    stack[top++] = s;
    label[s] = next;
    while (top) {
      const p = stack[--top];
      size++;
      const x = p % W;
      const y = (p - x) / W;
      if (x > 0 && m[p - 1] && !label[p - 1]) { label[p - 1] = next; stack[top++] = p - 1; }
      if (x < W - 1 && m[p + 1] && !label[p + 1]) { label[p + 1] = next; stack[top++] = p + 1; }
      if (y > 0 && m[p - W] && !label[p - W]) { label[p - W] = next; stack[top++] = p - W; }
      if (y < H - 1 && m[p + W] && !label[p + W]) { label[p + W] = next; stack[top++] = p + W; }
    }
    if (size > bestSize) { bestSize = size; best = next; }
  }
  if (!best) return null;
  const out = new Uint8Array(W * H);
  for (let i = 0; i < out.length; i++) out[i] = label[i] === best ? 1 : 0;
  return out;
}

function fillHoles(m, W, H) {
  const seen = new Uint8Array(W * H);
  const stack = [];
  const push = (p) => { if (!m[p] && !seen[p]) { seen[p] = 1; stack.push(p); } };
  for (let x = 0; x < W; x++) { push(x); push((H - 1) * W + x); }
  for (let y = 0; y < H; y++) { push(y * W); push(y * W + W - 1); }
  while (stack.length) {
    const p = stack.pop();
    const x = p % W;
    const y = (p - x) / W;
    if (x > 0) push(p - 1);
    if (x < W - 1) push(p + 1);
    if (y > 0) push(p - W);
    if (y < H - 1) push(p + W);
  }
  for (let i = 0; i < m.length; i++) if (!m[i] && !seen[i]) m[i] = 1;
}

function boxBlur(src, W, H, r) {
  const tmp = new Float32Array(W * H);
  const out = new Float32Array(W * H);
  const n = 2 * r + 1;
  for (let y = 0; y < H; y++) {
    let sum = 0;
    for (let x = -r; x <= r; x++) sum += src[y * W + Math.min(W - 1, Math.max(0, x))];
    for (let x = 0; x < W; x++) {
      tmp[y * W + x] = sum / n;
      sum += src[y * W + Math.min(W - 1, x + r + 1)] - src[y * W + Math.max(0, x - r)];
    }
  }
  for (let x = 0; x < W; x++) {
    let sum = 0;
    for (let y = -r; y <= r; y++) sum += tmp[Math.min(H - 1, Math.max(0, y)) * W + x];
    for (let y = 0; y < H; y++) {
      out[y * W + x] = sum / n;
      sum += tmp[Math.min(H - 1, y + r + 1) * W + x] - tmp[Math.max(0, y - r) * W + x];
    }
  }
  return out;
}

function bounds(m, W, H) {
  let x0 = W, y0 = H, x1 = -1, y1 = -1;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (!m[y * W + x]) continue;
      if (x < x0) x0 = x;
      if (x > x1) x1 = x;
      if (y < y0) y0 = y;
      if (y > y1) y1 = y;
    }
  }
  return { x0, y0, x1: x1 + 1, y1: y1 + 1, w: x1 + 1 - x0, h: y1 + 1 - y0 };
}

// Working pixels -> the 1000 x 1000 page, animal centred and as big as fits.
function fitter(box) {
  const s = 820 / Math.max(box.w, box.h);
  const cx = (box.x0 + box.x1) / 2;
  const cy = (box.y0 + box.y1) / 2;
  return ([x, y]) => [Math.round(500 + (x - cx) * s), Math.round(500 + (y - cy) * s)];
}

// ---------- The outline ----------

// Walks round the edge of the mask (Moore neighbour tracing), clockwise.
const DIRS = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]];
function traceBorder(m, W, H) {
  const at = (x, y) => x >= 0 && y >= 0 && x < W && y < H && m[y * W + x] === 1;
  let start = -1;
  for (let i = 0; i < m.length; i++) if (m[i]) { start = i; break; }
  if (start < 0) return [];
  const sx = start % W;
  const sy = (start - sx) / W;
  const points = [[sx, sy]];
  let x = sx;
  let y = sy;
  let back = 4; // came from the west (the pixel to the left is empty)
  let firstMove = -1;
  for (let guard = 0; guard < W * H * 4; guard++) {
    let moved = -1;
    for (let i = 1; i <= 8; i++) {
      const d = (back + i) % 8;
      if (at(x + DIRS[d][0], y + DIRS[d][1])) { moved = d; break; }
    }
    if (moved < 0) break; // a single pixel
    if (x === sx && y === sy) {
      if (firstMove === moved) break;
      if (firstMove < 0) firstMove = moved;
    }
    x += DIRS[moved][0];
    y += DIRS[moved][1];
    // Search the next pixel's neighbours clockwise, starting just after
    // the one we came from (radial sweep).
    back = (moved + 4) % 8;
    points.push([x, y]);
  }
  points.pop(); // last one is the start again
  return points.map(([px, py]) => [px + 0.5, py + 0.5]);
}

function smooth(points, passes, closed) {
  let p = points;
  const n = p.length;
  for (let k = 0; k < passes; k++) {
    const q = new Array(n);
    for (let i = 0; i < n; i++) {
      if (!closed && (i === 0 || i === n - 1)) { q[i] = p[i]; continue; }
      let sx = 0, sy = 0, c = 0;
      for (let j = -2; j <= 2; j++) {
        let idx = i + j;
        if (closed) idx = (idx + n) % n;
        else idx = Math.min(n - 1, Math.max(0, idx));
        sx += p[idx][0];
        sy += p[idx][1];
        c++;
      }
      q[i] = [sx / c, sy / c];
    }
    p = q;
  }
  return p;
}

// Douglas–Peucker: drop points that don't change the shape.
function simplify(points, eps, closed) {
  if (points.length < 4) return points;
  if (closed) {
    // Split at the point farthest from the first, simplify both halves.
    let far = 0, best = -1;
    for (let i = 1; i < points.length; i++) {
      const d = (points[i][0] - points[0][0]) ** 2 + (points[i][1] - points[0][1]) ** 2;
      if (d > best) { best = d; far = i; }
    }
    const a = simplify(points.slice(0, far + 1), eps, false);
    const b = simplify([...points.slice(far), points[0]], eps, false);
    return [...a.slice(0, -1), ...b.slice(0, -1)];
  }
  const keep = new Uint8Array(points.length);
  keep[0] = keep[points.length - 1] = 1;
  const stack = [[0, points.length - 1]];
  while (stack.length) {
    const [s, e] = stack.pop();
    const [ax, ay] = points[s];
    const [bx, by] = points[e];
    const dx = bx - ax;
    const dy = by - ay;
    const len = Math.hypot(dx, dy) || 1;
    let idx = -1, dmax = eps;
    for (let i = s + 1; i < e; i++) {
      const d = Math.abs((points[i][0] - ax) * dy - (points[i][1] - ay) * dx) / len;
      if (d > dmax) { dmax = d; idx = i; }
    }
    if (idx > 0) { keep[idx] = 1; stack.push([s, idx], [idx, e]); }
  }
  return points.filter((_, i) => keep[i]);
}

// Smooth curves through the midpoints, like the crayon strokes.
function closedPath(p) {
  const n = p.length;
  const mid = (a, b) => [Math.round((a[0] + b[0]) / 2), Math.round((a[1] + b[1]) / 2)];
  const m0 = mid(p[n - 1], p[0]);
  let d = `M${m0[0]} ${m0[1]}`;
  for (let i = 0; i < n; i++) {
    const c = p[i];
    const m = mid(c, p[(i + 1) % n]);
    d += ` Q${c[0]} ${c[1]} ${m[0]} ${m[1]}`;
  }
  return `${d} Z`;
}

function openPath(p) {
  if (p.length < 3) return `M${p[0][0]} ${p[0][1]} L${p[p.length - 1][0]} ${p[p.length - 1][1]}`;
  const mid = (a, b) => [Math.round((a[0] + b[0]) / 2), Math.round((a[1] + b[1]) / 2)];
  let d = `M${p[0][0]} ${p[0][1]}`;
  for (let i = 1; i < p.length - 1; i++) {
    const m = mid(p[i], p[i + 1]);
    d += ` Q${p[i][0]} ${p[i][1]} ${m[0]} ${m[1]}`;
  }
  const last = p[p.length - 1];
  return `${d} L${last[0]} ${last[1]}`;
}

// ---------- Lines inside the animal ----------

function insideLines(rgb, m, W, H, box) {
  const n = W * H;
  const gray = new Float32Array(n);
  for (let i = 0, p = 0; p < n; i += 4, p++) gray[p] = 0.299 * rgb[i] + 0.587 * rgb[i + 1] + 0.114 * rgb[i + 2];
  const g = gaussian(gray, W, H, Math.max(1.6, Math.max(W, H) / 220));

  // Keep away from the outline itself: only well inside the mask.
  const inset = Math.max(4, Math.round(Math.max(box.w, box.h) * 0.035));
  const inner = boxBlur(Float32Array.from(m), W, H, inset);

  const mag = new Float32Array(n);
  const dir = new Uint8Array(n);
  for (let y = 1; y < H - 1; y++) {
    for (let x = 1; x < W - 1; x++) {
      const p = y * W + x;
      const gx = g[p - W + 1] + 2 * g[p + 1] + g[p + W + 1] - g[p - W - 1] - 2 * g[p - 1] - g[p + W - 1];
      const gy = g[p + W - 1] + 2 * g[p + W] + g[p + W + 1] - g[p - W - 1] - 2 * g[p - W] - g[p - W + 1];
      mag[p] = Math.hypot(gx, gy);
      const a = ((Math.atan2(gy, gx) * 180) / Math.PI + 180) % 180;
      dir[p] = a < 22.5 || a >= 157.5 ? 0 : a < 67.5 ? 1 : a < 112.5 ? 2 : 3;
    }
  }
  // Thin edges to one pixel (non-maximum suppression), inside the animal only.
  const thin = new Float32Array(n);
  const values = [];
  const OFF = [[1, 0], [1, 1], [0, 1], [-1, 1]];
  for (let y = 1; y < H - 1; y++) {
    for (let x = 1; x < W - 1; x++) {
      const p = y * W + x;
      if (inner[p] < 0.999 || mag[p] < 1) continue;
      const [ox, oy] = OFF[dir[p]];
      const a = mag[p + oy * W + ox];
      const b = mag[p - oy * W - ox];
      if (mag[p] >= a && mag[p] >= b) { thin[p] = mag[p]; values.push(mag[p]); }
    }
  }
  if (values.length < 20) return [];
  values.sort((a, b) => a - b);
  const high = Math.max(60, values[Math.floor(values.length * 0.88)]);
  const low = high * 0.45;

  // Hysteresis: strong edges, plus weak ones touching them.
  const edge = new Uint8Array(n);
  const stack = [];
  for (let p = 0; p < n; p++) if (thin[p] >= high) { edge[p] = 1; stack.push(p); }
  while (stack.length) {
    const p = stack.pop();
    for (const [dx, dy] of DIRS) {
      const q = p + dy * W + dx;
      if (q >= 0 && q < n && !edge[q] && thin[q] >= low) { edge[q] = 1; stack.push(q); }
    }
  }

  // Follow edges into lines.
  const used = new Uint8Array(n);
  const neighbours = (p) => {
    const out = [];
    const x = p % W;
    for (const [dx, dy] of DIRS) {
      if ((dx < 0 && x === 0) || (dx > 0 && x === W - 1)) continue;
      const q = p + dy * W + dx;
      if (q >= 0 && q < n && edge[q]) out.push(q);
    }
    return out;
  };
  const walk = (start) => {
    const line = [start];
    used[start] = 1;
    let p = start;
    for (;;) {
      const next = neighbours(p).filter((q) => !used[q]);
      if (!next.length) break;
      // Prefer going straight on.
      let q = next[0];
      if (next.length > 1 && line.length > 2) {
        const prev = line[line.length - 3];
        const vx = (p % W) - (prev % W);
        const vy = Math.floor(p / W) - Math.floor(prev / W);
        let best = -Infinity;
        for (const c of next) {
          const s = ((c % W) - (p % W)) * vx + (Math.floor(c / W) - Math.floor(p / W)) * vy;
          if (s > best) { best = s; q = c; }
        }
      }
      for (const c of next) used[c] = 1; // a line is one pixel wide; skip its side pixels
      line.push(q);
      p = q;
    }
    return line;
  };
  const lines = [];
  for (let p = 0; p < n; p++) if (edge[p] && !used[p] && neighbours(p).length === 1) lines.push(walk(p));
  for (let p = 0; p < n; p++) if (edge[p] && !used[p]) lines.push(walk(p));

  const minLen = Math.max(14, Math.max(box.w, box.h) * 0.13);
  return lines
    .filter((l) => l.length >= minLen)
    .sort((a, b) => b.length - a.length)
    .slice(0, MAX_LINES)
    .map((l) => simplify(smooth(l.map((p) => [(p % W) + 0.5, Math.floor(p / W) + 0.5]), 2, false), 1.2, false));
}

function gaussian(src, W, H, sigma) {
  const r = Math.ceil(sigma * 2.5);
  const k = [];
  let sum = 0;
  for (let i = -r; i <= r; i++) { const v = Math.exp(-(i * i) / (2 * sigma * sigma)); k.push(v); sum += v; }
  for (let i = 0; i < k.length; i++) k[i] /= sum;
  const tmp = new Float32Array(W * H);
  const out = new Float32Array(W * H);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      let s = 0;
      for (let i = -r; i <= r; i++) s += src[y * W + Math.min(W - 1, Math.max(0, x + i))] * k[i + r];
      tmp[y * W + x] = s;
    }
  }
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      let s = 0;
      for (let i = -r; i <= r; i++) s += tmp[Math.min(H - 1, Math.max(0, y + i)) * W + x] * k[i + r];
      out[y * W + x] = s;
    }
  }
  return out;
}

// ---------- Tile photo and colour ----------

// A small square of the photo around the animal, made fresh on a canvas
// (JPEG with no EXIF: no place, time or camera details).
function cornerPhoto(source, box, W) {
  const k = source.width / W;
  // A square around the animal, kept inside the photo where it can be.
  const side = Math.min(Math.max(box.w, box.h) * 1.15 * k, source.width, source.height);
  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
  const cx = clamp(((box.x0 + box.x1) / 2) * k, side / 2, source.width - side / 2);
  const cy = clamp(((box.y0 + box.y1) / 2) * k, side / 2, source.height - side / 2);
  const [c, ctx] = canvas2d(PHOTO, PHOTO);
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, PHOTO, PHOTO);
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(source, cx - side / 2, cy - side / 2, side, side, 0, 0, PHOTO, PHOTO);
  return c.toDataURL("image/jpeg", 0.72);
}

// The animal's own colour as a soft pastel for the tile background (a calm
// blue when the animal is grey, black or white).
function tintOf(rgb, m) {
  let r = 0, g = 0, b = 0, c = 0;
  for (let p = 0, i = 0; p < m.length; p++, i += 4) {
    if (!m[p]) continue;
    r += rgb[i]; g += rgb[i + 1]; b += rgb[i + 2]; c++;
  }
  if (!c) return "#e3ecfb";
  r /= c * 255; g /= c * 255; b /= c * 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const sat = max ? (max - min) / max : 0;
  if (sat < 0.12) return "#e3ecfb";
  let h;
  if (max === r) h = ((g - b) / (max - min)) % 6;
  else if (max === g) h = (b - r) / (max - min) + 2;
  else h = (r - g) / (max - min) + 4;
  return hslHex((h * 60 + 360) % 360, 0.75, 0.9);
}

function hslHex(h, s, l) {
  const a = s * Math.min(l, 1 - l);
  const f = (n) => {
    const k = (n + h / 30) % 12;
    const v = l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    return Math.round(v * 255).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}
