import { ChatWindow } from "@/components/ChatWindow";

export default function Home() {
  return (
    <main className="flex h-screen flex-col items-center gap-4 bg-zinc-50 px-4 py-6 dark:bg-indigo-950">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">BoardGameGuru</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Ask rules questions, grounded in official rulebooks.
        </p>
      </div>
      <div className="flex w-full flex-1 justify-center overflow-hidden">
        <ChatWindow />
      </div>
    </main>
  );
}
