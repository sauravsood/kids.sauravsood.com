# kids.sauravsood.com

**Trace**: kids pick an animal and trace its dotted outline in different colours. It's built for iPad and Apple Pencil, and works with a finger or mouse too.

- Plain HTML, CSS and JavaScript. No build step.
- Pencil pressure comes through Pointer Events. Strokes are shaped by [perfect-freehand](https://github.com/steveruizok/perfect-freehand) (MIT, vendored in `public/vendor/perfect-freehand/`).
- Palm rejection: once the Pencil has been used, finger and palm touches are ignored for a minute.
- Each animal's drawing is saved on the device (localStorage).
- Animal outlines are original drawings in `public/animals.js` (1000 × 1000 viewBox).
- Add it to the iPad home screen for full-screen use with no browser bars.

## Run locally

```sh
python3 -m http.server 8000 --directory public
```

## Hosting (Cloudflare)

Deployed by Cloudflare Workers Builds from `main`. `wrangler.jsonc` serves everything in `public/` as static files, so there's no build step. The deploy command is the default `npx wrangler deploy`. The custom domain is `kids.sauravsood.com`.
