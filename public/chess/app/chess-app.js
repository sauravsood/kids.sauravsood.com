// Chess for kids: "Learn" shows how each piece moves by letting the child
// collect a few pawns with it; "Play" is a gentle game against the iPad.
// No clock, no rating, no accounts. The board is chessground (Lichess's
// board, GPL-3.0-or-later) and the rules come from chess.js (BSD-2-Clause).
import { Chessground } from "./vendor/chessground/chessground.min.js";
import { Chess } from "./vendor/chess.js/chess.js";

const $ = (id) => document.getElementById(id);
const FILES = "abcdefgh";
const sq = (f, r) => FILES[f] + (r + 1);
const fr = (s) => [FILES.indexOf(s[0]), Number(s[1]) - 1];

const ground = Chessground($("board"), {
  coordinates: true,
  animation: { duration: 250 },
  premovable: { enabled: false },
  drawable: { enabled: false },
  highlight: { lastMove: true, check: true },
  movable: { free: false, showDests: true },
});

// ---------- Learn: one piece, three pawns to collect ----------

const LESSONS = [
  { id: "rook", role: "rook", glyph: "♖", name: "Rook", say: "The rook goes straight: up, down or sideways, as far as it likes.", at: "d4", food: ["d7", "g4", "g7"] },
  { id: "bishop", role: "bishop", glyph: "♗", name: "Bishop", say: "The bishop slides on slanted lines and stays on one colour.", at: "c1", food: ["f4", "d6", "b8"] },
  { id: "queen", role: "queen", glyph: "♕", name: "Queen", say: "The queen goes straight or slanted, as far as she likes.", at: "d1", food: ["d6", "g3", "b6"] },
  { id: "knight", role: "knight", glyph: "♘", name: "Knight", say: "The knight jumps in an L shape: two steps, then one to the side.", at: "b1", food: ["c3", "e4", "f6"] },
  { id: "king", role: "king", glyph: "♔", name: "King", say: "The king takes one step at a time, any way he likes.", at: "e1", food: ["e2", "f3", "g4"] },
  { id: "pawn", role: "pawn", glyph: "♙", name: "Pawn", say: "The pawn steps forward, but it takes slanted. From its first square it may step two.", at: "d2", food: ["e5", "d7", "c8"] },
];
let lesson = LESSONS[0];
let learn = null; // { at, food:Set }

function lessonDests({ at, food }, role) {
  const [f, r] = fr(at);
  const out = [];
  const inside = (x, y) => x >= 0 && x < 8 && y >= 0 && y < 8;
  const slide = (dirs) => {
    for (const [dx, dy] of dirs) {
      for (let x = f + dx, y = r + dy; inside(x, y); x += dx, y += dy) {
        out.push(sq(x, y));
        if (food.has(sq(x, y))) break; // stop at a pawn after taking it
      }
    }
  };
  const step = (deltas) => { for (const [dx, dy] of deltas) if (inside(f + dx, r + dy)) out.push(sq(f + dx, r + dy)); };
  const STRAIGHT = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  const SLANT = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
  if (role === "rook") slide(STRAIGHT);
  if (role === "bishop") slide(SLANT);
  if (role === "queen") slide([...STRAIGHT, ...SLANT]);
  if (role === "king") step([...STRAIGHT, ...SLANT]);
  if (role === "knight") step([[1, 2], [2, 1], [-1, 2], [-2, 1], [1, -2], [2, -1], [-1, -2], [-2, -1]]);
  if (role === "pawn") {
    if (inside(f, r + 1) && !food.has(sq(f, r + 1))) {
      out.push(sq(f, r + 1));
      if (r === 1 && !food.has(sq(f, r + 2))) out.push(sq(f, r + 2));
    }
    for (const dx of [-1, 1]) if (inside(f + dx, r + 1) && food.has(sq(f + dx, r + 1))) out.push(sq(f + dx, r + 1));
  }
  return out;
}

function drawLesson() {
  const pieces = new Map();
  pieces.set(learn.at, { role: lesson.role, color: "white" });
  for (const s of learn.food) pieces.set(s, { role: "pawn", color: "black" });
  const dests = new Map([[learn.at, lessonDests(learn, lesson.role)]]);
  ground.set({
    fen: "8/8/8/8/8/8/8/8",
    lastMove: undefined,
    check: false,
    turnColor: "white",
    movable: { color: "white", dests, events: { after: lessonMove } },
  });
  ground.setPieces(pieces);
  $("learn-say").textContent = learn.food.size
    ? lesson.say
    : `You got them all with the ${lesson.name.toLowerCase()}! Pick another piece, or go again.`;
}

function lessonMove(from, to) {
  learn.at = to;
  learn.food.delete(to);
  // A pawn that reaches the far side with pawns left can't move any more, so start it again.
  if (lesson.role === "pawn" && learn.food.size && !lessonDests(learn, "pawn").length) {
    setTimeout(startLesson, 700);
    return;
  }
  drawLesson();
}

function startLesson() {
  learn = { at: lesson.at, food: new Set(lesson.food) };
  drawLesson();
}

$("pieces").innerHTML = LESSONS.map((l) =>
  `<button data-lesson="${l.id}" aria-pressed="false"><span aria-hidden="true">${l.glyph}</span>${l.name}</button>`).join("");
$("pieces").addEventListener("click", (e) => {
  const b = e.target.closest("[data-lesson]");
  if (!b) return;
  lesson = LESSONS.find((l) => l.id === b.dataset.lesson);
  for (const x of $("pieces").children) x.setAttribute("aria-pressed", String(x === b));
  startLesson();
});
$("learn-again").addEventListener("click", startLesson);

// ---------- Play: a gentle game against the iPad ----------

const game = new Chess();
let level = 0;
let thinking = 0;
const VALUE = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };

function score(g) {
  // Material for black minus white, plus a little for standing in the middle.
  let s = 0;
  for (const row of g.board()) {
    for (const p of row) {
      if (!p) continue;
      const [f, r] = fr(p.square);
      const middle = 0.05 * (3.5 - Math.abs(3.5 - f) + 3.5 - Math.abs(3.5 - r));
      s += (p.color === "b" ? 1 : -1) * (VALUE[p.type] + middle);
    }
  }
  return s;
}

function search(g, depth, alpha, beta) {
  if (g.isCheckmate()) return g.turn() === "b" ? -1000 - depth : 1000 + depth;
  if (g.isDraw() || g.isStalemate()) return 0;
  if (depth === 0) return score(g);
  const blackToMove = g.turn() === "b";
  let best = blackToMove ? -Infinity : Infinity;
  for (const m of g.moves()) {
    g.move(m);
    const v = search(g, depth - 1, alpha, beta);
    g.undo();
    if (blackToMove) { best = Math.max(best, v); alpha = Math.max(alpha, v); }
    else { best = Math.min(best, v); beta = Math.min(beta, v); }
    if (beta <= alpha) break;
  }
  return best;
}

function pickMove() {
  const moves = game.moves({ verbose: true });
  const random = () => moves[Math.floor(Math.random() * moves.length)];
  // Gentle: mostly any move. Easy: looks one move ahead, often forgets. Tricky: looks two ahead.
  if (level === 0 && Math.random() < 0.75) return random();
  if (level === 1 && Math.random() < 0.3) return random();
  const depth = level === 2 ? 2 : 0;
  let best = [], bestScore = -Infinity;
  for (const m of moves) {
    game.move(m);
    const v = search(game, depth, -Infinity, Infinity) + Math.random() * 0.2;
    game.undo();
    if (v > bestScore) { bestScore = v; best = m; }
  }
  return best;
}

function dests() {
  const map = new Map();
  for (const m of game.moves({ verbose: true })) {
    if (!map.has(m.from)) map.set(m.from, []);
    map.get(m.from).push(m.to);
  }
  return map;
}

function say() {
  let text;
  if (game.isCheckmate()) text = game.turn() === "b" ? "Checkmate! You won. Well played!" : "Checkmate. The iPad got this one. Good game!";
  else if (game.isDraw() || game.isStalemate()) text = "It's a draw. Nobody wins, nobody loses.";
  else if (game.turn() === "b") text = "The iPad is thinking…";
  else if (game.isCheck()) text = "Your king is in check. Keep him safe.";
  else text = game.history().length ? "Your turn." : "You are white. Move a piece to start.";
  $("play-say").textContent = text;
}

function drawGame() {
  const last = game.history({ verbose: true }).at(-1);
  const over = game.isGameOver();
  ground.set({
    fen: game.fen(),
    turnColor: game.turn() === "w" ? "white" : "black",
    lastMove: last ? [last.from, last.to] : undefined,
    check: game.isCheck(),
    movable: { color: over || game.turn() === "b" ? undefined : "white", dests: over ? new Map() : dests(), events: { after: playMove } },
  });
  $("undo").disabled = game.history().length < 2 || game.turn() === "b";
  say();
}

function playMove(from, to) {
  game.move({ from, to, promotion: "q" }); // pawns always become queens
  drawGame();
  if (game.isGameOver()) return;
  const mine = ++thinking;
  setTimeout(() => {
    if (mine !== thinking) return; // a new game or tab change happened meanwhile
    game.move(pickMove());
    drawGame();
  }, 600);
}

$("new").addEventListener("click", () => { thinking++; game.reset(); drawGame(); });
$("undo").addEventListener("click", () => {
  if (game.history().length < 2 || game.turn() === "b") return;
  game.undo(); game.undo();
  drawGame();
});
$("levels").addEventListener("click", (e) => {
  const b = e.target.closest("[data-level]");
  if (!b) return;
  level = Number(b.dataset.level);
  for (const x of $("levels").children) x.setAttribute("aria-pressed", String(x === b));
});

// ---------- Tabs ----------

function showTab(play) {
  $("tab-learn").setAttribute("aria-selected", String(!play));
  $("tab-play").setAttribute("aria-selected", String(play));
  $("side-learn").hidden = play;
  $("side-play").hidden = !play;
  if (play) {
    drawGame();
    // If the child left while the iPad was thinking, let it finish its move.
    if (game.turn() === "b" && !game.isGameOver()) { const mine = ++thinking; setTimeout(() => { if (mine === thinking) { game.move(pickMove()); drawGame(); } }, 400); }
  } else {
    thinking++;
    drawLesson();
  }
}
$("tab-learn").addEventListener("click", () => showTab(false));
$("tab-play").addEventListener("click", () => showTab(true));
addEventListener("resize", () => ground.redrawAll());

$("pieces").firstElementChild.setAttribute("aria-pressed", "true");
startLesson();
