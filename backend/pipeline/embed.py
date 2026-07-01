"""Embeds chunks with OpenAI and upserts them into Pinecone."""

from app.config import settings


def embed_and_upsert(chunks: list[dict]) -> None:
    raise NotImplementedError


if __name__ == "__main__":
    pass
