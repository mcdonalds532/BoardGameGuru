# BoardGameGuru — Planning

RAG chatbot answering natural-language questions about board game rules. Resume project targeting SWE internships, demonstrating semantic search, embeddings, RAG, and fine-tuning.

## Stack
- Backend: FastAPI (Python)
- Embeddings: OpenAI text-embedding-3-small
- Vector DB: Pinecone (free tier)
- Live generation: Together AI serverless, Qwen/Qwen2.5-7B-Instruct-Turbo
- Fine-tuning: Together AI LoRA on Qwen/Qwen2.5-3B-Instruct — adapter downloaded and evaluated locally, not served live (see below)
- QA pair generation (for fine-tuning data): OpenAI chat model
- Frontend: Next.js + Tailwind CSS + shadcn/ui
- Deployment: Railway (backend) + Vercel (frontend)

> Switched fine-tuning + generation from OpenAI to Together AI: OpenAI's self-serve
> fine-tuning API stopped accepting new orgs (May 2026) and this account had never
> run a fine-tuning job.
>
> Serving a Together fine-tuned model live turned out to require a $6.49/hr
> dedicated endpoint — not viable for an always-on resume demo, and there's no
> documented/reliable way to confirm which base models qualify for cheap
> serverless-LoRA serving in advance (two guesses based on catalog naming were
> both wrong and cost real money to learn). Fireworks AI has the same
> dedicated-endpoint requirement, so this isn't Together-specific.
>
> Resolution: `live_generation_model` (Qwen2.5-7B-Instruct-Turbo) serves the
> live /query endpoint via confirmed-working serverless inference. The LoRA
> fine-tune targets a separate `finetune_base_model` (Qwen2.5-3B-Instruct) and
> is downloaded (`pipeline/finetune/download_adapter.py`) for local
> evaluation/before-after comparison instead of live serving. This is a
> deliberate cost/tradeoff decision, documented here for the resume story.

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
- [x] Phase 2: data pipeline (pdfplumber ingest, token-based chunker, OpenAI embeddings → Pinecone; 134 chunks across 5 games, retrieval sanity-checked)
- [x] Phase 3: fine-tuning — 76 QA pairs generated + manually reviewed (4 bad ones from garbled PDF pages removed). LoRA job (ft-8e0c91f5-5597, base model Qwen/Qwen2.5-3B-Instruct, ~$4) completed; adapter downloaded to `backend/pipeline/finetune/adapter/` (437MB, gitignored). Local before/after eval (`eval_adapter.py`, separate `eval_venv` with torch/transformers/peft — see README) on 10 fresh held-out questions: fine-tuned answers are consistently far more concise (matches QA-pair training style), and on 2/10 questions the base model hedged/refused ("no specific limit given") while the fine-tuned model answered correctly and confidently (e.g. Pandemic's 3-cube-per-city limit). One honest caveat: on the "chain reaction outbreak trigger" question the fine-tuned answer sounds confident but is imprecise — fine-tuning clearly increased concision/confidence, not uniformly factual accuracy. Full comparison in `backend/pipeline/finetune/eval_results.md`.
- [x] Phase 4: backend RAG logic — retriever/generator/query endpoint tested end-to-end via real HTTP requests against live Pinecone + Together. `top_k` bumped from 5→10 after finding a relevant chunk ranked 14th for one test query (known limitation: no reranking, occasional cross-game bleed-through when no `game` filter is passed, some source PDFs have mojibake from font-encoding issues — worth mentioning in Phase 7 docs, not blocking).
- [x] Phase 5: frontend UI — ChatWindow (game-filter badges + input), MessageBubble, SourceCard, GameBadge components; `/api/chat` Next.js route proxies to the FastAPI backend (keeps `BACKEND_URL` server-side, avoids CORS). No shadcn/ui installed — hand-built with Tailwind to keep scope reasonable. Verified in an actual headless browser (Playwright) end-to-end: typed a question, got a grounded answer, confirmed no console errors. Capped displayed source cards to 4 (retrieval still uses top_k=10 for the LLM, but showing all 10 as cards was a real UX problem caught only by actually looking at the screenshot).
- [ ] Phase 6: deployment
- [ ] Phase 7: eval + docs (test_queries.json now has 10 real questions across all 5 games — reuse for run_eval.py against the live /query endpoint too)

## Manual steps (require user action)
- Create OpenAI API key → set in backend/.env
- Create Pinecone account + API key → set in backend/.env
- Create Together AI account + API key → set in backend/.env
- Add 5 rulebook PDFs to backend/documents/
- Create Railway + Vercel accounts for deployment (Phase 6)
