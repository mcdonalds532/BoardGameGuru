from fastapi import APIRouter
from pydantic import BaseModel

from app.rag.generator import generate_answer
from app.rag.retriever import retrieve

router = APIRouter()


class QueryRequest(BaseModel):
    question: str
    game: str | None = None


class QueryResponse(BaseModel):
    answer: str
    sources: list[dict]


@router.post("/query", response_model=QueryResponse)
def query(request: QueryRequest) -> QueryResponse:
    chunks = retrieve(request.question, game=request.game)
    answer = generate_answer(request.question, chunks)
    return QueryResponse(answer=answer, sources=chunks)
