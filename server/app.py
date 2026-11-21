"""Trace's AI helper, run on claude-server behind the Cloudflare tunnel
(https://ai.sauravsood.com -> http://localhost:8000).

Two live jobs, both called only through the kids Worker (/api/ai/*):

  POST /say      {"text": "..."}         -> audio/mpeg, the storybook voice
  POST /outline  JPEG body (<= 1.5 MB)   -> JSON animal masks

Songs are not made here live; sing.py makes them once ahead of time.

Who may call: the Worker forwards the grown-up's session token in
X-Kids-Session, and this server checks it against kids.sauravsood.com/api/me
(cached for 10 minutes). Nothing is stored: photos stay in memory for one
request, and spoken lines are cached on disk by a hash of their text only.
"""

import asyncio
import hashlib
import os
import time
from collections import defaultdict, deque

import httpx
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse, Response

KIDS = os.environ.get("KIDS_ORIGIN", "https://kids.sauravsood.com")
COOKIE = os.environ.get("KIDS_SESSION_COOKIE", "trace_session")
OPEN = os.environ.get("AI_OPEN") == "1"  # local testing only: skips the session check
MAX_PHOTO = 1_500_000
MAX_TEXT = 400

app = FastAPI(title="Trace AI", docs_url=None, redoc_url=None, openapi_url=None)

_voice = None
_outline = None
_lock = {"say": asyncio.Lock(), "outline": asyncio.Lock()}  # one at a time per model
_seen: dict[str, float] = {}  # session hash -> verified until
_calls: dict[str, deque] = defaultdict(deque)


def voice():
    global _voice
    if _voice is None:
        from voice import Voice
        _voice = Voice()
    return _voice


def outliner():
    global _outline
    if _outline is None:
        from outline import Outliner
        _outline = Outliner()
    return _outline


async def check(request: Request, job: str, per_hour: int):
    if OPEN:
        return "open"
    token = request.headers.get("X-Kids-Session", "")
    if not token or len(token) > 200:
        raise HTTPException(401, "Not signed in")
    key = hashlib.sha256(token.encode()).hexdigest()
    if _seen.get(key, 0) < time.time():
        async with httpx.AsyncClient(timeout=8) as client:
            r = await client.get(f"{KIDS}/api/me", headers={"Cookie": f"{COOKIE}={token}"})
        if r.status_code != 200:
            raise HTTPException(401, "Not signed in")
        _seen[key] = time.time() + 600
    calls = _calls[f"{job}:{key}"]
    now = time.time()
    while calls and calls[0] < now - 3600:
        calls.popleft()
    if len(calls) >= per_hour:
        raise HTTPException(429, "Slow down")
    calls.append(now)
    return key


@app.get("/health")
def health():
    return {"ok": True, "voice": _voice is not None, "outline": _outline is not None}


@app.post("/say")
async def say(request: Request):
    await check(request, "say", 300)
    body = await request.json()
    text = str(body.get("text", "")).strip()
    if not text or len(text) > MAX_TEXT:
        raise HTTPException(400, "Text is empty or too long")
    async with _lock["say"]:
        mp3 = await asyncio.to_thread(voice().mp3, text)
    return Response(mp3, media_type="audio/mpeg", headers={"Cache-Control": "private, max-age=31536000"})


@app.post("/outline")
async def outline(request: Request):
    await check(request, "outline", 60)
    data = await request.body()
    if not data or len(data) > MAX_PHOTO:
        raise HTTPException(400, "Photo is missing or too big")
    async with _lock["outline"]:
        result = await asyncio.to_thread(outliner().masks, data)
    return JSONResponse(result, headers={"Cache-Control": "no-store"})


@app.on_event("startup")
async def warm():
    # Load the models in the background so the first child doesn't wait.
    async def load():
        for f in (voice, outliner):
            try:
                await asyncio.to_thread(f)
            except Exception as e:  # noqa: BLE001 - keep serving whatever loaded
                print("model failed to load:", f.__name__, e, flush=True)
    asyncio.create_task(load())
