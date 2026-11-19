# kids.sauravsood.com

A home page of calm, hands-on things for kids, built for iPad first. Apps are grouped into four categories on `/`, and every app has its own landing page (name, one line, suggested age, a big Start button, credits at the bottom) at a clean URL.

| Category | App | Path | Status |
| --- | --- | --- | --- |
| Creativity | Trace | `/trace/` | Live |
| | Drawings Come Alive | `/alive` | Coming soon |
| | Pixel Art | `/pixel/` | Live |
| | Music Lab | `/music/` | Live |
| Explore | Planetarium | `/sky/` | Live (was `/planetarium/`, which redirects) |
| | 3D Dino | `/dino/` | Live |
| | Sand Lab | `/sand/` | Live |
| Puzzles & Thinking | Trust Game | `/trust/` | Live (ages 10+) |
| | Chess | `/chess/` | Live |
| Life Skills | Pocket Money | `/money/` | Live |
| | My Routines | `/routines/` | Live |

Everything is plain HTML, CSS and JavaScript in `public/`, with no build step for this repo. Landing pages share `public/shared/kids.css`.

## Calm by design

- No countdown timers, streaks that break, leaderboards, loot, ads or autoplay. Sound is off by default (Music Lab is the exception).
- Every app has a Home button back to `/`, and a natural stopping point.
- **Links that leave the site need a grown-up.** `public/shared/grownup.js` catches taps on links to other sites and asks a two-digit sum first. Add it to any page with `<script src="/shared/grownup.js" defer></script>`.
- Nothing a child makes is shared publicly.

## Adding or shipping an app

Apps are listed in `CATEGORIES` in `public/tiles.js`. A new app goes in with `soon: true` and no `href`, so it shows as a "Coming soon" tile that can't be tapped. To ship it, drop `soon`, add `href`, and put its landing page at `public/<slug>/index.html`.

Redirects for moved pages live in `public/_redirects`.

Apps built by someone else live in `public/<slug>/app/`, next to their landing page. Each one gets a Home button and the grown-up check on outside links from one line before `</body>`: `<script src="/shared/app-home.js" data-corner="top-left" defer></script>` (corners: `top-left`, `top-right`, `bottom-left`, `bottom-right`). Their kid-safe changes are kept on a `kids-sauravsood` branch of a fork in the sauravsood account.

## Trace (`/trace/`)

- Single page that routes by `#hash`: `#history`, `#c/<group>`, `#d/<id>`, `#e/<id>`, `#<animalId>`.
- Pencil pressure comes through Pointer Events. Strokes are shaped by [perfect-freehand](https://github.com/steveruizok/perfect-freehand) (MIT, vendored in `public/trace/vendor/perfect-freehand/`).
- Palm rejection: once the Pencil has been used, finger and palm touches are ignored for a minute.
- Grown-ups sign in with Google; the kid's name, drawing count and time spent stay in the top bar. Every drawing is saved to the account with a timestamp and can be reopened from History.
- Animal outlines are original drawings in `public/trace/animals.js` (1000 × 1000 viewBox).
- Add it to the iPad home screen for full-screen use. The manifest's `start_url` and `scope` are `/trace/`, so anyone who added Trace before it moved needs to add it again.
- Old links from when Trace lived at `/` (for example `/#history` or `/#d/12`) are sent on to `/trace/#…` by a small script at the top of the hub page, because hashes never reach the server.
- **Works offline.** `public/trace/sw.js` (a service worker) keeps the page, code, outlines and icons on the device: network first with a 2.5 s wait, cache otherwise. Add any new file Trace needs to its `FILES` list and bump `VERSION`.
- **Saves on the device, syncs later.** Drawings go to IndexedDB first (`local.js`), keyed by an id made on the device and by account, so two grown-ups on one iPad stay apart. `sync.js` sends changes (`PUT`/`DELETE /api/drawings/c/<id>`, newest edit wins, safe to repeat) and pulls drawings from other devices (`GET /api/drawings?meta=1`, then `?ids=…`). It runs after each save, every 30 s, when the internet comes back and when the app is reopened. Time spent and name changes wait in `localStorage` and are sent with the day they happened. A cloud-with-a-line icon in the top bar means "offline, saved here". Signing in and out need the internet.

### Kid-proofing (Trace)

- **Leaving mid-drawing** (tab switch, Home swipe, app switch): the line being drawn is kept, a copy goes to localStorage (`trace:draft`) straight away, then the normal IndexedDB save runs. `openDrawing()` uses the copy when it is newer, so a reload of `#e/<id>` lands exactly where the child stopped.
- **Stuck paper**: if iPadOS swallows a touch (Home bar, Dock, Control Centre) and never sends the lift, the next touch frees the paper (`inputStuck`, `lostpointercapture`, reset on return).
- **No scrolling, bouncing or zoom** anywhere on the drawing screen; buttons sit clear of the bottom edge.
- **Grown-up tips** in the profile sheet: Add to Home Screen (full screen, no tabs) and Guided Access.

### Kids (Trace)

- Tap the child's name in the top bar to see every child in the family as a coloured circle. Tapping a circle switches to that child; **+ Add** asks the grown-up sum (`/shared/grownup.js`) and then a name. Switching and adding need the internet; whatever the current child made is sent first.
- Each extra child is a `users` row of its own (`family_id` = the grown-up's row, `google_sub` = `kid:…`, never signed in to), so drawings, time, My Animals and Pocket Money / Routines state stay apart with no change to those tables. The grown-up's own row is the first child. `sessions.kid_id` is the child picked on that device and `users.last_kid` is the one the next sign-in starts with. Up to 8 children.
- `POST /api/kids` `{ name }` adds a child and switches to them; `POST /api/kids/switch` `{ kid }` switches. `/api/me` lists `kids`. Trace sends `X-Kid: <account>` with every sync request, so a sync already on its way when someone switches still lands on the right child. Signing out clears every child's synced drawings from the device.

### My Animals (Trace)

- A sixth group, **My Animals**, starts empty with a big camera button. On an iPad or phone it opens the camera (`<input type="file" accept="image/*" capture="environment">`); on a computer it opens a file picker.
- `public/trace/photo.js` turns the photo into an outline **on the device**: U²-Net small (`models/u2netp.onnx`, 4.6 MB, Apache-2.0) finds the animal, the mask is cleaned up and its border becomes the outline, and a light edge finder adds up to 8 long lines inside (legs, wings, ears) as open `class="line"` paths. It runs in onnxruntime-web 1.31.1 (`vendor/onnxruntime/`, MIT), single-threaded WebAssembly, in about 2 seconds. The result uses the same 1000 × 1000 shape strings as `animals.js`.
- The child sees the outline first, then keeps it (✓) or takes another photo. A kept outline becomes a tile for good, with a small square of the photo in its top-left corner, and opens straight away to trace. The trash on a tile (two taps) hides it; drawings of it still open from History.
- **Photo privacy:** the full photo never leaves the device and isn't kept. Only a 160 px square around the animal is kept for the tile, redrawn on a canvas as a fresh JPEG, so the camera's EXIF (GPS place, time, device) is dropped.
- **Offline:** the model and runtime (about 20 MB) are fetched the first time My Animals is opened online, and the service worker keeps them in their own cache (`trace-models-v1`, cache first). After that the camera works with no internet.
- **Saving:** like drawings, My Animals are saved in IndexedDB first (database `trace-mine`, kept apart from the drawings database so it never needs an upgrade) and synced by `sync.js`: `PUT /api/mine/<id>` (newest edit wins, removals are `hidden: true`), `GET /api/mine?meta=1` and `?ids=…`. The server keeps them in the D1 table `my_animals`, up to 500 per account, and accepts only plain `<path>` shapes and JPEG photos, because shapes go into the page as SVG. Ids are `my` + 14 letters and double as animal ids in drawings.

### Say the name (Trace)

- A pink button before **Animate now** shows the animal's name ("Cat", "Triceratops", "My animal"). Tapping it says the name in the same recorded Kokoro voice as the storybooks: `public/trace/voice/names/<animal>.mp3` (`mine.mp3` for a My Animal). These come from `scripts/voice/lines.mjs` like the rhyme lines; re-record just them with `build.py ... names/`. If a recording can't be loaded, the device's own voice says it.

### Animate now (Trace)

- An **Animate now** button sits under the paper on the tracing page (and when looking at a saved drawing). It turns the child's animal, with their outline in solid lines and their crayon on top, into a cut-out picture and opens a little picture book (`public/trace/story.js`).
- Ten books, all public domain: *Hey Diddle Diddle*, *Row, Row, Row Your Boat*, *Twinkle, Twinkle, Little Star* (Jane Taylor, 1806), *Baa, Baa, Black Sheep*, *This Little Piggy*, *Old MacDonald Had a Farm* (the child's animal and its sound go into the verse: "he had a cow… with a moo-moo here"), *Two Little Dickie Birds* (two of the child's bird), *The Owl and the Pussy-cat* (Edward Lear, 1871, abridged), *One, Two, Three, Four, Five* and *Ride a Cock-Horse*. Scenes are inline SVG drawn for this app; some props reuse outlines from `animals.js`.
- Each book lists the animals it suits (`for` in `story.js`). Matching books come first on the shelf, most specific first, with the child's animal on the cover (a sheep gets *Baa, Baa, Black Sheep*, then *Old MacDonald*).
- It also works from History: opening an older drawing shows the same Animate now button, so past pictures can star in a book too.
- **Page turns** curl over like paper, with shading, using [StPageFlip](https://github.com/Nodlik/StPageFlip) 2.0.7 (MIT, vendored unchanged in `public/trace/vendor/page-flip/`). Children can also swipe or drag a corner. Only the page in view animates, and its move starts over each time it's shown.
- **Play button** (green): reads the book like an audiobook. A warm recorded voice says the title, then each page, while a soft music box plays the rhyme's own old tune underneath (Twinkle, Baa Baa, Row Your Boat, Old MacDonald) or a gentle lullaby pattern for rhymes that are usually spoken. The music dips while the voice speaks. After each page it waits a moment and turns the page by itself until "The end", then the music fades away. Tap again to pause. There is no sound until it's tapped, and it plays with the silent switch on.
  - The voice is recorded ahead of time with [Kokoro-82M](https://github.com/hexgrad/kokoro) (Apache-2.0, voice `af_heart`): `public/trace/voice/<book>/<page>.mp3` (about 3 MB, 181 lines). Lines that name the child's animal have one recording per animal (`<page>-<animal>.mp3`), and `-mine` says "my animal" for a My Animal. Re-record with `scripts/voice/build.py` (instructions at its top) after changing any rhyme text, then bump `VOICE` in `sw.js`.
  - The music is played live by `public/trace/music.js` (Web Audio, no files). Tunes are traditional and public domain.
  - Recordings are saved for offline use the first time each page is read. If one can't be loaded, the device's own voice reads that page instead.
- Calm: nothing turns or speaks unless the child taps, each page plays one slow move and then the animal just breathes, and every book ends on "The end" with Read again, other books, or close. Reduced-motion settings stop the movement.
- Each book sends a page view as `/trace/story/<book>` (`/trace/story/shelf` for the book picker).

## Music Lab (`/music/`)

- `public/music/index.html` shows six experiments from Chrome Music Lab as tiles: Melody Maker, Arpeggios, Chords, Piano Roll, Harmonics and Strings. Each lives in `public/music/<name>/` and its Home button goes back to `/music/`. This is the one app where sound is on, and it only starts when the child taps.
- The upstream repo is archived and built with webpack 1 and node-sass. The fork builds on Node 22 (Dart Sass, pinned loaders) and loads nothing from other sites: piano and harp samples are in `public/music/sound/` (cut from the tonejs-instruments samples with `sound/make-samples.py` in the fork), Tone.js is local, icons are plain characters and there are no web fonts. Piano Roll's microphone button is removed.
- Sound Spinner and Spectrogram are left out because they use the microphone. Song Maker, Rhythm and Kandinsky aren't in the open-source repo.
- Rebuild with `scripts/build-music.sh`. The changes are on the `kids-sauravsood` branch of sauravsood/chrome-music-lab.
- Built from googlecreativelab/chrome-music-lab `e54bb41` plus one commit.

## Planetarium (`/sky/`)

- `public/sky/index.html` is the kid-friendly landing page. `public/sky/view/` is the sky view: the engine (`engine/`, WebAssembly, about 1.3 MB), the sky data (`skydata/`, about 4.5 MB) and our own `sky.js` / `sky.css` with big buttons for lines, star pictures, ground, night and location, plus Moon, Jupiter, Orion and Big Dipper finders.
- The sky data is the small set that ships in the engine's repo (`apps/test-skydata`: bright stars, deep-sky objects, the western constellations with art, one landscape, the Milky Way, Sun and Moon textures). It fits Cloudflare's 25 MiB per-file limit, so no R2 bucket is needed.
- Location comes from the device's time zone unless a grown-up taps the location button. Daytime visits jump to 9 pm so there's something to see; the moon button switches back to "now".
- Old `/planetarium/...` links redirect to `/sky/...` (see `public/_redirects`).
- Rebuild with `scripts/build-sky.sh` (Emscripten 1.39.17 and scons).
- Built from Stellarium/stellarium-web-engine `2103935` (unmodified).

## 3D Dino (`/dino/`)

- `public/dino/index.html` is the landing page. `public/dino/museum/` is the museum's static build (about 420 MB: 61 GLB models, 340 narration MP3s, images). Its asset paths are relative, so it works under `/dino/museum/`. The landing button opens the English version at `/dino/museum/en/`.
- The build carries two small changes, kept in `third_party/dino-rename.patch` and on the fork's `kids-sauravsood` branch: the museum is called "3D Dino" in its header and page titles, because the upstream brand policy asks copies not to use the Prehistoric Animal Museum name or brand as their own. Attribution to Leon Made This stays everywhere.
- `scripts/build-dino.sh` also adds `/shared/museum-home.js` to every museum page: a Home button and the grown-up check on outside links.
- Rebuild with `scripts/build-dino.sh` (Node 22.13+).
- Built from s010s/prehistoric-animal-museum `d2ea7a7` plus the rename patch.

## Trust Game (`/trust/`)

- `public/trust/app/` is a copy of the game from the `kids-sauravsood` branch of the fork (no build step). Sound starts off, and the share buttons, social images and outside translation links are removed. Home button top-left.
- Built from ncase/trust `6ec45d7` plus two small commits.

## Pixel Art (`/pixel/`)

- `public/pixel/app/` is Piskel's production build (`dest/prod`, built with `npx grunt build`) plus its `LICENSE`. Home button bottom-left.
- The open-source Piskel has no online saving or sharing; pictures only leave the iPad if a grown-up uses Export.
- The fork's one change lets Safari (and so iPad) in without the "unsupported browser" message.
- Built from piskelapp/piskel `8624c94` plus that change.

## Sand Lab (`/sand/`)

- `public/sand/app/` is Sandspiel's webpack build (`npm install --legacy-peer-deps && npm run build`, needs Rust with the `wasm32-unknown-unknown` target and `wasm-pack`), without source maps, plus its `LICENSE`.
- The fork keeps only the local sandbox and the element guide. Uploading, browsing, likes, sign-in (Firebase), Sentry, ads, analytics, the service worker and the leave-page prompt are taken out, so nothing made in it leaves the device. Buttons are bigger, and the router keeps the address at `/sand/app/`.
- Built from MaxBittker/sandspiel `9936e06` plus three commits.

## Chess (`/chess/`)

- `public/chess/app/` is our own page (`chess-app.js`) on two vendored libraries in `vendor/`: chessground 9.2.1 (Lichess's board, GPL-3.0-or-later, with the cburnett pieces) and chess.js 1.4.0 (rules, BSD-2-Clause). We don't host Lichess itself.
- **Learn** shows one piece and three pawns to collect, so the child sees how it moves. **Play** is a game against the iPad with no clock, no rating and no account; pawns always promote to queens and moves can be taken back.
- The iPad's player is a small one of our own in `chess-app.js`, not Stockfish, because even Stockfish's lowest level is too strong for a beginner. Gentle mostly plays any move, Easy looks one move ahead and often forgets, Tricky looks two moves ahead.
- Because chessground is GPL, the chess app as a whole is GPL-3.0-or-later.

## Pocket Money (`/money/`) and My Routines (`/routines/`)

- Both are our own small apps in `public/<slug>/app/` (plain HTML, CSS and one ES module each). They are inspired by Actual and Loop Habit Tracker but use none of their code.
- **Pocket Money:** a grown-up adds coins to a tray, the child taps a jar (Save, Spend, Share) to drop each coin in, and the Save jar counts towards one goal with a picture. Coins are whole numbers with no currency.
- **My Routines:** a grown-up picks from a set of picture routines, the child taps a card when it's done. "This week" shows what was done, with no streaks, scores or marks for missed days. Done marks older than 60 days are dropped.
- Grown-up parts (adding or removing coins, choosing routines) sit behind the same sum check as outside links: `window.askGrownUp(text)` from `public/shared/grownup.js`.
- Both use the same Google / Apple sign-in and session as Trace through `public/shared/account.js` (`signedIn()`, `loadState(app)`, `saveState(app, data)`). Each app saves one JSON document per account in the D1 table `app_state` through `GET`/`PUT /api/state/<app>` (`money` or `routines`, up to 100 KB, last write wins).

## Licences

- **Stellarium Web Engine** is AGPL-3.0 (© Stellarium Labs SRL and contributors). The Planetarium page credits it, ships the licence text, and links to the source of the copy that runs here.
- **Prehistoric Animal Museum** code is AGPL-3.0-only; its writing, narration and exhibit backgrounds are CC BY-NC-SA 4.0 (non-commercial: fine for this ad-free site, but this part can't be used commercially); each 3D model keeps its own CC BY 4.0 licence; its name and logo are reserved by its brand policy. The museum's `LICENSE`, `LICENSES/` and `THIRD_PARTY_NOTICES.md` ship inside `public/dino/museum/`, and the 3D Dino page credits the original and links to the source.
- **The Evolution of Trust** is CC0 (public domain), music by Komiku (CC0); its sound effects are CC0, CC Sampling+ and CC BY-NC (fine for this ad-free site).
- **Chrome Music Lab** is Apache-2.0 and Tone.js is MIT; the piano and harp samples come from tonejs-instruments (MIT package; its samples are credited there as CC BY 3.0).
- **chessground** is GPL-3.0-or-later and **chess.js** is BSD-2-Clause; both licence files ship in `public/chess/app/vendor/`, and the chess app built on them is GPL-3.0-or-later.
- **My Animals** uses the U²-Net small model (Xuebin Qin et al., Apache-2.0; ONNX export from rembg, MIT) and onnxruntime-web (Microsoft, MIT). Notes and licence are in `public/trace/models/README.md` and `public/trace/vendor/onnxruntime/LICENSE`.
- **StPageFlip** (Nodlik, MIT) turns the storybook pages; its licence is in `public/trace/vendor/page-flip/LICENSE`.
- **Kokoro-82M** (hexgrad, Apache-2.0) made the storybook narration in `public/trace/voice/`; the model isn't shipped, only the recordings.
- **Piskel** is Apache-2.0. **Sandspiel** is MIT. Each ships its `LICENSE` in its `app/` folder and is credited on its landing page.
- The AGPL asks that people using a modified copy over the web can get its source. Each project page links to the source of the copy running here and to this repo.

## Run locally

```sh
echo 'DEV_LOGIN=1' > .dev.vars   # adds a "Dev sign-in" button to Trace, local only
npx wrangler dev
```

## Hosting (Cloudflare)

Deployed by Cloudflare Workers Builds from `main` with `npx wrangler deploy`. `wrangler.jsonc` serves `public/` as static files and runs `src/worker.js` for `/api/*` only.

- **Database:** Cloudflare D1 (`kids`), bound as `DB`. The Worker creates its tables on first use (`users`, `identities`, `sessions`, `drawings`, `usage`, `app_state`, `my_animals`) and adds `drawings.client_id` to older databases.
- **Apple sign-in:** web flow with no Apple script and no Apple private key. `public/shared/apple.js` sets a short `apple_state` cookie and sends the browser to Apple; Apple posts back to `/api/auth/apple/callback`, which checks the ID token against Apple's public keys (audience = the Services ID, nonce = the cookie), starts the session and returns to the app that asked. The Services ID goes in `APPLE_CLIENT_ID` in `wrangler.jsonc` (empty hides the button). In the Apple Developer account the Services ID needs domain `kids.sauravsood.com` and return URL `https://kids.sauravsood.com/api/auth/apple/callback`.
- **One account, two sign-ins:** a new sign-in whose provider says the email is verified joins the existing account with that email (table `identities`), so Google on one device and Apple on another see the same drawings. Apple's "Hide my email" relay addresses won't match, so those get their own account.
- **Google sign-in:** a Google OAuth *Web application* client with `https://kids.sauravsood.com` as an authorised JavaScript origin. Its client ID goes in `GOOGLE_CLIENT_ID` in `wrangler.jsonc`. Trace moving to `/trace/` doesn't change the origin, so nothing changes here.
- Sessions are random tokens in an HttpOnly cookie (`Path=/`), stored hashed in D1.
- **Analytics:** every page carries GA4 `G-K71K5101R8` with Google signals and ad personalisation off. Trace sends its own `page_view` per screen with readable paths (`/trace/history`, `/trace/draw/<animal>`, `/trace/drawing/view` with no drawing ids), so GA4's "page changes based on browser history events" setting should stay off.

## Feedback bubble (all of sauravsood.com)

A small chat bubble on every page of sauravsood.com and its subdomains takes an Idea / Issue / Other, a name, an email and a comment. This Worker hosts it for all of them.

- **Add it to any page** on any `*.sauravsood.com` site with one line before `</body>`:
  `<script src="https://kids.sauravsood.com/feedback/bubble.js" defer></script>`.
  Options go on that tag: `data-corner` (`bottom-right` default, `bottom-left`, `top-right`, `top-left`), `data-color` and `data-ink` (bubble and icon colours), `data-accent` (Send button), `data-size`, `data-opacity`, and `data-grownup` (ask the grown-up sum first).
- **Kids site:** `public/shared/grownup.js` adds the bubble itself, small and pale, on the hub and each app's front page, behind the grown-up sum. It stays off the full-screen apps (`/…/app/`, `/sky/view/`, `/dino/museum/`).
- **Widget:** our fork of [Feedback Fin](https://github.com/rowyio/feedbackfin) (Apache-2.0), built to `public/feedback/feedbackfin.js`. The changes (floating bubble, name and email fields, honeypot, `beforeOpen` hook, inline errors, no outside links) are in `third_party/feedbackfin.patch`, on top of rowyio/feedbackfin `f6eea5a`. To rebuild: apply the patch, `npm install --ignore-scripts`, `node generate-form-html.js`, `npx microbundle --define process.env.NODE_ENV=production`, then copy `dist/index.umd.js` here.
- **API:** `POST /api/feedback` (`src/feedback.js`). It only takes requests from `https://*.sauravsood.com`, drops bots that fill the hidden field, and allows 5 submissions per visitor per hour (visitors are a daily hash of the IP, not the IP itself). Every submission is saved in the D1 table `feedback`.
- **Getting it to Claude:** with the Worker secret `FEEDBACK_GITHUB_TOKEN` set, each submission is also filed as an issue in the **private** repo in `FEEDBACK_GITHUB_REPO` (`sauravsood/site-feedback`). A scheduled task in the Claude project reads new issues and asks for accept or reject. That repo must stay private because issues include emails.

## Saved checklists (sauravsood.com pages)

`GET` / `PUT /api/lists/<id>` (`src/lists.js`) saves a small tick list for standalone pages on the main site. The first one is the Baby Prep Survival Kit at `sauravsood.com/baby-prep/`.

- No sign-in. The page makes a long random id in the visitor's browser and keeps it in their personal link (`#me=<id>`). Whoever has the id can read and write that one list.
- Only a first name and which boxes are ticked are stored (D1 table `lists`). Anything else in the request is dropped.
- It only takes requests from `https://*.sauravsood.com`, and one visitor can start 40 new lists a day.
