"""Compares the base model against the fine-tuned LoRA adapter on the same
retrieved-context prompts used at training time. Run inside eval_venv
(separate from the main backend venv — needs torch/transformers/peft, which
the deployed backend never does)."""

import json
from pathlib import Path

import torch
from peft import PeftModel
from transformers import AutoModelForCausalLM, AutoTokenizer

BASE_MODEL = "Qwen/Qwen2.5-3B-Instruct"
ADAPTER_DIR = Path(__file__).parent / "adapter_extracted"
CONTEXT_CACHE = Path(__file__).parent.parent.parent / "eval" / "context_cache.json"
RESULTS_MD_PATH = Path(__file__).parent / "eval_results.md"
RESULTS_JSON_PATH = Path(__file__).parent.parent.parent / "eval" / "eval_answers.json"

SYSTEM_PROMPT = (
    "You are a board game rules assistant. Answer the user's question using only "
    "the provided rulebook excerpts. If the excerpts don't contain the answer, say so "
    "rather than guessing."
)


def build_prompt(tokenizer, game: str, context: str, question: str) -> str:
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": f"Context:\n[{game}] {context}\n\nQuestion: {question}"},
    ]
    return tokenizer.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)


def generate(model, tokenizer, prompt: str) -> str:
    inputs = tokenizer(prompt, return_tensors="pt").to(model.device)
    with torch.no_grad():
        output = model.generate(
            **inputs,
            max_new_tokens=200,
            do_sample=False,
            pad_token_id=tokenizer.eos_token_id,
        )
    new_tokens = output[0][inputs["input_ids"].shape[1] :]
    return tokenizer.decode(new_tokens, skip_special_tokens=True).strip()


def main() -> None:
    with open(CONTEXT_CACHE, encoding="utf-8") as f:
        queries = json.load(f)

    tokenizer = AutoTokenizer.from_pretrained(BASE_MODEL)
    base_model = AutoModelForCausalLM.from_pretrained(
        BASE_MODEL, torch_dtype=torch.float16, device_map="cuda"
    )

    results = []
    print("Running base model...")
    for q in queries:
        prompt = build_prompt(tokenizer, q["game"], q["context"], q["question"])
        answer = generate(base_model, tokenizer, prompt)
        results.append({**q, "base_answer": answer})
        print(f"  [{q['game']}] {q['question'][:50]}...")

    print("Loading LoRA adapter...")
    tuned_model = PeftModel.from_pretrained(base_model, str(ADAPTER_DIR))

    print("Running fine-tuned model...")
    for r in results:
        prompt = build_prompt(tokenizer, r["game"], r["context"], r["question"])
        r["tuned_answer"] = generate(tuned_model, tokenizer, prompt)
        print(f"  [{r['game']}] {r['question'][:50]}...")

    with open(RESULTS_MD_PATH, "w", encoding="utf-8") as f:
        f.write("# Fine-tune Evaluation: Base vs LoRA-tuned Qwen2.5-3B-Instruct\n\n")
        for r in results:
            f.write(f"## [{r['game']}] {r['question']}\n\n")
            f.write(f"**Base model:**\n{r['base_answer']}\n\n")
            f.write(f"**Fine-tuned model:**\n{r['tuned_answer']}\n\n")
            f.write("---\n\n")

    with open(RESULTS_JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2)

    print(f"Wrote comparison to {RESULTS_MD_PATH}")
    print(f"Wrote structured results to {RESULTS_JSON_PATH}")


if __name__ == "__main__":
    main()
