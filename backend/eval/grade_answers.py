"""Grades base-vs-fine-tuned answers for correctness using an LLM judge,
then aggregates a pass rate for each model. Reads eval_answers.json
(produced by pipeline/finetune/eval_adapter.py)."""

import json
from pathlib import Path

from openai import OpenAI

from app.config import settings

_openai = OpenAI(api_key=settings.openai_api_key)

ANSWERS_PATH = Path(__file__).parent / "eval_answers.json"
RESULTS_PATH = Path(__file__).parent / "grading_results.json"

JUDGE_SYSTEM_PROMPT = (
    "You grade whether an answer to a board game rules question is correct and "
    "complete, based solely on the provided rulebook excerpt. Respond with JSON: "
    '{"correct": true or false, "reason": "one sentence"}'
)


def grade_answer(game: str, context: str, question: str, answer: str) -> dict:
    response = _openai.chat.completions.create(
        model=settings.qa_generation_model,
        response_format={"type": "json_object"},
        messages=[
            {"role": "system", "content": JUDGE_SYSTEM_PROMPT},
            {
                "role": "user",
                "content": (
                    f"Game: {game}\nRulebook excerpt:\n{context}\n\n"
                    f"Question: {question}\nAnswer to grade: {answer}"
                ),
            },
        ],
    )
    return json.loads(response.choices[0].message.content)


def main() -> None:
    with open(ANSWERS_PATH, encoding="utf-8") as f:
        rows = json.load(f)

    graded = []
    base_correct = 0
    tuned_correct = 0

    for row in rows:
        base_grade = grade_answer(row["game"], row["context"], row["question"], row["base_answer"])
        tuned_grade = grade_answer(row["game"], row["context"], row["question"], row["tuned_answer"])
        base_correct += base_grade["correct"]
        tuned_correct += tuned_grade["correct"]
        graded.append({**row, "base_grade": base_grade, "tuned_grade": tuned_grade})
        print(f"[{row['game']}] base={base_grade['correct']} tuned={tuned_grade['correct']}")

    summary = {
        "total": len(rows),
        "base_correct": base_correct,
        "tuned_correct": tuned_correct,
        "base_accuracy": round(base_correct / len(rows), 3),
        "tuned_accuracy": round(tuned_correct / len(rows), 3),
    }

    with open(RESULTS_PATH, "w", encoding="utf-8") as f:
        json.dump({"summary": summary, "graded": graded}, f, indent=2)

    print(f"\nBase model:       {base_correct}/{len(rows)} ({summary['base_accuracy']:.0%})")
    print(f"Fine-tuned model: {tuned_correct}/{len(rows)} ({summary['tuned_accuracy']:.0%})")
    print(f"Wrote {RESULTS_PATH}")


if __name__ == "__main__":
    main()
