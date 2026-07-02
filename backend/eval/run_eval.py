"""Runs test_queries.json against a live /query endpoint and reports results.

Usage:
    python run_eval.py                         # hits http://localhost:8000
    BACKEND_URL=https://xxx.up.railway.app python run_eval.py

This is a smoke/integration eval, not a correctness eval (see
pipeline/finetune/eval_adapter.py + eval/grade_answers.py for the LLM-judge
fine-tune comparison). It confirms the deployed system answers every question
across all 5 games with a grounded, non-empty response and reports latency.
"""

import json
import os
import time
from pathlib import Path

import httpx

EVAL_DIR = Path(__file__).parent
BACKEND_URL = os.environ.get("BACKEND_URL", "http://localhost:8000")


def run_eval() -> None:
    queries = json.loads((EVAL_DIR / "test_queries.json").read_text())
    results = []

    print(f"Running {len(queries)} queries against {BACKEND_URL}\n")

    for i, q in enumerate(queries, 1):
        start = time.monotonic()
        try:
            resp = httpx.post(
                f"{BACKEND_URL}/query",
                json={"question": q["question"], "game": q["game"]},
                timeout=60,
            )
            resp.raise_for_status()
            data = resp.json()
            latency = time.monotonic() - start
            answer = data.get("answer", "")
            sources = data.get("sources", [])
            error = None
        except Exception as e:
            latency = time.monotonic() - start
            answer, sources, error = "", [], str(e)

        ok = error is None and bool(answer.strip()) and len(sources) > 0
        results.append(
            {
                "question": q["question"],
                "game": q["game"],
                "latency_s": round(latency, 2),
                "num_sources": len(sources),
                "answer_preview": answer[:120],
                "ok": ok,
                "error": error,
            }
        )

        status = "OK" if ok else "FAIL"
        print(f"[{i:2}/{len(queries)}] {status:4} {latency:5.2f}s  {q['game']:14} {q['question'][:60]}")
        if error:
            print(f"           error: {error}")

    (EVAL_DIR / "live_eval_results.json").write_text(json.dumps(results, indent=2))

    passed = sum(r["ok"] for r in results)
    latencies = [r["latency_s"] for r in results if r["error"] is None]
    avg_latency = sum(latencies) / len(latencies) if latencies else 0.0

    print(f"\n{passed}/{len(results)} queries returned a grounded answer")
    print(f"avg latency: {avg_latency:.2f}s")
    print("full results written to eval/live_eval_results.json")


if __name__ == "__main__":
    run_eval()
