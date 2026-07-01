"""Checks the status of a Together AI fine-tuning job and prints the model ID when done."""

import sys

from together import Together

from app.config import settings

_together = Together(api_key=settings.together_api_key)


def check_status(job_id: str) -> None:
    job = _together.fine_tuning.retrieve(job_id)
    print(f"status: {job.status}")
    if job.status == "completed":
        print(f"output model: {job.x_model_output_name}")
        print("Set this as TOGETHER's finetuned_generation_model / FINETUNED_GENERATION_MODEL in backend/.env")
    elif job.status == "error":
        print(job.model_dump())


if __name__ == "__main__":
    check_status(sys.argv[1])
