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

export const CELL = 48;
export const COLUMNS = 10;

export const SPRITE_COUNTS = {
  color: 28,
  eyes: 57,
  mouth: 51,
} as const;

export default function Avatar() {
  return (
    <div className="flex size-24 items-center justify-center rounded-lg border-2 border-dashed border-black/30 bg-black/5 text-center text-xs leading-tight text-black/50">
      avatar
      <br />
      goes here
    </div>
  );
}
