// Soft music for the storybooks, played live with Web Audio (no files to
// download): a music box plays the rhyme's own old tune (or a gentle
// lullaby pattern for rhymes that are usually spoken), over a quiet warm pad
// and a little room echo. It only plays while "Read to me" is on, and dips
// while the narrator is speaking.

let ctx = null;
let master = null; // whole music level (fades in and out)
let duckGain = null; // dips under the voice
let reverb = null;
let dry = null;
let timer = 0;
let stopTimer = 0;
let playing = null; // { tune, step, at }

// The voice and the music share one AudioContext, made on the first tap.
export function audio() {
  if (!ctx) {
    // Play even with the iPad's silent switch on, like a video would.
    try { if (navigator.audioSession) navigator.audioSession.type = "playback"; } catch { /* older Safari */ }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
  return ctx;
}

const NOTE = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
const midi = (n) => {
  const m = /^([A-G])([#b]?)(-?\d)$/.exec(n);
  return 12 * (Number(m[3]) + 1) + NOTE[m[1]] + (m[2] === "#" ? 1 : m[2] === "b" ? -1 : 0);
};
const hz = (m) => 440 * 2 ** ((m - 69) / 12);

// Chord name -> notes (MIDI) around middle C.
function chord(name) {
  const m = /^([A-G][#b]?)(m?)(7?)$/.exec(name);
  const root = midi(`${m[1]}3`);
  const third = m[2] ? 3 : 4;
  const notes = [root, root + third, root + 7];
  if (m[3]) notes.push(root + 10);
  return notes;
}

// Tunes: melody as "NOTE:length" (length in steps, default 1); chords one per
// `per` steps. `step` is seconds per step. Tunes without a melody arpeggiate
// their chords with `arp` (offsets into root, third, fifth, octave).
const TWINKLE = "C5 C5 G5 G5 A5 A5 G5:2 F5 F5 E5 E5 D5 D5 C5:2 G5 G5 F5 F5 E5 E5 D5:2 G5 G5 F5 F5 E5 E5 D5:2 C5 C5 G5 G5 A5 A5 G5:2 F5 F5 E5 E5 D5 D5 C5:2";
const TWINKLE_CHORDS = "C C F C F C G C C F C G C F C G C C F C F C G C";
const TUNES = {
  star: { step: 0.82, melody: TWINKLE, chords: TWINKLE_CHORDS, per: 2 },
  baa: { step: 0.74, melody: TWINKLE, chords: TWINKLE_CHORDS, per: 2, transpose: -3 },
  boat: { step: 0.4, per: 6, chords: "C C C C C C G7 C",
    melody: "C5:3 C5:3 C5:2 D5 E5:3 E5:2 D5 E5:2 F5 G5:6 C6 C6 C6 G5 G5 G5 E5 E5 E5 C5 C5 C5 G5:2 F5 E5:2 D5 C5:6" },
  macdonald: { step: 0.62, per: 2, transpose: -5, chords: "C C F C C G C C C C F C C G C C",
    melody: "C5 C5 C5 G4 A4 A4 G4:2 E5 E5 D5 D5 C5:3 G4 C5 C5 C5 G4 A4 A4 G4:2 E5 E5 D5 D5 C5:4" },
  diddle: { step: 0.42, per: 6, chords: "F Dm Bb C F Bb C F", arp: [0, 1, 2, 3, 2, 1] },
  piggy: { step: 0.4, per: 6, chords: "G Em C D G C D G", arp: [0, 2, 3, 2, 1, 2] },
  dickie: { step: 0.44, per: 6, chords: "A D A E A D E A", arp: [3, 2, 1, 2, 3, 2] },
  owlcat: { step: 0.5, per: 6, chords: "Eb Cm Ab Bb Eb Ab Bb Eb", arp: [0, 1, 2, 3, 2, 1] },
  fishalive: { step: 0.4, per: 6, chords: "D G D A D G A D", arp: [0, 2, 1, 3, 2, 1] },
  banbury: { step: 0.36, per: 6, chords: "C F C G C F G C", arp: [0, 1, 2, 3, 1, 2] },
};

// Every tune as a list of steps: [{ notes: [midi], len, chord? }].
function score(t) {
  const chords = t.chords.split(" ");
  const total = chords.length * t.per;
  const steps = Array.from({ length: total }, () => ({ notes: [], len: 1, chord: null }));
  chords.forEach((c, i) => { steps[i * t.per].chord = { notes: chord(c), len: t.per }; });
  const tr = t.transpose || 0;
  if (t.melody) {
    let at = 0;
    for (const tok of t.melody.split(" ")) {
      const [n, l] = tok.split(":");
      if (at < total) { steps[at].notes.push(midi(n) + tr); steps[at].len = Number(l || 1); }
      at += Number(l || 1);
    }
    for (const s of steps) if (s.chord) s.chord.notes = s.chord.notes.map((n) => n + tr);
  } else {
    chords.forEach((c, i) => {
      const [r, th, f] = chord(c);
      const tones = [r + 12, th + 12, f + 12, r + 24];
      for (let k = 0; k < t.per; k++) steps[i * t.per + k].notes.push(tones[t.arp[k % t.arp.length]]);
    });
  }
  return steps;
}

function roomEcho(c) {
  const len = Math.floor(c.sampleRate * 2.6);
  const buf = c.createBuffer(2, len, c.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len) ** 3.2;
  }
  const conv = c.createConvolver();
  conv.buffer = buf;
  return conv;
}

function graph(c) {
  if (master) return;
  master = c.createGain();
  master.gain.value = 0;
  duckGain = c.createGain();
  duckGain.gain.value = 1;
  dry = c.createGain();
  dry.gain.value = 0.8;
  reverb = roomEcho(c);
  const wet = c.createGain();
  wet.gain.value = 0.45;
  dry.connect(duckGain);
  reverb.connect(wet).connect(duckGain);
  duckGain.connect(master).connect(c.destination);
}

// One music-box tine: a pure tone with a bright, fast-fading ping on top.
function tine(c, m, at, vel) {
  const f = hz(m);
  const out = c.createGain();
  out.gain.setValueAtTime(0, at);
  out.gain.linearRampToValueAtTime(vel, at + 0.006);
  out.gain.exponentialRampToValueAtTime(vel * 0.35, at + 0.5);
  out.gain.exponentialRampToValueAtTime(0.0001, at + 2.4);
  out.connect(dry);
  out.connect(reverb);
  const parts = [[1, 1, 2.4], [2, 0.18, 0.7], [5.4, 0.05, 0.12]];
  for (const [ratio, level, decay] of parts) {
    const o = c.createOscillator();
    o.frequency.value = f * ratio;
    const g = c.createGain();
    g.gain.setValueAtTime(level, at);
    g.gain.exponentialRampToValueAtTime(0.0001, at + decay);
    o.connect(g).connect(out);
    o.start(at);
    o.stop(at + decay + 0.05);
  }
}

// A soft, warm chord that swells in and out.
function pad(c, notes, at, dur) {
  const lp = c.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 900;
  const g = c.createGain();
  g.gain.setValueAtTime(0, at);
  g.gain.linearRampToValueAtTime(0.035, at + Math.min(0.9, dur * 0.4));
  g.gain.setValueAtTime(0.035, at + dur * 0.75);
  g.gain.linearRampToValueAtTime(0, at + dur + 0.6);
  lp.connect(g);
  g.connect(dry);
  g.connect(reverb);
  const all = [...notes, notes[0] - 12];
  for (const n of all) {
    for (const detune of [-6, 6]) {
      const o = c.createOscillator();
      o.type = "triangle";
      o.frequency.value = hz(n);
      o.detune.value = detune;
      o.connect(lp);
      o.start(at);
      o.stop(at + dur + 0.7);
    }
  }
}

function schedule() {
  if (!playing || !ctx) return;
  const ahead = ctx.currentTime + 0.5;
  const { tune, steps } = playing;
  while (playing.at < ahead) {
    const s = steps[playing.step];
    for (const n of s.notes) tine(ctx, n, playing.at, 0.09);
    if (s.chord) pad(ctx, s.chord.notes, playing.at, s.chord.len * tune.step);
    playing.at += tune.step;
    playing.step = (playing.step + 1) % steps.length;
    // A breath between times round.
    if (playing.step === 0) playing.at += tune.step * 2;
  }
}

export function startMusic(bookId) {
  const c = audio();
  const tune = TUNES[bookId];
  if (!c || !tune) return;
  graph(c);
  clearTimeout(stopTimer);
  if (playing?.id === bookId) { fade(1, 1.2); return; }
  stopNow();
  playing = { id: bookId, tune, steps: score(tune), step: 0, at: c.currentTime + 0.15 };
  fade(1, 1.6);
  schedule();
  timer = setInterval(schedule, 120);
}

function fade(to, secs) {
  if (!master || !ctx) return;
  const g = master.gain;
  const now = ctx.currentTime;
  g.cancelScheduledValues(now);
  g.setValueAtTime(g.value, now);
  g.linearRampToValueAtTime(to, now + secs);
}

// Quieter while the narrator speaks, back up in the pauses.
export function duck(on) {
  if (!duckGain || !ctx) return;
  const g = duckGain.gain;
  const now = ctx.currentTime;
  g.cancelScheduledValues(now);
  g.setValueAtTime(g.value, now);
  g.linearRampToValueAtTime(on ? 0.55 : 1, now + (on ? 0.25 : 0.8));
}

function stopNow() {
  clearInterval(timer);
  playing = null;
}

export function stopMusic(secs = 0.6) {
  if (!playing) return;
  fade(0, secs);
  clearTimeout(stopTimer);
  stopTimer = setTimeout(stopNow, secs * 1000 + 50);
}

// For tests and the voice: the shared context, if any.
export const audioContext = () => ctx;
export const TUNE_IDS = Object.keys(TUNES);

// For server/sing.py (through scripts/voice/songs.mjs): a tune's notes as
// [{ notes: [midi], len, chord? }] plus seconds per step.
export const tuneScore = (id) => (TUNES[id] ? { step: TUNES[id].step, steps: score(TUNES[id]) } : null);
