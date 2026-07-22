# BoardGameGuru — frontend

Next.js + Tailwind chat UI. See the [root README](../README.md) for the full
project: architecture, retrieval pipeline, and fine-tuning eval.

```
npm install
cp .env.local.example .env.local  # point BACKEND_URL at the local FastAPI backend
npm run dev
```

| Path | Purpose |
|---|---|
| `app/page.tsx` | Page shell |
| `app/api/chat/route.ts` | Server-side proxy to the FastAPI backend (keeps `BACKEND_URL` off the client) |
| `components/ChatWindow.tsx` | Message list, game-filter badges, input |
| `components/MessageBubble.tsx` | Answer rendering + collapsible source cards |
| `components/SourceCard.tsx` | A single cited rulebook passage |
| `lib/textQuality.ts` | Heuristics that hide garbled PDF-extraction snippets from citations |
