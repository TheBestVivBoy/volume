# Volume

`Volume` is a frontend-only static website for a collection of intentionally inconvenient volume sliders. The presentation stays calm, grayscale, and minimal, and the joke comes from the mechanic instead of the styling.

The site is intended to be served at `https://vivancodes.com/`.

## What it includes

- A polished homepage for the collection
- A dedicated page for each slider project
- Plain HTML, CSS, and JavaScript only
- SEO basics for the homepage and every project page

## Project structure

```text
/srv/sites/volume/
├── assets/
│   ├── site.css
│   └── vivancodes_logo.png
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
2. Add `index.html` inside that folder using an existing slider page as the template.
3. Link `../../assets/site.css` and `../../assets/vivancodes_logo.png`.
4. Keep the mechanic self-contained with plain HTML, CSS, and JavaScript.
5. Add the new project to:
   - `index.html`
   - `sliders/index.html`
   - `sitemap.xml`

## Frontend-only status

This project is frontend-only for now. There is no auth, analytics, API integration, or database layer.
