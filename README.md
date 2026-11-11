# kids.sauravsood.com

**Trace**: kids pick an animal and trace its dotted outline in different colours. It's built for iPad and Apple Pencil, and works with a finger or mouse too.

- Plain HTML, CSS and JavaScript. No build step.
- Pencil pressure comes through Pointer Events. Strokes are shaped by [perfect-freehand](https://github.com/steveruizok/perfect-freehand) (MIT, vendored in `vendor/perfect-freehand/`).
- Palm rejection: once the Pencil has been used, finger and palm touches are ignored for a minute.
- Each animal's drawing is saved on the device (localStorage).
- Animal outlines are original drawings in `animals.js` (1000 × 1000 viewBox).
- Add it to the iPad home screen for full-screen use with no browser bars.

## Run locally

```sh
python3 -m http.server 8000
```

## Hosting (Cloudflare Pages)

Connect this repo in Cloudflare Pages with production branch `main`, no build command and output directory `/`. Then add the custom domain `kids.sauravsood.com`.
