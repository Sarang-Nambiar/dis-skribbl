"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import InviteLink from "@/components/InviteLink";
import PlayerList from "@/components/PlayerList";
import SettingsPanel from "@/components/SettingsPanel";
import { getRoom, startGame, updateRoomSettings } from "@/lib/api";
import {
  MIN_CUSTOM_WORDS,
  parseCustomWords,
  type Room,
  type RoomSettings,
} from "@/lib/room";

export default function RoomLobby({ roomId }: { roomId: string }) {
  const [room, setRoom] = useState<Room | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getRoom(roomId)
      .then((loaded) => {
        if (!cancelled) setRoom(loaded);
      })
      .catch(() => {
        if (!cancelled) setError("We couldn't find that room.");
      });
    return () => {
      cancelled = true;
    };
  }, [roomId]);

  if (error) {
    return (
      <div className="w-full max-w-sm rounded-xl border-2 border-black/10 bg-white p-6 text-center shadow-xl">
        <p className="font-semibold">{error}</p>
        <Link
          href="/"
          className="mt-4 inline-block rounded-lg bg-blue-500 px-4 py-2 font-bold text-white shadow hover:bg-blue-600"
        >
          Back to home
        </Link>
      </div>
    );
  }

  if (!room) {
    return (
      <div
        role="status"
        className="w-full max-w-sm rounded-xl border-2 border-black/10 bg-white p-6 text-center text-black/60 shadow-xl"
      >
        Loading room…
      </div>
    );
  }

  const { settings, isHost } = room;

  const customWordsMissing =
    settings.customWordsOnly &&
    parseCustomWords(settings.customWords).length < MIN_CUSTOM_WORDS;
  const canStart = isHost && !customWordsMissing && !starting;

  function handleSettingsChange(patch: Partial<RoomSettings>) {
    if (!room) return;
    const next = { ...room.settings, ...patch };
    setRoom({ ...room, settings: next });
    // TODO(backend): debounce this for the free-text field once it's real.
    void updateRoomSettings(room.roomId, next);
  }

  async function handleStart() {
    setStarting(true);
    try {
      await startGame(roomId);
      // TODO: navigate to the game screen once it exists (and the server tells
      // every player to move on, not just the host).
    } finally {
      setStarting(false);
    }
  }

  return (
    <div className="w-full max-w-3xl overflow-hidden rounded-xl border-2 border-black/10 bg-white shadow-xl">
      <header className="flex items-center justify-between gap-3 bg-blue-500 px-5 py-3 text-white">
        <h2 className="text-lg font-bold">Private room</h2>
        <span className="rounded-full bg-black/20 px-3 py-1 font-mono text-sm">
          {roomId}
        </span>
      </header>

      <div className="grid gap-6 p-5 md:grid-cols-[2fr_3fr]">
        <PlayerList
          players={room.players}
          maxPlayers={settings.maxPlayers}
          selfId={room.selfId}
        />
        <SettingsPanel
          settings={settings}
          onChange={handleSettingsChange}
          readOnly={!isHost}
        />
      </div>

      <div className="flex flex-col gap-4 border-t-2 border-black/10 p-5">
        <InviteLink roomId={roomId} />

        {isHost ? (
          <button
            type="button"
            onClick={handleStart}
            disabled={!canStart}
            className="w-full rounded-lg bg-green-500 py-2.5 text-lg font-bold text-white shadow transition-colors hover:bg-green-600 disabled:cursor-not-allowed disabled:bg-green-500/40 disabled:shadow-none"
          >
            Start game!
          </button>
        ) : (
          <p className="text-center text-sm text-black/60">
            Waiting for the host to start the game…
          </p>
        )}
      </div>
    </div>
  );
}
