# Volume

`Volume` is a frontend-only static website for a collection of intentionally inconvenient volume sliders. The presentation stays calm, grayscale, and minimal; the joke comes from the control mechanic rather than the interface styling.

The site is intended to be served at `https://volume.vivan.site/`.

## What it includes

- A polished homepage for the collection
- A dedicated page for each slider project
- Plain HTML, CSS, and JavaScript only
- SEO basics for the homepage and every project page
- Static deployment config for Nginx

## Project structure

```text
/srv/sites/volume/
├── assets/
│   ├── site.css
│   └── vivancodes_logo.png
├── docs/
│   └── future-slider-prompt.md
├── sliders/
│   ├── alphabetical/index.html
│   ├── drag/index.html
│   ├── inertia/index.html
│   ├── spinner/index.html
│   ├── tictactoe/index.html
│   └── index.html
├── index.html
├── robots.txt
├── sitemap.xml
├── volume.vivan.site.conf
└── README.md
```

## Design idea

- Calm presentation
- Minimal chrome
- Grayscale-first palette
- Consistent project family
- Absurd interaction mechanics preserved

## How the collection works

Each project is its own standalone static page under `sliders/<slug>/index.html`. The homepage and `/sliders/` page link directly to those folders, which keeps the public URLs clean.

## Adding a new slider

1. Create a new folder at `sliders/<slug>/`.
2. Add `index.html` inside that folder using the existing project-page structure.
3. Link `../../assets/site.css` and `../../assets/vivancodes_logo.png`.
4. Keep the mechanic self-contained with plain HTML, CSS, and JavaScript.
5. Add the new project to:
   - `index.html`
   - `sliders/index.html`
   - `sitemap.xml`
6. Reuse the prompt in `docs/future-slider-prompt.md` to keep formatting consistent.

## Deployment notes

- Nginx loads site configs from `/srv/sites/*/*.conf` on this server.
- This project ships with `volume.vivan.site.conf`.
- The config is static-site only: no backend, no API routes, no frameworks, no database.
- The TLS pattern mirrors the existing `ssh.vivan.site` setup by using the same Cloudflare origin certificate paths.

## Git and sync

The expected GitHub remote is:

`https://github.com/TheBestVivBoy/volume`

## Frontend-only status

This project is frontend-only for now. There is no backend, auth, analytics, API integration, or database layer.
