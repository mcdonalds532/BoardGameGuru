import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Source } from "@/lib/api";
import { looksGarbled, makeSnippet } from "@/lib/textQuality";
import { SourceCard } from "./SourceCard";

export interface Message {
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
}

// The backend retrieves more chunks than this to give the LLM better context,
// but showing all of them as cards is too much visual clutter for the UI.
const MAX_DISPLAYED_SOURCES = 4;

export function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";
  const [showSources, setShowSources] = useState(false);
  const displayedSources = message.sources
    ?.filter((source) => !looksGarbled(makeSnippet(source.text)))
    .slice(0, MAX_DISPLAYED_SOURCES);

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[85%] ${isUser ? "" : "w-full"}`}>
        <div
          className={`rounded-2xl px-4 py-2 text-sm leading-relaxed ${
            isUser
              ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
              : "answer-md bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
          }`}
        >
          {isUser ? message.content : <ReactMarkdown>{message.content}</ReactMarkdown>}
        </div>
        {displayedSources && displayedSources.length > 0 && (
          <>
            <button
              type="button"
              onClick={() => setShowSources((v) => !v)}
              className="mt-2 text-xs font-medium text-zinc-500 hover:text-zinc-700 hover:underline dark:text-zinc-400 dark:hover:text-zinc-200"
            >
              {showSources ? "Hide sources" : "View sources"}
            </button>
            {showSources && (
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {displayedSources.map((source, i) => (
                  <SourceCard key={`${source.source_file}-${i}`} source={source} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
