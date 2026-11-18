// Prints every line the Trace storybooks read aloud, as JSON, for
// scripts/voice/build.py. Lines that name the child's animal get one
// recording per built-in animal, plus "my animal" for a My Animal. Each
// animal's name is recorded on its own too (voice/names/<id>.mp3).
//
//   node scripts/voice/lines.mjs > /tmp/lines.json

// story.js wires up its buttons when it loads: give it a do-nothing page.
const stub = new Proxy(function () {}, {
  get: (t, k) => (k === Symbol.toPrimitive ? () => "" : k === Symbol.iterator ? [][Symbol.iterator] : stub),
  apply: () => stub,
  construct: () => stub,
});
globalThis.document = stub;
globalThis.window = globalThis;

const { BOOKS } = await import("../../public/trace/story.js");
const { ANIMALS } = await import("../../public/trace/animals.js");

const animals = [...ANIMALS, { id: "mine", name: "My animal", mine: true }];
const lines = [{ file: "end", text: "The end." }];
// The name button under the tracing paper says the animal's name.
for (const a of animals) lines.push({ file: `names/${a.mine ? "mine" : a.id}`, text: `${a.name}.` });
for (const book of BOOKS) {
  lines.push({ file: `${book.id}/title`, text: `${book.title}.` });
  book.pages.forEach((page, n) => {
    if (page.text.length === 0) {
      lines.push({ file: `${book.id}/${n}`, text: page.text() });
    } else {
      for (const a of animals) lines.push({ file: `${book.id}/${n}-${a.id}`, text: page.text(a, "") });
    }
  });
}
console.log(JSON.stringify({ books: BOOKS.map((b) => ({ id: b.id, title: b.title })), lines }, null, 1));
