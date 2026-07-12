# BoardGameGuru

A RAG-based chatbot that answers natural-language questions about board game rules, grounded in official rulebook text with source citations.
**Live demo:** https://board-game-guru.vercel.app

## Stack
Python, FastAPI, OpenAI API (embeddings), Together AI (serverless Qwen2.5-7B-Instruct for live generation; LoRA fine-tuned Qwen2.5-3B-Instruct evaluated locally), Pinecone, Next.js, Tailwind CSS

## Fine-Tuning Results
LoRA fine-tuned Qwen2.5-3B-Instruct on 76 synthetic QA pairs generated from the rulebooks. On a 20-question held-out eval, graded by an LLM judge: **65% correct fine-tuned vs 50% correct base model** (same retrieved context, same judge). See `backend/eval/grading_summary.json` and `backend/pipeline/finetune/eval_results.md` for details, including methodology caveats.

## Deployment
- **Backend:** Railway (Nixpacks). Build/start commands are pinned in `nixpacks.toml` at the repo root, since `backend/requirements.txt` isn't at the repo root and Nixpacks only auto-detects a Python app there. A plain `nixPkgs = ["python311", "python311Packages.pip"]` setup also fails (`python -m pip` → "No module named pip"), because that package installs into a separate Nix store path from the interpreter's own site-packages. The working fix creates a venv via `python -m venv` (which bundles `ensurepip`), sidestepping the cross-package site-packages mismatch.
- **Frontend:** Vercel, with **Root Directory** set to `frontend` (monorepo) and `BACKEND_URL` pointing at the Railway domain.
- **CORS:** `CORS_ORIGINS_RAW` on the backend is a comma-separated list (parsed into a list at runtime), e.g. `http://localhost:3000,https://board-game-guru.vercel.app`. Not strictly load-bearing for the deployed app itself — the frontend's `/api/chat` route proxies server-side, so the browser never calls Railway directly — but keeps the API directly callable/testable.
- **Live-endpoint smoke eval:** `backend/eval/run_eval.py` runs all 20 test questions against a running `/query` endpoint (`BACKEND_URL=<url> python eval/run_eval.py`). Last run against the deployed backend: 20/20 grounded answers, 2.33s average latency.

## Local Development

### Backend
```
cd backend
python -m venv venv
source venv/Scripts/activate  # Windows Git Bash
pip install -r requirements.txt
cp ../.env.example .env  # fill in API keys
uvicorn app.main:app --reload
```

### Frontend
```
cd frontend
npm install
cp .env.local.example .env.local  # points BACKEND_URL at the local backend
npm run dev
```

### Fine-tune evaluation (optional, local only)
Comparing the LoRA adapter against the base model requires PyTorch/transformers/peft,
which the deployed backend never needs — kept in a separate venv:
```
cd backend/pipeline/finetune
py -3.11 -m venv eval_venv
source eval_venv/Scripts/activate
pip install -r eval-requirements.txt
python eval_adapter.py  # writes eval_results.md
```

## Project Structure
See `planning.md` for the full roadmap and architecture notes.
