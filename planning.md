# BoardGameGuru — Planning

RAG chatbot answering natural-language questions about board game rules. Resume project targeting SWE internships, demonstrating semantic search, embeddings, RAG, and fine-tuning.

## Stack
- Backend: FastAPI (Python)
- Embeddings: OpenAI text-embedding-3-small
- Vector DB: Pinecone (free tier)
- LLM: Together AI, Llama-3.2-3B-Instruct (LoRA fine-tuned)
- QA pair generation (for fine-tuning data): OpenAI chat model
- Frontend: Next.js + Tailwind CSS + shadcn/ui
- Deployment: Railway (backend) + Vercel (frontend)

> Switched fine-tuning + generation from OpenAI to Together AI: OpenAI's self-serve
> fine-tuning API stopped accepting new orgs (May 2026) and this account had never
> run a fine-tuning job. Together AI does LoRA fine-tuning on open models with an
> OpenAI-compatible SDK, so retriever/generator code changed minimally. OpenAI is
> still used for embeddings and synthetic QA-pair generation (plain inference, no
> fine-tuning needed there).

## Games (initial 5)
Catan, Ticket to Ride, Pandemic, Carcassonne, Codenames

## Roadmap
1. Setup — repo, venv, Next.js init, API accounts
2. Data pipeline — ingest, chunk, embed → Pinecone
3. Fine-tuning — generate QA pairs, submit job (async)
4. Backend — retriever, generator, /query endpoint
5. Frontend — ChatWindow, MessageBubble, SourceCard
6. Deployment — Railway + Vercel
7. Eval + docs — test queries, README

## Status
- [x] Phase 1: repo scaffolded (backend FastAPI skeleton, frontend Next.js+Tailwind init)
- [ ] Phase 2: data pipeline
- [ ] Phase 3: fine-tuning
- [ ] Phase 4: backend RAG logic
- [ ] Phase 5: frontend UI
- [ ] Phase 6: deployment
- [ ] Phase 7: eval + docs

## Manual steps (require user action)
- Create OpenAI API key → set in backend/.env
- Create Pinecone account + API key → set in backend/.env
- Create Together AI account + API key → set in backend/.env
- Add 5 rulebook PDFs to backend/documents/
- Create Railway + Vercel accounts for deployment (Phase 6)
