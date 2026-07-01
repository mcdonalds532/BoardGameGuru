"""Downloads a completed fine-tune's LoRA adapter weights for local evaluation."""

import sys
from pathlib import Path

from together import Together

from app.config import settings

_together = Together(api_key=settings.together_api_key)

OUTPUT_DIR = Path(__file__).parent / "adapter"


def download_adapter(job_id: str) -> Path:
    OUTPUT_DIR.mkdir(exist_ok=True)
    response = _together.fine_tuning.content(ft_id=job_id, checkpoint="adapter")
    output_path = OUTPUT_DIR / f"{job_id}.tar.zst"
    response.write_to_file(output_path)
    return output_path


if __name__ == "__main__":
    path = download_adapter(sys.argv[1])
    print(f"Downloaded adapter to {path}")
