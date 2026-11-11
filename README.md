# kids.sauravsood.com

**Trace**: kids pick an animal and trace its dotted outline in different colours. It's built for iPad and Apple Pencil, and works with a finger or mouse too.

- Plain HTML, CSS and JavaScript. No build step.
- Pencil pressure comes through Pointer Events. Strokes are shaped by [perfect-freehand](https://github.com/steveruizok/perfect-freehand) (MIT, vendored in `public/vendor/perfect-freehand/`).
- Palm rejection: once the Pencil has been used, finger and palm touches are ignored for a minute.
- Grown-ups sign in with Google; the kid's name, drawing count and time spent stay in the top bar.
- Every drawing is saved to the account with a timestamp and can be reopened from History.
- Animal outlines are original drawings in `public/animals.js` (1000 × 1000 viewBox).
- Add it to the iPad home screen for full-screen use with no browser bars.

## Run locally

```sh
echo 'DEV_LOGIN=1' > .dev.vars   # adds a "Dev sign-in" button, local only
npx wrangler dev
```

## Hosting (Cloudflare)

Deployed by Cloudflare Workers Builds from `main` with `npx wrangler deploy`. `wrangler.jsonc` serves `public/` as static files and runs `src/worker.js` for `/api/*` only.

- **Database:** Cloudflare D1 (`kids`), bound as `DB`. The Worker creates its tables on first use.
- **Google sign-in:** a Google OAuth *Web application* client with `https://kids.sauravsood.com` as an authorised JavaScript origin. Its client ID goes in `GOOGLE_CLIENT_ID` in `wrangler.jsonc`.
- Sessions are random tokens in an HttpOnly cookie, stored hashed in D1.
