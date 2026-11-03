import type { AvatarConfig } from "@/lib/room";

/** The player's saved name + look, remembered across visits in localStorage. */
export type Profile = {
  name: string;
  avatar: AvatarConfig;
};

const PROFILE_KEY = "profile";

export const DEFAULT_AVATAR: AvatarConfig = { colorIdx: 0, eyesIdx: 0, mouthIdx: 0 };

function isIndex(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value);
}

/** Raw saved JSON, or null if none / storage unavailable. */
export function readRawProfile(): string | null {
  try {
    return localStorage.getItem(PROFILE_KEY);
  } catch {
    return null;
  }
}

/** Parses saved JSON; null if missing or malformed. */
export function parseProfile(raw: string | null): Profile | null {
  if (!raw) return null;
  try {
    const data: unknown = JSON.parse(raw);
    if (typeof data !== "object" || data === null) return null;

    const { name, avatar } = data as Partial<Record<keyof Profile, unknown>>;
    if (typeof name !== "string") return null;
    if (typeof avatar !== "object" || avatar === null) return null;

    const { colorIdx, eyesIdx, mouthIdx } = avatar as Record<string, unknown>;
    if (!isIndex(colorIdx) || !isIndex(eyesIdx) || !isIndex(mouthIdx)) return null;

    return { name, avatar: { colorIdx, eyesIdx, mouthIdx } };
  } catch {
    return null;
  }
}

/** Returns the saved profile, or null if none / unreadable / malformed. */
export function loadProfile(): Profile | null {
  return parseProfile(readRawProfile());
}

export function saveProfile(profile: Profile) {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch {
    // Storage can be blocked (private windows etc.) — we just won't remember.
  }
}
