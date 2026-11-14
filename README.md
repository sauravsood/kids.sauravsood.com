# kids.sauravsood.com

A hub of things for kids to make and explore, built for iPad first. The home page at `/` shows one big tile per project; each tile opens that project's own landing page.

| Tile | Path | What it is |
| --- | --- | --- |
| **Trace** | `/trace/` | Pick an animal and trace its dotted outline in different colours, with Apple Pencil, a finger or a mouse. |
| **Planetarium** | `/planetarium/` | A night-sky view built on [Stellarium Web Engine](https://github.com/Stellarium/stellarium-web-engine). |
| **3D Dino** | `/dino/` | Prehistoric animals in 3D, a renamed copy of the [Prehistoric Animal Museum](https://github.com/s010s/prehistoric-animal-museum) by Leon Made This. |

Everything is plain HTML, CSS and JavaScript in `public/`, with no build step for this repo. Every page has a Home button back to `/`.

## Adding a tile

Add an entry to `TILES` in `public/tiles.js` (name, path, one line of description, tint colour, inline SVG art), then put the project's landing page at `public/<path>/index.html`. Landing pages share `public/shared/kids.css`.

## Trace (`/trace/`)

- Single page that routes by `#hash`: `#history`, `#c/<group>`, `#d/<id>`, `#e/<id>`, `#<animalId>`.
- Pencil pressure comes through Pointer Events. Strokes are shaped by [perfect-freehand](https://github.com/steveruizok/perfect-freehand) (MIT, vendored in `public/trace/vendor/perfect-freehand/`).
- Palm rejection: once the Pencil has been used, finger and palm touches are ignored for a minute.
- Grown-ups sign in with Google; the kid's name, drawing count and time spent stay in the top bar. Every drawing is saved to the account with a timestamp and can be reopened from History.
- Animal outlines are original drawings in `public/trace/animals.js` (1000 × 1000 viewBox).
- Add it to the iPad home screen for full-screen use. The manifest's `start_url` and `scope` are `/trace/`, so anyone who added Trace before it moved needs to add it again.
- Old links from when Trace lived at `/` (for example `/#history` or `/#d/12`) are sent on to `/trace/#…` by a small script at the top of the hub page, because hashes never reach the server.

## Planetarium (`/planetarium/`)

- `public/planetarium/index.html` is the kid-friendly landing page. `public/planetarium/sky/` is the sky view: the engine (`engine/`, WebAssembly, about 1.3 MB), the sky data (`skydata/`, about 4.5 MB) and our own `sky.js` / `sky.css` with big buttons for lines, star pictures, ground, night and location, plus Moon, Jupiter, Orion and Big Dipper finders.
- The sky data is the small set that ships in the engine's repo (`apps/test-skydata`: bright stars, deep-sky objects, the western constellations with art, one landscape, the Milky Way, Sun and Moon textures). It fits Cloudflare's 25 MiB per-file limit, so no R2 bucket is needed.
- Location comes from the device's time zone unless a grown-up taps the location button. Daytime visits jump to 9 pm so there's something to see; the moon button switches back to "now".
- Rebuild with `scripts/build-planetarium.sh` (Emscripten 1.39.17 and scons).
- Built from Stellarium/stellarium-web-engine `2103935` (unmodified).

## 3D Dino (`/dino/`)

- `public/dino/index.html` is the landing page. `public/dino/museum/` is the museum's static build (about 420 MB: 61 GLB models, 340 narration MP3s, images). Its asset paths are relative, so it works under `/dino/museum/`. The landing button opens the English version at `/dino/museum/en/`.
- The build carries two small changes, kept in `third_party/dino-rename.patch` and on the fork's `kids-sauravsood` branch: the museum is called "3D Dino" in its header and page titles, because the upstream brand policy asks copies not to use the Prehistoric Animal Museum name or brand as their own. Attribution to Leon Made This stays everywhere.
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
