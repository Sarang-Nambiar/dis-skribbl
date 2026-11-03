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

import { DEFAULT_AVATAR, loadProfile } from "@/lib/profile";
import {
  DEFAULT_SETTINGS,
  type AvatarConfig,
  type Room,
  type RoomSettings,
} from "@/lib/room";

const PLAYER_NAME_KEY = "stub:playerName";
const PLAYER_AVATAR_KEY = "stub:playerAvatar";
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
 */
export async function createPrivateRoom(input: {
  name: string;
  avatar: AvatarConfig;
}): Promise<{ roomId: string }> {
  writeStub(PLAYER_NAME_KEY, input.name);
  writeStub(PLAYER_AVATAR_KEY, JSON.stringify(input.avatar));
  // Fake id so the route has something to show; the server will own this.
  const roomId = Math.random().toString(36).slice(2, 10);
  return { roomId };
}

/**
 * Join an existing room by its code.
 *
 * TODO(backend): e.g. `POST /rooms/:roomCode/join` with the player's name +
 * avatar indices, then open the websocket for that room. Should reject for an
 * unknown / full room so the caller can show an error.
 */
export async function joinRoom(input: {
  roomCode: string;
  name: string;
  avatar: AvatarConfig;
}): Promise<void> {
  void input;
}

/**
 * Fetch the current state of a room (players, settings, whether we're host).
 *
 * TODO(backend): e.g. `GET /rooms/:roomId`, then keep it live via websocket so
 * players joining/leaving and settings changes show up without a refresh.
 * Should reject / 404 for unknown rooms.
 */
export async function getRoom(roomId: string): Promise<Room> {
  // Prefer the avatar from the create call; fall back to the saved profile so
  // opening a room link directly still shows the player's look.
  let avatar: AvatarConfig = loadProfile()?.avatar ?? DEFAULT_AVATAR;
  try {
    const stored = readStub(PLAYER_AVATAR_KEY);
    if (stored) avatar = JSON.parse(stored) as AvatarConfig;
  } catch {
    // Malformed stub — keep the fallback.
  }

  return {
    roomId,
    selfId: SELF_ID,
    isHost: true,
    settings: DEFAULT_SETTINGS,
    players: [
      {
        id: SELF_ID,
        name: readStub(PLAYER_NAME_KEY) ?? "Player",
        avatar,
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
