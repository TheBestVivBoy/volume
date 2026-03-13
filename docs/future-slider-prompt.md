# Future Slider Prompt

Use this prompt when adding a new slider to the `volume.vivan.site` collection:

```text
Create a new frontend-only volume slider page inside /srv/sites/volume/.

Project requirements:
- Plain HTML, CSS, and JavaScript only
- No frameworks, no backend, no analytics, no auth, no APIs
- Keep the absurd mechanic intact, but keep the UI calm, minimal, polished, and grayscale-first
- The joke must come from the mechanic, not from messy styling
- Match the existing Volume collection format

Implementation rules:
- Create the page at /srv/sites/volume/sliders/<slug>/index.html
- Reuse ../../assets/site.css for shared page chrome
- Use ../../assets/vivancodes_logo.png as the favicon / shared site image
- Include clean metadata:
  - title in the format "<Project Name> | Volume"
  - meta description
  - canonical URL
  - Open Graph / Twitter summary tags
- Add a top page header with links back to the homepage and /sliders/
- Keep the actual slider/control UI self-contained on the page
- Remove unnecessary comments
- Make it work on desktop and mobile
- Avoid console errors and obvious edge-case bugs

Collection updates:
- Add the new project card to /srv/sites/volume/index.html
- Add the new project card to /srv/sites/volume/sliders/index.html
- Add the new URL to /srv/sites/volume/sitemap.xml
- Keep copy short and serious

Output style:
- Minimal changes outside the new slider and the collection links
- Preserve the established Volume visual family
- Do not redesign existing sliders unless required for consistency or bug fixing
```
