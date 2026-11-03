import AvatarSprite from "@/components/AvatarSprite";
import type { Player } from "@/lib/room";

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
        {players.map((player) => (
          <li
            key={player.id}
            className="flex items-center gap-3 rounded-lg border-2 border-black/10 bg-black/[0.03] px-3 py-2"
          >
            <AvatarSprite avatar={player.avatar} />
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
