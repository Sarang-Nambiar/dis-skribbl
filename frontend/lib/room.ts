export type RoomSettings = {
  maxPlayers: number;
  language: string;
  /** Seconds each player gets to draw. */
  drawTime: number;
  rounds: number;
  /** How many words the drawer can choose from each turn. */
  wordCount: number;
  /** How many letters are revealed over the course of a turn. */
  hints: number;
  /** Raw comma-separated text exactly as typed in the textarea. */
  customWords: string;
  customWordsOnly: boolean;
};

/** Sprite indices into the color / eyes / mouth atlases. */
export type AvatarConfig = {
  colorIdx: number;
  eyesIdx: number;
  mouthIdx: number;
};

export type Player = {
  id: string;
  name: string;
  avatar: AvatarConfig;
  isHost: boolean;
};

export type Room = {
  roomId: string;
  players: Player[];
  settings: RoomSettings;
  /** Whether the viewer is the host — only the host can edit settings and start. */
  isHost: boolean;
  /** The viewer's own player id, so the list can mark "(You)". */
  selfId: string;
};

export const DEFAULT_SETTINGS: RoomSettings = {
  maxPlayers: 8,
  language: "english",
  drawTime: 80,
  rounds: 3,
  wordCount: 3,
  hints: 2,
  customWords: "",
  customWordsOnly: false,
};

const range = (from: number, to: number, step = 1) =>
  Array.from({ length: Math.floor((to - from) / step) + 1 }, (_, i) => from + i * step);

export const SETTING_OPTIONS = {
  maxPlayers: range(2, 20),
  drawTime: range(30, 240, 10),
  rounds: range(1, 10),
  wordCount: range(1, 5),
  hints: range(0, 5),
  // TODO: the real list depends on which word lists the backend ships.
  languages: [
    { value: "english", label: "English" },
    { value: "german", label: "German" },
    { value: "french", label: "French" },
    { value: "spanish", label: "Spanish" },
    { value: "italian", label: "Italian" },
    { value: "portuguese", label: "Portuguese" },
  ],
} as const;

/** Custom-words-only games need enough words to last a game. */
export const MIN_CUSTOM_WORDS = 10;

export function parseCustomWords(raw: string): string[] {
  return raw
    .split(/[,\n]/)
    .map((word) => word.trim())
    .filter(Boolean);
}
