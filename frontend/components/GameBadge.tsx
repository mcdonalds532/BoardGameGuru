const GAME_COLORS: Record<string, string> = {
  Catan: "bg-amber-100 text-amber-800 dark:bg-amber-400/10 dark:text-amber-300",
  "Ticket To Ride": "bg-sky-100 text-sky-800 dark:bg-sky-400/10 dark:text-sky-300",
  Pandemic: "bg-red-100 text-red-800 dark:bg-red-400/10 dark:text-red-300",
  Carcassonne: "bg-emerald-100 text-emerald-800 dark:bg-emerald-400/10 dark:text-emerald-300",
  Codenames: "bg-violet-100 text-violet-800 dark:bg-violet-400/10 dark:text-violet-300",
};

interface GameBadgeProps {
  game: string;
  selected?: boolean;
  onClick?: () => void;
}

export function GameBadge({ game, selected, onClick }: GameBadgeProps) {
  const colorClasses =
    GAME_COLORS[game] ?? "bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300";
  const className = `inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition ${colorClasses} ${
    selected
      ? "ring-2 ring-amber-500 ring-offset-2 ring-offset-zinc-50 dark:ring-offset-zinc-950"
      : ""
  }`;

  if (typeof onClick === "function") {
    return (
      <button type="button" onClick={onClick} className={`${className} cursor-pointer hover:opacity-80`}>
        {game}
      </button>
    );
  }

  return <span className={className}>{game}</span>;
}
