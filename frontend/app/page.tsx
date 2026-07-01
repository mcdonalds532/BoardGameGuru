import { ChatWindow } from "@/components/ChatWindow";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center gap-6 bg-zinc-50 px-4 py-10 dark:bg-black">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">BoardGameGuru</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Ask rules questions, grounded in official rulebooks.
        </p>
      </div>
      <ChatWindow />
    </main>
  );
}
