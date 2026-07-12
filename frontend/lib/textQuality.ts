// Some rulebook PDFs (e.g. catan.pdf sidebar/callout boxes, pandemic.pdf map
// labels) extract with scrambled character order due to font-encoding quirks
// in the source PDF, producing letter-spaced, reversed, or interleaved text.
// This heuristic flags the offenders so the UI can skip them in favor of
// cleaner citations — it doesn't affect what's sent to the LLM, only what's
// displayed. The rules and thresholds below were validated against every
// snippet in the corpus (all 134 chunks regenerated from the source PDFs):
// they catch all known-garbled snippets without dropping clean ones.

// Short words that legitimately appear in English prose; anything else with
// <= 2 letters in a row suggests interleaved map-label junk like
// "Outb a re l a g k ie s r a S nd".
const COMMON_SHORT_WORDS = new Set([
  "a", "i", "an", "as", "at", "be", "by", "do", "eg", "go", "he", "ie", "if",
  "in", "is", "it", "me", "my", "no", "of", "ok", "on", "or", "so", "st", "to",
  "up", "us", "vs", "we",
]);

// Alphabetic with no vowels (y counts as a vowel so "try"/"sky" stay clean).
const VOWELLESS = /^[b-df-hj-np-tv-xz]+$/i;
// A capital letter after a lowercase one, e.g. "nataC", "HbmG".
const MID_CAP = /[a-z][A-Z]/;
// Every letter doubled, e.g. "RRoobbbbeerr", "aammee" — headers rendered with
// overlapping duplicate glyphs.
const DOUBLED_PAIRS = /^(?:([A-Za-z])\1)+$/;

function isSuspiciousWord(letters: string): boolean {
  if (letters.length >= 3 && VOWELLESS.test(letters)) return true;
  if (letters.length >= 2 && DOUBLED_PAIRS.test(letters)) return true;
  return MID_CAP.test(letters);
}

export function looksGarbled(text: string): boolean {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return true;

  // Letter-spaced text ("T h e   r o b b e r") is mostly single characters.
  const singleCharWords = words.filter((w) => w.length === 1).length;
  if (singleCharWords / words.length > 0.35) return true;

  let suspiciousTotal = 0;
  let suspiciousRun = 0;
  let shortRun = 0;
  let firstLetterWord = true;

  for (const word of words) {
    const letters = word.replace(/[^A-Za-z]/g, "");
    // Digits/symbols ("©", "5102", "=") neither extend nor break runs, so
    // "HbmG © nataC" is still caught.
    if (!letters) continue;

    if (isSuspiciousWord(letters)) {
      // A snippet that *opens* with a mangled word ("RRoobbbbeerr See also…")
      // reads as gibberish even if the rest is clean.
      if (firstLetterWord) return true;
      suspiciousTotal += 1;
      suspiciousRun += 1;
    } else {
      suspiciousRun = 0;
    }
    firstLetterWord = false;

    if (letters.length <= 2) {
      // Common short words are neutral: they don't break an interleaved run
      // ("re l a g" still counts as a run despite the "a").
      if (!COMMON_SHORT_WORDS.has(letters.toLowerCase())) shortRun += 1;
    } else {
      shortRun = 0;
    }

    // Two suspicious words in a row means reversed/scrambled extraction (one
    // alone can be a legitimate name like "GmbH"); three anywhere means the
    // snippet is riddled with them; three uncommon short fragments in a row
    // means interleaved label junk.
    if (suspiciousRun >= 2 || suspiciousTotal >= 3 || shortRun >= 3) return true;
  }
  return false;
}

export const SNIPPET_LENGTH = 180;

// A chunk can have a garbled opening (dot-leader, scrambled sidebar text)
// followed by perfectly clean rulebook text — but only the truncated snippet
// is ever shown, so quality must be judged on the snippet, not the full chunk.
export function makeSnippet(text: string, maxLen = SNIPPET_LENGTH): string {
  return text.length > maxLen ? `${text.slice(0, maxLen).trim()}…` : text;
}
