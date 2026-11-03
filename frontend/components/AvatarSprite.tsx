import type { AvatarConfig } from "@/lib/room";

export const SPRITE_URLS = {
  color: "/color_atlas.gif",
  eyes: "/eyes_atlas.gif",
  mouth: "/mouth_atlas.gif",
} as const;

export const SPRITE_COUNTS = {
  color: 28,
  eyes: 57,
  mouth: 51,
} as const;

// in pixels
export const SPRITE_WIDTH = 48;
export const SPRITE_HEIGHT = 48;

const COLUMNS = 10;

function calcCoords(idx: number, total: number): string {
  // sanitize the index so out-of-range / negative values wrap around
  const sanitizedIdx = ((idx % total) + total) % total;

  const x = sanitizedIdx % COLUMNS;
  const y = Math.trunc(sanitizedIdx / COLUMNS);

  return `${-x * SPRITE_WIDTH}px ${-y * SPRITE_HEIGHT}px`;
}

type Props = {
  avatar: AvatarConfig;
  /** Multiplier on the native 48px sprite size. */
  scale?: number;
  className?: string;
};

/** Read-only avatar: the color, mouth and eyes sprites stacked on one origin. */
export default function AvatarSprite({ avatar, scale = 1, className }: Props) {
  return (
    <div
      aria-hidden
      className={`relative shrink-0 ${className ?? ""}`}
      style={{ width: SPRITE_WIDTH * scale, height: SPRITE_HEIGHT * scale }}
    >
      <div
        className="absolute left-0 top-0 origin-top-left"
        style={{
          width: SPRITE_WIDTH,
          height: SPRITE_HEIGHT,
          transform: `scale(${scale})`,
          imageRendering: "pixelated",
        }}
      >
        <div
          className="absolute inset-0 bg-no-repeat"
          style={{
            backgroundImage: `url(${SPRITE_URLS.color})`,
            backgroundPosition: calcCoords(avatar.colorIdx, SPRITE_COUNTS.color),
          }}
        />
        <div
          className="absolute inset-0 bg-no-repeat"
          style={{
            backgroundImage: `url(${SPRITE_URLS.mouth})`,
            backgroundPosition: calcCoords(avatar.mouthIdx, SPRITE_COUNTS.mouth),
          }}
        />
        <div
          className="absolute inset-0 bg-no-repeat"
          style={{
            backgroundImage: `url(${SPRITE_URLS.eyes})`,
            backgroundPosition: calcCoords(avatar.eyesIdx, SPRITE_COUNTS.eyes),
          }}
        />
      </div>
    </div>
  );
}
