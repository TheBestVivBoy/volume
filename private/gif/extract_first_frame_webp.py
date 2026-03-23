#!/usr/bin/env python3

from __future__ import annotations

import argparse
import shutil
import subprocess
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
DEFAULT_INPUT_DIR = ROOT / "assets" / "gifs"
DEFAULT_OUTPUT_DIR = ROOT / "assets" / "gifs"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description=(
            "Extract the first frame of each GIF in assets/gifs and save it as a compressed "
            "same-name WEBP file."
        )
    )
    parser.add_argument(
        "--input-dir",
        type=Path,
        default=DEFAULT_INPUT_DIR,
        help=f"Directory containing GIF files. Default: {DEFAULT_INPUT_DIR}",
    )
    parser.add_argument(
        "--output-dir",
        type=Path,
        default=DEFAULT_OUTPUT_DIR,
        help=f"Directory for generated WEBP files. Default: {DEFAULT_OUTPUT_DIR}",
    )
    parser.add_argument(
        "--width",
        type=int,
        default=640,
        help="Output width in pixels. Default: 640",
    )
    parser.add_argument(
        "--height",
        type=int,
        default=400,
        help="Output height in pixels. Default: 400",
    )
    parser.add_argument(
        "--background",
        default="white",
        help="Padding background color for aspect-ratio fitting. Default: white",
    )
    parser.add_argument(
        "--quality",
        type=int,
        default=28,
        help="WEBP quality (0-100). Lower is smaller. Default: 28",
    )
    parser.add_argument(
        "--compression-level",
        type=int,
        default=6,
        help="WEBP compression level (0-6). Higher is smaller/slower. Default: 6",
    )
    parser.add_argument(
        "--overwrite",
        action="store_true",
        help="Replace existing WEBP files.",
    )
    return parser.parse_args()


def ensure_ffmpeg() -> None:
    if shutil.which("ffmpeg") is None:
        print("ffmpeg is required but was not found on PATH.", file=sys.stderr)
        raise SystemExit(1)


def build_frame_filter(width: int, height: int, background: str) -> str:
    return (
        f"scale={width}:{height}:flags=lanczos:force_original_aspect_ratio=decrease,"
        f"pad={width}:{height}:(ow-iw)/2:(oh-ih)/2:{background}"
    )


def run_ffmpeg(
    gif_path: Path,
    webp_path: Path,
    width: int,
    height: int,
    background: str,
    quality: int,
    compression_level: int,
) -> None:
    frame_filter = build_frame_filter(width, height, background)

    cmd = [
        "ffmpeg",
        "-y",
        "-i",
        str(gif_path),
        "-vf",
        frame_filter,
        "-frames:v",
        "1",
        "-c:v",
        "libwebp",
        "-q:v",
        str(quality),
        "-compression_level",
        str(compression_level),
        "-preset",
        "picture",
        "-an",
        str(webp_path),
    ]

    subprocess.run(cmd, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)


def main() -> int:
    args = parse_args()
    ensure_ffmpeg()

    input_dir = args.input_dir.resolve()
    output_dir = args.output_dir.resolve()

    input_dir.mkdir(parents=True, exist_ok=True)
    output_dir.mkdir(parents=True, exist_ok=True)

    gif_files = sorted(input_dir.glob("*.gif"))
    if not gif_files:
        print(f"No GIF files found in {input_dir}")
        return 0

    failures = []

    for gif_path in gif_files:
        webp_path = output_dir / f"{gif_path.stem}.webp"

        if webp_path.exists() and not args.overwrite:
            print(f"Skipping {gif_path.name}: {webp_path.name} already exists")
            continue

        try:
            run_ffmpeg(
                gif_path,
                webp_path,
                args.width,
                args.height,
                args.background,
                args.quality,
                args.compression_level,
            )
            size_kb = webp_path.stat().st_size / 1024
            print(f"Created {webp_path.name} from {gif_path.name} ({size_kb:.1f} KB)")
        except subprocess.CalledProcessError as exc:
            failures.append(gif_path.name)
            print(f"Failed to convert {gif_path.name}", file=sys.stderr)
            if exc.stderr:
                print(exc.stderr.decode("utf-8", errors="replace"), file=sys.stderr)

    if failures:
        print(f"Conversion failed for {len(failures)} file(s): {', '.join(failures)}", file=sys.stderr)
        return 1

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
