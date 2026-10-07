# CottonScan – Cotton Leaf Disease Detection

CNN (EfficientNetB0) encoder + LSTM decoder trained with teacher forcing. FastAPI backend, React + Vite + Tailwind frontend.

## Run the backend
```bash
cd backend
python -m venv venv && venv\Scripts\activate      # Windows (use source venv/bin/activate on Mac/Linux)
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
Docs: http://localhost:8000/docs  ·  Health: http://localhost:8000/health

## Run the frontend
```bash
cd frontend
npm install
npm run dev
```
Open http://localhost:5173. To point at a deployed API, copy `.env.example` to `.env` and set `VITE_API_URL`.

## API
`POST /predict` (multipart field `file`) →
`{ disease, sequence, confidence, severity, symptoms, treatment, prevention }`

## Notes
- Preprocessing matches training: resize to 224×224, pixel range 0–255.
- Use the same TensorFlow/Keras major version as your Colab (check with `pip show tensorflow`) if the model fails to load.
- Edit `backend/treatments.json` and `frontend/src/data.js` together to change the advice text.
- Colours live in `frontend/tailwind.config.js` (`abyss`, `deep`, `panel`, `aqua`, `mist`, `magenta`, `violet`).
