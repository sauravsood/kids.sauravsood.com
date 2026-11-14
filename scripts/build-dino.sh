#!/usr/bin/env bash
# Rebuild the 3D Dino museum from the fork (branch kids-sauravsood, which
# renames it to "3D Dino" as the upstream brand policy asks) and copy the
# static build into public/dino/museum/. Needs Node 22.13+ and ~2 GB of disk.
set -euo pipefail
REPO=${REPO:-https://github.com/sauravsood/prehistoric-animal-museum.git}
REF=${REF:-kids-sauravsood}
OUT="$(cd "$(dirname "$0")/.." && pwd)/public/dino/museum"
WORK=$(mktemp -d)
git clone --depth 1 --branch "$REF" "$REPO" "$WORK/dino"
cd "$WORK/dino"
npm ci
npm run build
rm -rf "$OUT" && cp -r dist "$OUT"
# The official site's crawler files and 404 page don't belong under /dino/museum/.
rm -f "$OUT/robots.txt" "$OUT/sitemap.xml" "$OUT/404.html"
echo "Built from $(git rev-parse HEAD). Update the commit in README.md."
