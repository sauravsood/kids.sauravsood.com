#!/usr/bin/env bash
# Sets up the Trace AI server on claude-server (Ubuntu). Safe to run again.
#   git clone https://github.com/sauravsood/kids.sauravsood.com ~/kids.sauravsood.com
#   ~/kids.sauravsood.com/server/setup.sh            # voice + outlines (the live server)
#   ~/kids.sauravsood.com/server/setup.sh --songs    # also ACE-Step 1.5 for sing.py
set -euo pipefail
cd "$(dirname "$0")"

sudo apt-get update -q
sudo apt-get install -y -q ffmpeg git curl nodejs

# A swap file, so a model loading never runs the box out of memory.
if ! swapon --show | grep -q /swapfile; then
  sudo fallocate -l 4G /swapfile && sudo chmod 600 /swapfile && sudo mkswap /swapfile && sudo swapon /swapfile
  grep -q /swapfile /etc/fstab || echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
fi

command -v uv >/dev/null || curl -LsSf https://astral.sh/uv/install.sh | sh
export PATH="$HOME/.local/bin:$PATH"
uv venv --python 3.12 --allow-existing .venv
uv pip install --python .venv/bin/python -r requirements.txt --index-strategy unsafe-best-match

# Kokoro-82M v1.0 (the books' voice) as ONNX, from kokoro-onnx's releases.
mkdir -p models cache
for f in kokoro-v1.0.onnx voices-v1.0.bin; do
  [ -s "models/$f" ] || curl -fL -o "models/$f" "https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/$f"
done
# Grounding DINO tiny + SAM 2.1 small download into ~/.cache/huggingface on first start.
.venv/bin/python -c "from outline import Outliner; Outliner()"

sudo cp kids-ai.service /etc/systemd/system/kids-ai.service
sudo systemctl daemon-reload
sudo systemctl enable --now kids-ai
sudo systemctl restart kids-ai

if [ "${1:-}" = "--songs" ]; then
  ACE="$HOME/ACE-Step-1.5"
  [ -d "$ACE" ] || git clone https://github.com/ace-step/ACE-Step-1.5 "$ACE"
  (cd "$ACE" && uv sync && uv pip install faster-whisper librosa soundfile)
fi
echo "Done. Check: curl -s localhost:8000/health"
