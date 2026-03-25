# Audio tracks

Put source `.mp3` files in [`private/audio/`](/srv/sites/volume/private/audio). The converter writes matching compressed `.m4a` files to [`assets/audio/`](/srv/sites/volume/assets/audio) and regenerates [`assets/audio/manifest.json`](/srv/sites/volume/assets/audio/manifest.json).

Convert every available source track:

```bash
python3 private/audio/convert_audio.py --overwrite
```

The converter:

- keeps the visible track name aligned with the source filename
- strips embedded artwork and metadata
- recompresses each file to streaming-friendly AAC with `+faststart`
- writes a cache-busting `version` fingerprint into the manifest

The site header reads the manifest to populate the music dropdown across every page.
