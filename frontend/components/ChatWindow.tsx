"use client";

import { useEffect, useRef, useState, FormEvent, KeyboardEvent } from "react";
import { askQuestion } from "@/lib/api";
import { MessageBubble, Message } from "./MessageBubble";
import { GameBadge } from "./GameBadge";

const GAMES = ["Catan", "Ticket To Ride", "Pandemic", "Carcassonne", "Codenames"];

const EXAMPLE_QUESTIONS = [
  "Can I trade resources with the bank in Catan?",
  "What happens when the train card deck runs out in Ticket to Ride?",
  "How does an outbreak work in Pandemic?",
  "How do I score a completed city in Carcassonne?",
  "Can a Codenames clue be more than one word?",
];

// Railway's free tier sleeps the backend between visits; the first question
// after a cold start can take noticeably longer than the usual ~2s.
const SLOW_RESPONSE_HINT_MS = 6000;

export function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [game, setGame] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [slow, setSlow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [input]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, loading]);

  async function ask(question: string) {
    if (!question || loading) return;

    setMessages((prev) => [...prev, { role: "user", content: question }]);
    setInput("");
    setLoading(true);
    setError(null);
    const slowTimer = setTimeout(() => setSlow(true), SLOW_RESPONSE_HINT_MS);

    try {
      const result = await askQuestion(question, game ?? undefined);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: result.answer, sources: result.sources },
      ]);
    } catch {
      setError("Something went wrong asking that question. Please try again.");
    } finally {
      clearTimeout(slowTimer);
      setSlow(false);
      setLoading(false);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    ask(input.trim());
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      e.currentTarget.form?.requestSubmit();
    }
  }

  function clearChat() {
    setMessages([]);
    setError(null);
  }

  const isEmpty = messages.length === 0 && !loading && !error;

  return (
    <div className="flex h-full w-full max-w-2xl flex-col gap-3">
      <div className="relative min-h-0 flex-1">
        {messages.length > 0 && !loading && (
          <button
            type="button"
            onClick={clearChat}
            className="absolute right-3 top-3 z-10 rounded-full border border-zinc-200 bg-white/90 px-3 py-1 text-xs font-medium text-zinc-500 backdrop-blur transition hover:border-zinc-400 hover:text-zinc-800 dark:border-zinc-700 dark:bg-zinc-900/90 dark:text-zinc-400 dark:hover:border-zinc-500 dark:hover:text-zinc-100"
          >
            Clear chat
          </button>
        )}
        <div
          ref={scrollRef}
          className={`scrollbar-subtle h-full space-y-4 overflow-y-auto rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 ${
            isEmpty ? "" : "pt-12" // keep messages clear of the floating Clear-chat button
          }`}
        >
          {isEmpty ? (
            <div className="flex h-full flex-col items-center justify-center gap-6 text-center">
              <div>
                <div className="text-4xl" aria-hidden="true">🎲</div>
                <h2 className="mt-3 text-lg font-semibold text-zinc-800 dark:text-zinc-100">
                  Ask a rules question
                </h2>
                <p className="mx-auto mt-1 max-w-sm text-sm text-zinc-500 dark:text-zinc-400">
                  Answers come from the official rulebooks of five games, with the
                  exact passages cited. Try one of these:
                </p>
              </div>
              <div className="grid w-full max-w-md gap-2">
                {EXAMPLE_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => ask(q)}
                    className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-left text-sm text-zinc-600 transition hover:border-amber-400 hover:bg-amber-50 hover:text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800/60 dark:text-zinc-300 dark:hover:border-amber-500/60 dark:hover:bg-amber-500/10 dark:hover:text-zinc-100"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((message, i) => (
                <MessageBubble key={i} message={message} />
              ))}
              {loading && (
                <div className="flex items-center gap-2.5 text-sm text-zinc-400 dark:text-zinc-500">
                  <span className="flex gap-1" aria-hidden="true">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.3s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.15s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current" />
                  </span>
                  {slow
                    ? "Still working — the server may be waking up from a nap…"
                    : "Consulting the rulebooks…"}
                </div>
              )}
              {error && <p className="text-sm text-red-500">{error}</p>}
            </>
          )}
        </div>
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
          className="scrollbar-hidden max-h-40 flex-1 resize-none overflow-y-auto rounded-3xl border border-zinc-300 bg-white px-4 py-2 text-sm leading-normal outline-none focus:border-amber-500 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-amber-500"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="rounded-full bg-amber-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-amber-500 disabled:opacity-40 disabled:hover:bg-amber-600"
        >
          Ask
        </button>
      </form>
    </div>
  );
}
