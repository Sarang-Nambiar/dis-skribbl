const WORD = "scribble";

// Cycled across the letters to get the skribbl.io-style rainbow wordmark.
const COLORS = [
  "#e21b1b",
  "#f07c0d",
  "#f5c60b",
  "#49c60b",
  "#0bc6a6",
  "#1b7ae2",
  "#6a1be2",
  "#e21b9c",
];

export default function Title() {
  return (
    <h1 className="title-outline select-none text-6xl font-extrabold tracking-tight sm:text-8xl">
      {WORD.split("").map((letter, i) => (
        <span
          key={i}
          className="inline-block"
          style={{
            color: COLORS[i % COLORS.length],
            // Nudge every other letter so the word doesn't sit on a dead-flat baseline.
            transform: `rotate(${i % 2 === 0 ? -4 : 4}deg)`,
          }}
        >
          {letter}
        </span>
      ))}
    </h1>
  );
}
