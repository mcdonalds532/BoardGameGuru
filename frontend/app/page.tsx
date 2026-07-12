import { ChatWindow } from "@/components/ChatWindow";

function GitHubIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="h-4 w-4 fill-current">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  );
}

export default function Home() {
  return (
    <main className="flex h-dvh flex-col items-center gap-4 bg-zinc-50 px-4 py-5 dark:bg-zinc-950">
      <header className="flex w-full max-w-2xl items-center justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            <span className="text-2xl" aria-hidden="true">🎲</span>
            BoardGameGuru
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Rules answers cited from official rulebooks.
          </p>
        </div>
        <a
          href="https://github.com/mcdonalds532/BoardGameGuru"
          target="_blank"
          rel="noopener noreferrer"
          className="flex shrink-0 items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-600 transition hover:border-zinc-400 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-zinc-600 dark:hover:text-zinc-50"
        >
          <GitHubIcon />
          <span className="hidden sm:inline">View the code</span>
          <span className="sm:hidden">Code</span>
        </a>
      </header>
      <div className="flex w-full flex-1 justify-center overflow-hidden">
        <ChatWindow />
      </div>
    </main>
  );
}
