"""Splits rulebook text into ~400-token chunks with ~80-token overlap."""

import re

import tiktoken

CHUNK_SIZE = 400
CHUNK_OVERLAP = 80

_encoding = tiktoken.get_encoding("cl100k_base")


def _normalize(text: str) -> str:
    text = text.replace("\r\n", "\n")
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n{2,}", "\n\n", text)
    return text.strip()


def _split_long_unit(unit: str) -> list[str]:
    tokens = _encoding.encode(unit)
    if len(tokens) <= CHUNK_SIZE:
        return [unit]
    return [
        _encoding.decode(tokens[i : i + CHUNK_SIZE])
        for i in range(0, len(tokens), CHUNK_SIZE)
    ]


def _split_into_units(text: str) -> list[str]:
    """Paragraphs first; oversized paragraphs get split into sentences,
    and any still-oversized sentence gets hard-split by token count."""
    units = []
    for paragraph in text.split("\n\n"):
        paragraph = paragraph.strip()
        if not paragraph:
            continue
        if len(_encoding.encode(paragraph)) <= CHUNK_SIZE:
            units.append(paragraph)
            continue
        for sentence in re.split(r"(?<=[.!?])\s+", paragraph):
            sentence = sentence.strip()
            if sentence:
                units.extend(_split_long_unit(sentence))
    return units


def chunk_text(text: str, game: str, source_file: str) -> list[dict]:
    units = _split_into_units(_normalize(text))

    chunks: list[str] = []
    current_units: list[str] = []
    current_tokens = 0

    for unit in units:
        unit_tokens = len(_encoding.encode(unit))

        if current_units and current_tokens + unit_tokens > CHUNK_SIZE:
            chunks.append(" ".join(current_units))

            overlap_units: list[str] = []
            overlap_tokens = 0
            for u in reversed(current_units):
                t = len(_encoding.encode(u))
                if overlap_tokens + t > CHUNK_OVERLAP:
                    break
                overlap_units.insert(0, u)
                overlap_tokens += t
            current_units = overlap_units
            current_tokens = overlap_tokens

        current_units.append(unit)
        current_tokens += unit_tokens

    if current_units:
        chunks.append(" ".join(current_units))

    return [
        {"text": chunk, "game": game, "chunk_index": i, "source_file": source_file}
        for i, chunk in enumerate(chunks)
    ]


if __name__ == "__main__":
    pass
