#!/usr/bin/env python3
"""Spricht eine Pino-Sprechfassung mit ElevenLabs ein (Ableitung von youtube-b17/stimmproben/sprechen.py).

Aufruf:  ELEVENLABS_API_KEY=... python3 sprechen_kinder.py SPRECHFASSUNG-01.md audio/01.mp3 [VOICE_ID]
Standardstimme: Lea (7eVMgwCnXydb3CikjV7a), Einstellungen aus STIMME.md.
Regieanweisungen werden umgesetzt: [Pause] 1 s, [lange Pause] 2.5 s, [Mitmach-Pause] 3 s,
«[lange Pause, dann 5 Sekunden nur Wind]» 3 s (der Wind kommt im Schnitt dazu); andere [..]-Anweisungen werden entfernt.
Abschnitte à max. 2500 Zeichen mit previous_text/next_text, am Ende ffmpeg-Concat. Schlüssel nur aus der Umgebung.
"""
import json, os, re, subprocess, sys, tempfile, urllib.request

KEY = os.environ["ELEVENLABS_API_KEY"]
src, out = sys.argv[1], sys.argv[2]
VOICE = sys.argv[3] if len(sys.argv) > 3 else "7eVMgwCnXydb3CikjV7a"
SETTINGS = {"stability": 0.65, "similarity_boost": 0.75, "style": 0.10, "speed": 0.88}

t = open(src, encoding="utf-8").read().split("---\n", 1)[1].rsplit("\n---\n", 1)[0]
t = t.replace("[lange Pause, dann 5 Sekunden nur Wind]", '<break time="3.0s" />')
t = t.replace("[Mitmach-Pause]", '<break time="3.0s" />')
t = t.replace("[lange Pause]", '<break time="2.5s" />').replace("[Pause]", '<break time="1.0s" />')
t = re.sub(r"\[[^\]\n]+\]\s*", "", t)  # übrige Regieanweisungen (fröhlich, langsamer, leiser) entfernen
paras = [p.strip() for p in t.split("\n\n") if p.strip()]
chunks, cur = [], ""
for p in paras:
    if cur and len(cur) + len(p) > 2500:
        chunks.append(cur); cur = ""
    cur = (cur + "\n\n" + p).strip()
chunks.append(cur)
print("Zeichen gesamt:", sum(len(c) for c in chunks))
tmp = tempfile.mkdtemp(); files = []
for i, c in enumerate(chunks):
    body = {"text": c, "model_id": "eleven_multilingual_v2", "voice_settings": SETTINGS}
    if i > 0: body["previous_text"] = chunks[i-1][-500:]
    if i < len(chunks) - 1: body["next_text"] = chunks[i+1][:300]
    req = urllib.request.Request(f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE}?output_format=mp3_44100_128",
        data=json.dumps(body).encode(), headers={"xi-api-key": KEY, "Content-Type": "application/json"})
    f = os.path.join(tmp, f"{i:02d}.mp3")
    open(f, "wb").write(urllib.request.urlopen(req, timeout=300).read())
    files.append(f); print("Abschnitt", i + 1, "von", len(chunks), len(c), "Zeichen")
os.makedirs(os.path.dirname(out) or ".", exist_ok=True)
lst = os.path.join(tmp, "list.txt")
open(lst, "w").write("".join(f"file '{f}'\n" for f in files))
subprocess.run(["ffmpeg", "-y", "-v", "error", "-f", "concat", "-safe", "0", "-i", lst, "-c", "copy", out], check=True)
print("fertig", out)
