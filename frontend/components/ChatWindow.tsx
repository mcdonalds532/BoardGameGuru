"use client";

import { useState, FormEvent } from "react";
import { askQuestion } from "@/lib/api";
import { MessageBubble, Message } from "./MessageBubble";
import { GameBadge } from "./GameBadge";

const GAMES = ["Catan", "Ticket To Ride", "Pandemic", "Carcassonne", "Codenames"];

export function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [game, setGame] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const question = input.trim();
    if (!question || loading) return;

    setMessages((prev) => [...prev, { role: "user", content: question }]);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const result = await askQuestion(question, game ?? undefined);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: result.answer, sources: result.sources },
      ]);
    } catch {
      setError("Something went wrong asking that question. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-full w-full max-w-2xl flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        <GameBadge game="All games" selected={game === null} onClick={() => setGame(null)} />
        {GAMES.map((g) => (
          <GameBadge key={g} game={g} selected={game === g} onClick={() => setGame(g)} />
        ))}
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
        {messages.length === 0 && (
          <p className="text-sm text-zinc-400">
            Ask a rules question about Catan, Ticket to Ride, Pandemic, Carcassonne, or Codenames.
          </p>
        )}
        {messages.map((message, i) => (
          <MessageBubble key={i} message={message} />
        ))}
        {loading && <p className="text-sm text-zinc-400">Thinking…</p>}
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. How do I score a completed city in Carcassonne?"
          className="flex-1 rounded-full border border-zinc-300 px-4 py-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-zinc-900 px-5 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
        >
          Ask
        </button>
      </form>
    </div>
  );
}
