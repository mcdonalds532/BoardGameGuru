"""Generates synthetic QA pairs from rulebook chunks using an OpenAI chat model."""

import json
import random
from pathlib import Path

from openai import OpenAI

from app.config import settings
from app.rag.generator import SYSTEM_PROMPT

_openai = OpenAI(api_key=settings.openai_api_key)

SAMPLE_SIZE = 80
OUTPUT_PATH = Path(__file__).parent / "qa_pairs.jsonl"

QA_SYSTEM_PROMPT = (
    "You write training data for a board game rules assistant. Given a rulebook "
    "excerpt, write exactly one question a player might realistically ask and a "
    "concise, accurate answer based only on the excerpt. Respond with JSON: "
    '{"question": "...", "answer": "..."}'
)

# PDF text extraction occasionally garbles a whole chunk (e.g. decorative title-page
# fonts). The QA model sometimes notices and says so in the answer instead of
# producing a real rules answer — drop those rather than train on them.
_GARBLED_MARKERS = ("garbled", "too corrupted", "cannot be extracted", "not contain any readable")


def _generate_pair(chunk: dict) -> dict | None:
    response = _openai.chat.completions.create(
        model=settings.qa_generation_model,
        response_format={"type": "json_object"},
        messages=[
            {"role": "system", "content": QA_SYSTEM_PROMPT},
            {"role": "user", "content": f"Game: {chunk['game']}\n\nExcerpt:\n{chunk['text']}"},
        ],
    )
    try:
        data = json.loads(response.choices[0].message.content)
        answer = data["answer"]
        if any(marker in answer.lower() for marker in _GARBLED_MARKERS):
            return None
        return {
            "game": chunk["game"],
            "context": chunk["text"],
            "question": data["question"],
            "answer": answer,
        }
    except (json.JSONDecodeError, KeyError):
        return None


def generate_qa_pairs(chunks: list[dict]) -> list[dict]:
    pairs = []
    for chunk in chunks:
        pair = _generate_pair(chunk)
        if pair:
            pairs.append(pair)
    return pairs


def to_together_format(pairs: list[dict]) -> list[dict]:
    """Mirrors generator.py's prompt shape so training matches serving-time prompts."""
    return [
        {
            "messages": [
                {"role": "system", "content": SYSTEM_PROMPT},
                {
                    "role": "user",
                    "content": f"Context:\n[{p['game']}] {p['context']}\n\nQuestion: {p['question']}",
                },
                {"role": "assistant", "content": p["answer"]},
            ]
        }
        for p in pairs
    ]


if __name__ == "__main__":
    from pipeline.embed import collect_all_chunks

    all_chunks = collect_all_chunks()
    random.seed(42)
    sample = random.sample(all_chunks, min(SAMPLE_SIZE, len(all_chunks)))

    pairs = generate_qa_pairs(sample)
    print(f"Generated {len(pairs)} QA pairs from {len(sample)} chunks")

    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        for record in to_together_format(pairs):
            f.write(json.dumps(record) + "\n")
    print(f"Wrote {OUTPUT_PATH}")
