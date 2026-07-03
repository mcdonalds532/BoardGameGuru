// Some rulebook PDFs (e.g. catan.pdf sidebar/callout boxes) extract with
// scrambled character order due to font-encoding quirks in the source PDF,
// producing letter-spaced or dot-leader-heavy text. This heuristic flags the
// worst offenders so the UI can skip them in favor of cleaner citations —
// it doesn't affect what's sent to the LLM, only what's displayed.
export function looksGarbled(text: string): boolean {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return true;

  const singleCharWords = words.filter((w) => w.length === 1).length;
  return singleCharWords / words.length > 0.35;
}

export const SNIPPET_LENGTH = 180;

// A chunk can have a garbled opening (dot-leader, scrambled sidebar text)
// followed by perfectly clean rulebook text — but only the truncated snippet
// is ever shown, so quality must be judged on the snippet, not the full chunk.
export function makeSnippet(text: string, maxLen = SNIPPET_LENGTH): string {
  return text.length > maxLen ? `${text.slice(0, maxLen).trim()}…` : text;
}
