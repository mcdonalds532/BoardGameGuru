"""Extracts raw text from rulebook PDFs in documents/."""

import pdfplumber


def extract_text(pdf_path: str) -> str:
    with pdfplumber.open(pdf_path) as pdf:
        return "\n".join(page.extract_text() or "" for page in pdf.pages)


if __name__ == "__main__":
    pass
