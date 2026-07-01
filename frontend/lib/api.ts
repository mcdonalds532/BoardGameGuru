export interface Source {
  text: string;
  game: string;
  source_file: string;
  score: number;
}

export interface QueryResponse {
  answer: string;
  sources: Source[];
}

export async function askQuestion(question: string, game?: string): Promise<QueryResponse> {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, game: game ?? null }),
  });

  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }

  return res.json();
}
