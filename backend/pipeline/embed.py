"""Embeds chunks with OpenAI and upserts them into Pinecone."""

import time
from pathlib import Path

from openai import OpenAI
from pinecone import Pinecone, ServerlessSpec

from app.config import settings

EMBEDDING_DIMENSION = 1536
BATCH_SIZE = 100

_openai = OpenAI(api_key=settings.openai_api_key)
_pinecone = Pinecone(api_key=settings.pinecone_api_key)


def _ensure_index() -> None:
    if _pinecone.has_index(settings.pinecone_index_name):
        return
    _pinecone.create_index(
        name=settings.pinecone_index_name,
        dimension=EMBEDDING_DIMENSION,
        metric="cosine",
        spec=ServerlessSpec(cloud="aws", region="us-east-1"),
    )
    while not _pinecone.describe_index(settings.pinecone_index_name).status.ready:
        time.sleep(1)


def embed_and_upsert(chunks: list[dict]) -> None:
    _ensure_index()
    index = _pinecone.Index(settings.pinecone_index_name)

    for i in range(0, len(chunks), BATCH_SIZE):
        batch = chunks[i : i + BATCH_SIZE]
        response = _openai.embeddings.create(
            model=settings.embedding_model,
            input=[c["text"] for c in batch],
        )
        vectors = [
            {
                "id": f"{Path(c['source_file']).stem}-{c['chunk_index']}",
                "values": embedding.embedding,
                "metadata": {
                    "text": c["text"],
                    "game": c["game"],
                    "source_file": c["source_file"],
                    "chunk_index": c["chunk_index"],
                },
            }
            for c, embedding in zip(batch, response.data)
        ]
        index.upsert(vectors=vectors)


def _game_name_from_filename(pdf_path: Path) -> str:
    return pdf_path.stem.replace("_", " ").title()


def run_pipeline() -> None:
    from pipeline.chunk import chunk_text
    from pipeline.ingest import extract_text

    documents_dir = Path(__file__).resolve().parent.parent / "documents"
    all_chunks: list[dict] = []

    for pdf_path in sorted(documents_dir.glob("*.pdf")):
        game = _game_name_from_filename(pdf_path)
        text = extract_text(str(pdf_path))
        chunks = chunk_text(text, game=game, source_file=pdf_path.name)
        all_chunks.extend(chunks)
        print(f"{pdf_path.name}: {len(chunks)} chunks")

    embed_and_upsert(all_chunks)
    print(f"Upserted {len(all_chunks)} chunks into Pinecone index '{settings.pinecone_index_name}'")


if __name__ == "__main__":
    run_pipeline()
