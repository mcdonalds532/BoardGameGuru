"""Uploads qa_pairs.jsonl and submits a LoRA fine-tuning job to Together AI."""

from together import Together

from app.config import settings

_together = Together(api_key=settings.together_api_key)


def submit_finetune_job(qa_pairs_path: str, suffix: str = "boardgameguru") -> str:
    upload = _together.files.upload(file=qa_pairs_path, purpose="fine-tune")
    job = _together.fine_tuning.create(
        training_file=upload.id,
        model=settings.base_generation_model,
        n_epochs=3,
        n_checkpoints=1,
        lora=True,
        suffix=suffix,
    )
    return job.id


if __name__ == "__main__":
    pass
