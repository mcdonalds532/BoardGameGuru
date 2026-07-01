"""Retrieves the top-k most relevant rulebook chunks for a query from Pinecone."""

from openai import OpenAI
from pinecone import Pinecone

from app.config import settings

_openai = OpenAI(api_key=settings.openai_api_key)
_pinecone = Pinecone(api_key=settings.pinecone_api_key)


def embed_query(text: str) -> list[float]:
    response = _openai.embeddings.create(model=settings.embedding_model, input=text)
    return response.data[0].embedding


def retrieve(query: str, game: str | None = None, top_k: int = 10) -> list[dict]:
    index = _pinecone.Index(settings.pinecone_index_name)
    vector = embed_query(query)

    filter_ = {"game": game} if game else None
    results = index.query(vector=vector, top_k=top_k, filter=filter_, include_metadata=True)

    return [
        {
            "text": match["metadata"]["text"],
            "game": match["metadata"]["game"],
            "source_file": match["metadata"]["source_file"],
            "score": match["score"],
        }
        for match in results["matches"]
    ]
