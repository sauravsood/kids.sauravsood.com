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

## Music Lab (`/music/`)

- `public/music/index.html` shows six experiments from Chrome Music Lab as tiles: Melody Maker, Arpeggios, Chords, Piano Roll, Harmonics and Strings. Each lives in `public/music/<name>/` and its Home button goes back to `/music/`. This is the one app where sound is on, and it only starts when the child taps.
- The upstream repo is archived and built with webpack 1 and node-sass. The fork builds on Node 22 (Dart Sass, pinned loaders) and loads nothing from other sites: piano and harp samples are in `public/music/sound/` (cut from the tonejs-instruments samples with `sound/make-samples.py` in the fork), Tone.js is local, icons are plain characters and there are no web fonts. Piano Roll's microphone button is removed.
- Sound Spinner and Spectrogram are left out because they use the microphone. Song Maker, Rhythm and Kandinsky aren't in the open-source repo.
- Rebuild with `scripts/build-music.sh`. Until the fork exists, the changes are in `third_party/music-lab-kids.patch` (without the sound files).
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
- Both use the same Google sign-in and session as Trace through `public/shared/account.js` (`signedIn()`, `loadState(app)`, `saveState(app, data)`). Each app saves one JSON document per account in the D1 table `app_state` through `GET`/`PUT /api/state/<app>` (`money` or `routines`, up to 100 KB, last write wins).

## Licences

- **Stellarium Web Engine** is AGPL-3.0 (© Stellarium Labs SRL and contributors). The Planetarium page credits it, ships the licence text, and links to the source of the copy that runs here.
- **Prehistoric Animal Museum** code is AGPL-3.0-only; its writing, narration and exhibit backgrounds are CC BY-NC-SA 4.0 (non-commercial: fine for this ad-free site, but this part can't be used commercially); each 3D model keeps its own CC BY 4.0 licence; its name and logo are reserved by its brand policy. The museum's `LICENSE`, `LICENSES/` and `THIRD_PARTY_NOTICES.md` ship inside `public/dino/museum/`, and the 3D Dino page credits the original and links to the source.
- **The Evolution of Trust** is CC0 (public domain), music by Komiku (CC0); its sound effects are CC0, CC Sampling+ and CC BY-NC (fine for this ad-free site).
- **Chrome Music Lab** is Apache-2.0 and Tone.js is MIT; the piano and harp samples come from tonejs-instruments (MIT package; its samples are credited there as CC BY 3.0).
- **chessground** is GPL-3.0-or-later and **chess.js** is BSD-2-Clause; both licence files ship in `public/chess/app/vendor/`, and the chess app built on them is GPL-3.0-or-later.
- **Piskel** is Apache-2.0. **Sandspiel** is MIT. Each ships its `LICENSE` in its `app/` folder and is credited on its landing page.
- The AGPL asks that people using a modified copy over the web can get its source. Each project page links to the source of the copy running here and to this repo.

## Run locally

```sh
echo 'DEV_LOGIN=1' > .dev.vars   # adds a "Dev sign-in" button to Trace, local only
npx wrangler dev
```

## Hosting (Cloudflare)

Deployed by Cloudflare Workers Builds from `main` with `npx wrangler deploy`. `wrangler.jsonc` serves `public/` as static files and runs `src/worker.js` for `/api/*` only.

- **Database:** Cloudflare D1 (`kids`), bound as `DB`. The Worker creates its tables on first use (`users`, `sessions`, `drawings`, `usage`, `app_state`).
- **Google sign-in:** a Google OAuth *Web application* client with `https://kids.sauravsood.com` as an authorised JavaScript origin. Its client ID goes in `GOOGLE_CLIENT_ID` in `wrangler.jsonc`. Trace moving to `/trace/` doesn't change the origin, so nothing changes here.
- Sessions are random tokens in an HttpOnly cookie (`Path=/`), stored hashed in D1.
- **Analytics:** every page carries GA4 `G-K71K5101R8` with Google signals and ad personalisation off. Trace sends its own `page_view` per screen with readable paths (`/trace/history`, `/trace/draw/<animal>`, `/trace/drawing/view` with no drawing ids), so GA4's "page changes based on browser history events" setting should stay off.
