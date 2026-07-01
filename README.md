# BoardGameGuru

A RAG-based chatbot that answers natural-language questions about board game rules, grounded in official rulebook text with source citations.

## Stack
Python, FastAPI, OpenAI API (embeddings), Together AI (LoRA fine-tuned Llama-3.2-3B-Instruct), Pinecone, Next.js, Tailwind CSS

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
npm run dev
```

## Project Structure
See `planning.md` for the full roadmap and architecture notes.
