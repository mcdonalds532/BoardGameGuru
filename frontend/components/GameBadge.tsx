const GAME_COLORS: Record<string, string> = {
  Catan: "bg-amber-100 text-amber-800",
  "Ticket To Ride": "bg-sky-100 text-sky-800",
  Pandemic: "bg-red-100 text-red-800",
  Carcassonne: "bg-emerald-100 text-emerald-800",
  Codenames: "bg-violet-100 text-violet-800",
};

interface GameBadgeProps {
  game: string;
  selected?: boolean;
  onClick?: () => void;
}

export function GameBadge({ game, selected, onClick }: GameBadgeProps) {
  const colorClasses = GAME_COLORS[game] ?? "bg-zinc-100 text-zinc-800";
  const interactive = typeof onClick === "function";

  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition ${colorClasses} ${
        interactive ? "cursor-pointer hover:opacity-80" : ""
      } ${selected ? "ring-2 ring-offset-1 ring-zinc-400" : ""}`}
    >
      {game}
    </span>
  );
}
