#!/usr/bin/env bash
# Rebuild the Planetarium's sky engine from the fork and copy it into
# public/planetarium/sky/. Needs git, scons and Emscripten 1.39.17
# (newer Emscripten releases reject the engine's build flags):
#   git clone https://github.com/emscripten-core/emsdk && cd emsdk
#   ./emsdk install 1.39.17 && ./emsdk activate 1.39.17 && source ./emsdk_env.sh
set -euo pipefail
REPO=${REPO:-https://github.com/sauravsood/stellarium-web-engine.git}
REF=${REF:-master}
OUT="$(cd "$(dirname "$0")/.." && pwd)/public/planetarium/sky"
WORK=$(mktemp -d)
git clone --depth 1 --branch "$REF" "$REPO" "$WORK/swe"
cd "$WORK/swe"
make js
cp build/stellarium-web-engine.js build/stellarium-web-engine.wasm "$OUT/engine/"
rm -rf "$OUT/skydata" && mkdir -p "$OUT/skydata/skycultures"
cp -r apps/test-skydata/{stars,dso,landscapes,surveys} "$OUT/skydata/"
cp -r apps/test-skydata/skycultures/western "$OUT/skydata/skycultures/"
cp apps/simple-html/static/fonts/Roboto-{Regular,Bold}.ttf "$OUT/fonts/"
cp LICENSE-AGPL-3.0.txt "$OUT/"
echo "Built from $(git rev-parse HEAD). Update the commit in README.md."
