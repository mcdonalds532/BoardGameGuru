"""Generates a grounded answer from retrieved rulebook chunks via Together AI."""

from together import Together

from app.config import settings

_together = Together(api_key=settings.together_api_key)

SYSTEM_PROMPT = (
    "You are a board game rules assistant. Answer the user's question using only "
    "the provided rulebook excerpts. If the excerpts don't contain the answer, say so "
    "rather than guessing."
)


def generate_answer(query: str, chunks: list[dict]) -> str:
    context = "\n\n".join(f"[{c['game']}] {c['text']}" for c in chunks)
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": f"Context:\n{context}\n\nQuestion: {query}"},
    ]

    model = settings.finetuned_generation_model or settings.base_generation_model
    response = _together.chat.completions.create(
        model=model,
        messages=messages,
    )
    return response.choices[0].message.content
