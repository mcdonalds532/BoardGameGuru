"use client";

import { useEffect, useRef, useState, FormEvent, KeyboardEvent } from "react";
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [input]);

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

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      e.currentTarget.form?.requestSubmit();
    }
  }

  return (
    <div className="flex h-full w-full max-w-2xl flex-col gap-4">
      <div className="scrollbar-subtle flex-1 space-y-4 overflow-y-auto rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
        {messages.map((message, i) => (
          <MessageBubble key={i} message={message} />
        ))}
        {loading && <p className="text-sm text-zinc-400">Thinking…</p>}
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        <GameBadge game="All games" selected={game === null} onClick={() => setGame(null)} />
        {GAMES.map((g) => (
          <GameBadge key={g} game={g} selected={game === g} onClick={() => setGame(g)} />
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g. How do I score a completed city in Carcassonne?"
          rows={1}
          className="scrollbar-hidden max-h-40 flex-1 resize-none overflow-y-auto rounded-3xl border border-zinc-300 px-4 py-2 text-sm leading-normal outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900"
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
