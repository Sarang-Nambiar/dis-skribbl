import type { Player } from "@/lib/room";

const BADGE_COLORS = [
  "#e21b1b",
  "#f07c0d",
  "#f5c60b",
  "#49c60b",
  "#0bc6a6",
  "#1b7ae2",
  "#6a1be2",
  "#e21b9c",
];

type Props = {
  players: Player[];
  maxPlayers: number;
  selfId: string;
};

export default function PlayerList({ players, maxPlayers, selfId }: Props) {
  return (
    <section aria-labelledby="players-heading" className="flex min-h-0 flex-col">
      <h2
        id="players-heading"
        className="flex items-baseline justify-between text-sm font-bold uppercase tracking-wide text-black/60"
      >
        Players
        <span className="font-semibold normal-case tracking-normal">
          {players.length} / {maxPlayers}
        </span>
      </h2>

      <ul className="mt-2 flex max-h-72 flex-col gap-2 overflow-y-auto">
        {players.map((player, i) => (
          <li
            key={player.id}
            className="flex items-center gap-3 rounded-lg border-2 border-black/10 bg-black/[0.03] px-3 py-2"
          >
            {/* TODO: swap for <Avatar /> once it renders the sprite stack and
                accepts a player's color/eyes/mouth indices. */}
            <span
              aria-hidden
              className="flex size-9 shrink-0 items-center justify-center rounded-full border-2 border-black text-sm font-bold text-white"
              style={{ backgroundColor: BADGE_COLORS[i % BADGE_COLORS.length] }}
            >
              {player.name.charAt(0).toUpperCase()}
            </span>
            <span className="min-w-0 flex-1 truncate font-semibold">
              {player.name}
              {player.id === selfId && (
                <span className="ml-1 font-normal text-black/50">(You)</span>
              )}
            </span>
            {player.isHost && (
              <span className="rounded-full bg-yellow-300 px-2 py-0.5 text-xs font-bold text-black/80">
                Host
              </span>
            )}
          </li>
        ))}

        {players.length < maxPlayers && (
          <li className="rounded-lg border-2 border-dashed border-black/20 px-3 py-3 text-center text-sm text-black/40">
            Waiting for players…
          </li>
        )}
      </ul>
    </section>
  );
}
