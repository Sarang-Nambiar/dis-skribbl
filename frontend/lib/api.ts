/*
 * ─────────────────────────────────────────────────────────────────────────────
 *  BACKEND PLACEHOLDERS
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  Every function in this file is a stand-in for a call to the Go server, which
 *  doesn't exist yet. The UI only talks to the backend through here, so when the
 *  server is ready, replace the bodies (fetch / websocket) and keep the
 *  signatures — nothing else in the frontend should need to change.
 *
 *  The stubs keep just enough state in `sessionStorage` for the lobby to render
 *  something sensible after navigating from the home page. All of that goes away
 *  once the server is the source of truth.
 */

import { DEFAULT_SETTINGS, type Room, type RoomSettings } from "@/lib/room";

const PLAYER_NAME_KEY = "stub:playerName";
const SELF_ID = "self";

function readStub(key: string): string | null {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStub(key: string, value: string) {
  try {
    sessionStorage.setItem(key, value);
  } catch {
    // Storage can be blocked (private windows etc.) — the stub just degrades.
  }
}

/**
 * Create a private room with the caller as host.
 *
 * TODO(backend): e.g. `POST /rooms` with the player's name + avatar indices;
 * the server generates the room id and registers this player as the host.
 * Avatar selection isn't held in state yet — add it here once it is.
 */
export async function createPrivateRoom(input: {
  name: string;
}): Promise<{ roomId: string }> {
  writeStub(PLAYER_NAME_KEY, input.name);
  // Fake id so the route has something to show; the server will own this.
  const roomId = Math.random().toString(36).slice(2, 10);
  return { roomId };
}

/**
 * Fetch the current state of a room (players, settings, whether we're host).
 *
 * TODO(backend): e.g. `GET /rooms/:roomId`, then keep it live via websocket so
 * players joining/leaving and settings changes show up without a refresh.
 * Should reject / 404 for unknown rooms.
 */
export async function getRoom(roomId: string): Promise<Room> {
  return {
    roomId,
    selfId: SELF_ID,
    isHost: true,
    settings: DEFAULT_SETTINGS,
    players: [
      {
        id: SELF_ID,
        name: readStub(PLAYER_NAME_KEY) ?? "Player",
        isHost: true,
      },
    ],
  };
}

/**
 * Persist the host's lobby settings so every player in the room sees them.
 *
 * TODO(backend): e.g. `PATCH /rooms/:roomId/settings` (host only), then
 * broadcast the new settings to the other players.
 */
export async function updateRoomSettings(
  roomId: string,
  settings: RoomSettings,
): Promise<void> {
  void roomId;
  void settings;
}

/**
 * Host starts the game for everyone in the room.
 *
 * TODO(backend): e.g. `POST /rooms/:roomId/start` (host only). The server
 * should notify all players so they move to the game screen together — that
 * screen (and the drawing board) isn't built yet.
 */
export async function startGame(roomId: string): Promise<void> {
  void roomId;
}
