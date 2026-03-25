#!/usr/bin/env python3

from __future__ import annotations

import argparse
from datetime import datetime, timezone
import hashlib
import json
import re
import shutil
import subprocess
import sys
import unicodedata
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
DEFAULT_INPUT_DIR = ROOT / "private" / "audio"
DEFAULT_OUTPUT_DIR = ROOT / "assets" / "audio"
DEFAULT_MANIFEST_PATH = DEFAULT_OUTPUT_DIR / "manifest.json"
SUPPORTED_EXTENSIONS = (".mp3",)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description=(
            "Convert every source MP3 in private/audio into a sanitized, compressed "
            "streaming file in assets/audio and regenerate the audio manifest."
        )
    )
    parser.add_argument(
        "--input-dir",
        type=Path,
        default=DEFAULT_INPUT_DIR,
        help=f"Directory containing source MP3 files. Default: {DEFAULT_INPUT_DIR}",
    )
    parser.add_argument(
        "--output-dir",
        type=Path,
        default=DEFAULT_OUTPUT_DIR,
        help=f"Directory for generated audio files. Default: {DEFAULT_OUTPUT_DIR}",
    )
    parser.add_argument(
        "--manifest-path",
        type=Path,
        default=DEFAULT_MANIFEST_PATH,
        help=f"Manifest output path. Default: {DEFAULT_MANIFEST_PATH}",
    )
    parser.add_argument(
        "--bitrate",
        default="64k",
        help="Target AAC bitrate. Default: 64k",
    )
    parser.add_argument(
        "--overwrite",
        action="store_true",
        help="Replace existing converted audio files.",
    )
    return parser.parse_args()


def ensure_ffmpeg_tools() -> None:
    for binary in ("ffmpeg", "ffprobe"):
        if shutil.which(binary) is None:
            print(f"{binary} is required but was not found on PATH.", file=sys.stderr)
            raise SystemExit(1)


def slugify(value: str) -> str:
    ascii_text = unicodedata.normalize("NFKD", value).encode("ascii", "ignore").decode("ascii")
    slug = re.sub(r"[^a-zA-Z0-9]+", "-", ascii_text).strip("-").lower()
    return slug or "track"


def sanitize_stem(stem: str) -> str:
    normalized = unicodedata.normalize("NFKC", stem)
    cleaned = re.sub(r"[^\w\s\-()]+", " ", normalized, flags=re.UNICODE)
    cleaned = re.sub(r"\s+", " ", cleaned).strip(" ._-")
    return cleaned or "Track"


def unique_output_path(base_stem: str, output_dir: Path, used_paths: set[Path]) -> Path:
    candidate = output_dir / f"{base_stem}.m4a"
    suffix = 2

    while candidate in used_paths:
        candidate = output_dir / f"{base_stem} {suffix}.m4a"
        suffix += 1

    used_paths.add(candidate)
    return candidate


def convert_source(source_path: Path, output_path: Path, bitrate: str) -> None:
    command = [
        "ffmpeg",
        "-y",
        "-i",
        str(source_path),
        "-map",
        "0:a:0",
        "-vn",
        "-dn",
        "-sn",
        "-map_metadata",
        "-1",
        "-map_chapters",
        "-1",
        "-c:a",
        "aac",
        "-b:a",
        bitrate,
        "-movflags",
        "+faststart",
        str(output_path),
    ]

    subprocess.run(command, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)


def probe_duration_seconds(audio_path: Path) -> float:
    command = [
        "ffprobe",
        "-v",
        "error",
        "-show_entries",
        "format=duration",
        "-of",
        "json",
        str(audio_path),
    ]
    result = subprocess.run(command, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    payload = json.loads(result.stdout.decode("utf-8"))
    duration = float(payload["format"]["duration"])
    return round(duration, 3)


def fingerprint_file(file_path: Path) -> str:
    digest = hashlib.sha256()
    with file_path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()[:12]


def build_manifest(tracks: list[dict[str, object]], manifest_path: Path) -> None:
    manifest = {
        "generatedAt": datetime.now(timezone.utc)
        .replace(microsecond=0)
        .isoformat()
        .replace("+00:00", "Z"),
        "tracks": tracks,
    }
    manifest_path.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")


def main() -> int:
    args = parse_args()
    ensure_ffmpeg_tools()

    input_dir = args.input_dir.resolve()
    output_dir = args.output_dir.resolve()
    manifest_path = args.manifest_path.resolve()

    input_dir.mkdir(parents=True, exist_ok=True)
    output_dir.mkdir(parents=True, exist_ok=True)
    manifest_path.parent.mkdir(parents=True, exist_ok=True)

    source_files = sorted(
        path
        for path in input_dir.iterdir()
        if path.is_file() and path.suffix.lower() in SUPPORTED_EXTENSIONS
    )

    if not source_files:
        print(f"No source MP3 files found in {input_dir}")
        build_manifest([], manifest_path)
        return 0

    failures: list[str] = []
    tracks: list[dict[str, object]] = []
    used_output_paths: set[Path] = set()

    for source_path in source_files:
        display_name = sanitize_stem(source_path.stem)
        output_path = unique_output_path(display_name, output_dir, used_output_paths)

        try:
            if output_path.exists() and not args.overwrite:
                print(f"Skipping {source_path.name}: {output_path.name} already exists")
            else:
                convert_source(source_path, output_path, args.bitrate)
                size_kb = output_path.stat().st_size / 1024
                print(f"Created {output_path.name} from {source_path.name} ({size_kb:.1f} KB)")

            tracks.append(
                {
                    "id": slugify(output_path.stem),
                    "name": display_name,
                    "file": output_path.name,
                    "mime": "audio/mp4",
                    "duration": probe_duration_seconds(output_path),
                    "bytes": output_path.stat().st_size,
                    "version": fingerprint_file(output_path),
                }
            )
        except subprocess.CalledProcessError as exc:
            failures.append(source_path.name)
            print(f"Failed to convert {source_path.name}", file=sys.stderr)
            if exc.stderr:
                print(exc.stderr.decode("utf-8", errors="replace"), file=sys.stderr)

    build_manifest(tracks, manifest_path)
    print(f"Wrote manifest: {manifest_path}")

    if failures:
        print(f"Conversion failed for {len(failures)} file(s): {', '.join(failures)}", file=sys.stderr)
        return 1

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
