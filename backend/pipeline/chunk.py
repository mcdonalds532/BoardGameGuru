"""Splits rulebook text into ~400-token chunks with ~80-token overlap."""

CHUNK_SIZE = 400
CHUNK_OVERLAP = 80


def chunk_text(text: str, game: str, source_file: str) -> list[dict]:
    raise NotImplementedError


if __name__ == "__main__":
    pass
