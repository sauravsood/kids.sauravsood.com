#!/usr/bin/env bash
# Rebuild the Music Lab experiments from the fork (branch kids-sauravsood,
# which makes them self-contained and buildable on current Node) and copy
# them into public/music/<name>/. Needs Node 22.
set -euo pipefail
REPO=${REPO:-https://github.com/sauravsood/chrome-music-lab.git}
REF=${REF:-kids-sauravsood}
OUT="$(cd "$(dirname "$0")/.." && pwd)/public/music"
WORK=$(mktemp -d)
git clone --depth 1 --branch "$REF" "$REPO" "$WORK/music"
cd "$WORK/music"
HOME_TAG='<script src="/shared/app-home.js" data-corner="top-left" data-home="/music/" defer></script>'

for d in melodymaker arpeggios chords pianoroll; do
  (cd "$d" && npm install --no-audit --no-fund --legacy-peer-deps && PROD_ENV=1 ./node_modules/.bin/webpack)
  mkdir -p "$OUT/$d"
  cp -r "$d/build" "$d/index.html" "$OUT/$d/"
done
cp -r melodymaker/images "$OUT/melodymaker/"
cp -r arpeggios/images "$OUT/arpeggios/"
mkdir -p "$OUT/pianoroll/midi" && cp pianoroll/midi/*.json "$OUT/pianoroll/midi/"

# Harmonics and Strings are one plain-JS app with two modes.
for m in harmonics strings; do
  mkdir -p "$OUT/$m" && cp -r "harmonics & strings/"* "$OUT/$m/"
done
sed -i 's#<script src="js/third-party/Tone.min.js">#<script>window.MUSIC_MODE=0</script>\n    <script src="js/third-party/Tone.min.js">#' "$OUT/harmonics/index.html"
sed -i 's#<title>Harmonics</title>#<title>Strings</title>#' "$OUT/strings/index.html"

# Shared piano and harp samples, and the licence.
mkdir -p "$OUT/sound" && cp -r sound/piano sound/harp "$OUT/sound/"
cp LICENSE "$OUT/LICENSE"

# Kids-site addition: a Home button back to /music/ and the grown-up check.
for f in "$OUT"/*/index.html; do
  grep -q app-home.js "$f" || sed -i "s#</body>#$HOME_TAG\n</body>#" "$f"
done
echo "Built from $(git rev-parse HEAD). Update the commit in README.md."
