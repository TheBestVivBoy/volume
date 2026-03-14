# Volume

`Vivancodes` is a frontend-only static website for a collection of intentionally inconvenient volume sliders.

The site is intended to be served at `https://vivancodes.com/`.

## What it includes

- A homepage for the collection
- A dedicated page for each slider project
- Plain HTML, CSS, and JavaScript only
- SEO basics for the homepage and every project page

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
   - Homepage JS

## GIF previews

Homepage and `/sliders/` cards also show a looping GIF preview from `assets/gifs/<slug>.gif`.

- GIF previews are used on the homepage and the `/sliders/` page.
- If a matching GIF is missing, the card stays in its current text-only layout.

## Frontend-only status

This project is frontend-only for now. There is no auth, analytics, API integration, or database layer.
