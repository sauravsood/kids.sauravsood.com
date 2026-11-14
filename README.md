# kids.sauravsood.com

A home page of calm, hands-on things for kids, built for iPad first. Apps are grouped into four categories on `/`, and every app has its own landing page (name, one line, suggested age, a big Start button, credits at the bottom) at a clean URL.

| Category | App | Path | Status |
| --- | --- | --- | --- |
| Creativity | Trace | `/trace/` | Live |
| | Drawings Come Alive | `/alive` | Coming soon |
| | Pixel Art | `/pixel` | Coming soon |
| | Music Lab | `/music` | Coming soon |
| Explore | Planetarium | `/sky/` | Live (was `/planetarium/`, which redirects) |
| | 3D Dino | `/dino/` | Live |
| | Sand Lab | `/sand` | Coming soon |
| Puzzles & Thinking | Trust Game | `/trust` | Coming soon |
| | Chess | `/chess` | Coming soon |
| Life Skills | Pocket Money | `/money` | Coming soon |
| | My Routines | `/routines` | Coming soon |

Everything is plain HTML, CSS and JavaScript in `public/`, with no build step for this repo. Landing pages share `public/shared/kids.css`.

## Calm by design

- No countdown timers, streaks that break, leaderboards, loot, ads or autoplay. Sound is off by default (Music Lab will be the exception).
- Every app has a Home button back to `/`, and a natural stopping point.
- **Links that leave the site need a grown-up.** `public/shared/grownup.js` catches taps on links to other sites and asks a two-digit sum first. Add it to any page with `<script src="/shared/grownup.js" defer></script>`.
- Nothing a child makes is shared publicly.

## Adding or shipping an app

Apps are listed in `CATEGORIES` in `public/tiles.js`. A new app goes in with `soon: true` and no `href`, so it shows as a "Coming soon" tile that can't be tapped. To ship it, drop `soon`, add `href`, and put its landing page at `public/<slug>/index.html`.

Redirects for moved pages live in `public/_redirects`.

## Trace (`/trace/`)

- Single page that routes by `#hash`: `#history`, `#c/<group>`, `#d/<id>`, `#e/<id>`, `#<animalId>`.
- Pencil pressure comes through Pointer Events. Strokes are shaped by [perfect-freehand](https://github.com/steveruizok/perfect-freehand) (MIT, vendored in `public/trace/vendor/perfect-freehand/`).
- Palm rejection: once the Pencil has been used, finger and palm touches are ignored for a minute.
- Grown-ups sign in with Google; the kid's name, drawing count and time spent stay in the top bar. Every drawing is saved to the account with a timestamp and can be reopened from History.
- Animal outlines are original drawings in `public/trace/animals.js` (1000 × 1000 viewBox).
- Add it to the iPad home screen for full-screen use. The manifest's `start_url` and `scope` are `/trace/`, so anyone who added Trace before it moved needs to add it again.
- Old links from when Trace lived at `/` (for example `/#history` or `/#d/12`) are sent on to `/trace/#…` by a small script at the top of the hub page, because hashes never reach the server.

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

## Licences

- **Stellarium Web Engine** is AGPL-3.0 (© Stellarium Labs SRL and contributors). The Planetarium page credits it, ships the licence text, and links to the source of the copy that runs here.
- **Prehistoric Animal Museum** code is AGPL-3.0-only; its writing, narration and exhibit backgrounds are CC BY-NC-SA 4.0 (non-commercial: fine for this ad-free site, but this part can't be used commercially); each 3D model keeps its own CC BY 4.0 licence; its name and logo are reserved by its brand policy. The museum's `LICENSE`, `LICENSES/` and `THIRD_PARTY_NOTICES.md` ship inside `public/dino/museum/`, and the 3D Dino page credits the original and links to the source.
- The AGPL asks that people using a modified copy over the web can get its source. Each project page links to the source of the copy running here and to this repo.

## Run locally

```sh
echo 'DEV_LOGIN=1' > .dev.vars   # adds a "Dev sign-in" button to Trace, local only
npx wrangler dev
```

## Hosting (Cloudflare)

Deployed by Cloudflare Workers Builds from `main` with `npx wrangler deploy`. `wrangler.jsonc` serves `public/` as static files and runs `src/worker.js` for `/api/*` only.

- **Database:** Cloudflare D1 (`kids`), bound as `DB`. The Worker creates its tables on first use.
- **Google sign-in:** a Google OAuth *Web application* client with `https://kids.sauravsood.com` as an authorised JavaScript origin. Its client ID goes in `GOOGLE_CLIENT_ID` in `wrangler.jsonc`. Trace moving to `/trace/` doesn't change the origin, so nothing changes here.
- Sessions are random tokens in an HttpOnly cookie (`Path=/`), stored hashed in D1.
- **Analytics:** every page carries GA4 `G-K71K5101R8` with Google signals and ad personalisation off. Trace sends its own `page_view` per screen with readable paths (`/trace/history`, `/trace/draw/<animal>`, `/trace/drawing/view` with no drawing ids), so GA4's "page changes based on browser history events" setting should stay off.
