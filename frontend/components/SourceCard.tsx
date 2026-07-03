import { Source } from "@/lib/api";
import { makeSnippet } from "@/lib/textQuality";
import { GameBadge } from "./GameBadge";

export function SourceCard({ source }: { source: Source }) {
  const snippet = makeSnippet(source.text);

  return (
    <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-1 flex items-center justify-between">
        <GameBadge game={source.game} />
        <span className="text-xs text-zinc-400">{source.source_file}</span>
      </div>
      <p className="text-zinc-600 dark:text-zinc-400">{snippet}</p>
    </div>
  );
}
