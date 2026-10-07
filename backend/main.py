import io, json, os
import numpy as np
from PIL import Image, UnidentifiedImageError
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import keras

HERE = os.path.dirname(os.path.abspath(__file__))
meta = json.load(open(os.path.join(HERE, "meta.json")))
treatments = json.load(open(os.path.join(HERE, "treatments.json")))
vocab, CLASSES = meta["vocab"], meta["class_names"]
IMG = tuple(meta["img_size"]); T = meta["max_len"] - 1
PAD, START, END = 0, 1, 2
name_to_class = {c.lower(): c for c in CLASSES}

model = keras.models.load_model(os.path.join(HERE, "cotton_encoder_decoder.keras"))  # loaded once

app = FastAPI(title="Cotton Leaf Disease API")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

def generate(arr):
    """Autoregressive greedy decoding (no teacher forcing at inference)."""
    dec = np.zeros((1, T), dtype="int32"); dec[0, 0] = START
    words, probs = [], []
    for t in range(T):
        p = model([arr, dec], training=False).numpy()[0, t]
        tok = int(p.argmax())
        if tok in (END, PAD): break
        words.append(vocab[tok]); probs.append(float(p[tok]))
        if t + 1 < T: dec[0, t + 1] = tok
    return words, probs

@app.get("/health")
def health(): return {"status": "ok"}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        img = Image.open(io.BytesIO(await file.read())).convert("RGB").resize(IMG)
    except (UnidentifiedImageError, OSError):
        raise HTTPException(400, "That file is not a readable image. Upload a JPG or PNG.")
    arr = np.array(img, dtype="float32")[None]      # 0-255, same as training
    words, probs = generate(arr)
    label = name_to_class.get(" ".join(words))
    if label is None:
        raise HTTPException(422, "The model could not match this image to a known class. Try a clearer, closer photo of one leaf.")
    return {"disease": label, "sequence": ["<start>", *words, "<end>"],
            "confidence": round(float(np.mean(probs)), 4), **treatments[label]}
