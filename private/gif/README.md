# GIF previews

Put source `.mp4` files in [`mp4/`](/srv/sites/volume/private/gif/mp4). The converter writes matching `.gif` files to [`assets/gifs/`](/srv/sites/volume/assets/gifs).

Generate GIFs:

```bash
python3 private/gif/convert_gifs.py --overwrite
```

Generate first-frame WEBP posters from GIFs (same filename, much smaller):

```bash
python3 private/gif/extract_first_frame_webp.py --overwrite
```

By default, both scripts output card-ready previews at `640x400` to match the homepage and `/sliders/` preview aspect ratio.

Each output file name matches the source slider slug:

- `private/gif/mp4/alphabetical.mp4` -> `assets/gifs/alphabetical.gif`
- `assets/gifs/alphabetical.gif` -> `assets/gifs/alphabetical.webp`

The homepage and `/sliders/` pages now load `.webp` posters first and only request the `.gif` on hover/focus/touch.
