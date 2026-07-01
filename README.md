# BoardGameGuru

A RAG-based chatbot that answers natural-language questions about board game rules, grounded in official rulebook text with source citations.

## Stack
Python, FastAPI, OpenAI API (embeddings), Together AI (serverless Qwen2.5-7B-Instruct for live generation; LoRA fine-tuned Qwen2.5-3B-Instruct evaluated locally), Pinecone, Next.js, Tailwind CSS

## Fine-Tuning Results
LoRA fine-tuned Qwen2.5-3B-Instruct on 76 synthetic QA pairs generated from the rulebooks. On a 20-question held-out eval, graded by an LLM judge: **65% correct fine-tuned vs 50% correct base model** (same retrieved context, same judge). See `backend/eval/grading_summary.json` and `backend/pipeline/finetune/eval_results.md` for details, including methodology caveats.

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
