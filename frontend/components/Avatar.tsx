/*
 * ─────────────────────────────────────────────────────────────────────────────
 *  YOUR EXERCISE: render the player's avatar from the sprite sheets.
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  The three atlases live in `public/` and all share the same layout:
 *
 *    file                   sprites           valid indices
 *    ───────────────────────────────────────────────────────
 *    /color_atlas.gif       28 body colors    0 – 27
 *    /eyes_atlas.gif        57 eye pairs      0 – 56
 *    /mouth_atlas.gif       51 mouths         0 – 50
 *
 *  Each image is 480x480 and holds a ROW-MAJOR grid of 10 columns x 48x48 cells.
 *  So sprite `i` sits at column `i % 10`, row `Math.floor(i / 10)`, which as a
 *  CSS background offset is:
 *
 *    const x = -(i % 10) * CELL;
 *    const y = -Math.floor(i / 10) * CELL;
 *    // style={{ backgroundImage: `url(${src})`, backgroundPosition: `${x}px ${y}px` }}
 *
 *  An avatar is the three sprites stacked on one shared origin — color on the
 *  bottom, then eyes, then mouth on top. A relatively-positioned 48x48 box with
 *  three absolutely-positioned layers inside it is the usual way to do that.
 *
 *  To draw it larger than 48px, scale the whole stack rather than resizing the
 *  layers individually — `transform: scale(2)` with `transformOrigin: "top left"`
 *  on the container, or `imageRendering: "pixelated"` if you'd rather it stay
 *  crisp when scaled up.
 *
 *  You also own the controls: skribbl puts a ◀ / ▶ pair under each of the three
 *  layers plus a randomize button. Hold the three indices in `useState` here and
 *  wrap around with modulo when they run off either end (watch out: `-1 % 28` is
 *  `-1` in JS, not `27`). You'll need to add "use client" at the top of this file
 *  once you introduce state.
 */

import { IconButton } from "@mui/material";
import type { Dispatch, SetStateAction } from "react";

type AvatarProps = {
  avatarIdx: number;
  mouthIdx: number;
  eyesIdx: number;
  setAvatarIdx: Dispatch<SetStateAction<number>>;
  setEyesIdx: Dispatch<SetStateAction<number>>;
  setMouthIdx: Dispatch<SetStateAction<number>>;
};

export const COLUMNS = 10;

export const SPRITE_URLS = {
  color: '/color_atlas.gif',
  eyes: '/eyes_atlas.gif',
  mouth: '/mouth_atlas.gif'
} as const;

export const SPRITE_COUNTS = {
  color: 28,
  eyes: 57,
  mouth: 51,
} as const;

// in pixels
export const SPRITE_WIDTH = 48;
export const SPRITE_HEIGHT = 48;

const SCALE = 3

function calcCoords(idx: number, total: number): string {
  var x: number = 0;
  var y: number = 0;

  // sanitize the index
  var sanitizedIdx: number = idx % total;

  x = sanitizedIdx % 10;
  y = Math.trunc(sanitizedIdx / 10);
  return `${-x * SPRITE_WIDTH}px ${-y * SPRITE_HEIGHT}px`;
}

export default function Avatar({
  avatarIdx, mouthIdx, eyesIdx, setAvatarIdx, setEyesIdx, setMouthIdx,
}: AvatarProps) {

  return (
    <div className="flex gap-2 h-32 w-64 items-center justify-center rounded-lg text-center text-xs leading-tight text-black/50">
      <div className="flex flex-col">
        <IconButton onClick={() => setAvatarIdx(avatarIdx - 1)}>
          <div className="w-4 h-4 bg-[url('/arrow.gif')] bg-position-[-16px_0px] bg-no-repeat"></div>
        </IconButton>

        <IconButton onClick={() => setEyesIdx(eyesIdx - 1)}>
          <div className="w-4 h-4 bg-[url('/arrow.gif')] bg-position-[-16px_0px] bg-no-repeat"></div>
        </IconButton>

        <IconButton onClick={() => setMouthIdx(mouthIdx - 1)}>
          <div className="w-4 h-4 bg-[url('/arrow.gif')] bg-position-[-16px_0px] bg-no-repeat"></div>
        </IconButton>
      </div>
      <div
        className="relative shrink-0"
        style={{ width: SPRITE_WIDTH * SCALE, height: SPRITE_HEIGHT * SCALE }}
      >
        <div
          className="absolute left-0 top-0 origin-top-left"
          style={{
            width: SPRITE_WIDTH,
            height: SPRITE_HEIGHT,
            transform: `scale(${SCALE})`,
            imageRendering: "pixelated",
          }}
        >
          <div className="absolute inset-0 bg-no-repeat" style={{
            backgroundImage: `url(${SPRITE_URLS.color})`,
            backgroundPosition: calcCoords(avatarIdx, SPRITE_COUNTS.color),
          }} />
          <div className="absolute inset-0 bg-no-repeat" style={{
            backgroundImage: `url(${SPRITE_URLS.mouth})`,
            backgroundPosition: calcCoords(mouthIdx, SPRITE_COUNTS.mouth),
          }} />
          <div className="absolute inset-0 bg-no-repeat" style={{
            backgroundImage: `url(${SPRITE_URLS.eyes})`,
            backgroundPosition: calcCoords(eyesIdx, SPRITE_COUNTS.eyes),
          }} />
        </div>
      </div>
      <div className="flex flex-col">
        <IconButton onClick={() => setAvatarIdx(avatarIdx + 1)}>
          <div className="w-4 h-4 bg-[url('/arrow.gif')] bg-position-[-16px_-16px] bg-no-repeat"></div>
        </IconButton>

        <IconButton onClick={() => setEyesIdx(eyesIdx + 1)}>
          <div className="w-4 h-4 bg-[url('/arrow.gif')] bg-position-[-16px_-16px] bg-no-repeat"></div>
        </IconButton>

        <IconButton onClick={() => setMouthIdx(mouthIdx + 1)}>
          <div className="w-4 h-4 bg-[url('/arrow.gif')] bg-position-[-16px_-16px] bg-no-repeat"></div>
        </IconButton>
      </div>
    </div >
  );
}
