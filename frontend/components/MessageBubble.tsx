import { Source } from "@/lib/api";
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
  const displayedSources = message.sources?.slice(0, MAX_DISPLAYED_SOURCES);

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[85%] ${isUser ? "" : "w-full"}`}>
        <div
          className={`rounded-2xl px-4 py-2 text-sm leading-relaxed ${
            isUser
              ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
              : "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
          }`}
        >
          {message.content}
        </div>
        {displayedSources && displayedSources.length > 0 && (
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {displayedSources.map((source, i) => (
              <SourceCard key={`${source.source_file}-${i}`} source={source} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
