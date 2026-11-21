// Prints the sung storybooks for server/sing.py, as JSON: for each song its
// tune (notes from music.js) and, for each version, the lyric of every page.
// Old MacDonald has one version per animal (the animal and its sound are in
// the verse); the others have one version.
//
//   node scripts/voice/songs.mjs > /tmp/songs.json

const stub = new Proxy(function () {}, {
  get: (t, k) => (k === Symbol.toPrimitive ? () => "" : k === Symbol.iterator ? [][Symbol.iterator] : stub),
  apply: () => stub,
  construct: () => stub,
});
globalThis.document = stub;
globalThis.window = globalThis;

const { BOOKS, SUNG } = await import("../../public/trace/story.js");
const { ANIMALS } = await import("../../public/trace/animals.js");
const { tuneScore } = await import("../../public/trace/music.js");

const animals = [...ANIMALS, { id: "mine", name: "My animal", mine: true }];
const songs = [];
for (const book of BOOKS.filter((b) => SUNG.includes(b.id))) {
  const named = book.pages.some((p) => p.text.length > 0);
  const versions = (named ? animals : [null]).map((a) => ({
    file: `${book.id}/${a ? a.id : "song"}`,
    pages: book.pages.map((p) => (p.text.length ? p.text(a, "") : p.text())),
  }));
  songs.push({ id: book.id, title: book.title, tune: tuneScore(book.id), versions });
}
console.log(JSON.stringify({ songs }, null, 1));
