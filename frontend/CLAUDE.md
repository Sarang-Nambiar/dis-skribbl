# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Run everything from `frontend/`. There is no root-level script runner, Makefile, Docker setup, or CI.

```bash
npm install          # required first — node_modules/ is not checked in and not present
npm run dev          # Turbopack dev server on :3000 (Turbopack is the Next 16 default)
npm run build
npm start
npm run lint         # bare `eslint` with flat config, NOT `next lint`
npx eslint app/page.tsx   # lint a single path
npx tsc --noEmit     # typecheck; tsconfig is noEmit and there is no `typecheck` script
```

There are no tests — no runner, no config, no test dependencies. Don't invent a test command.

## Architecture

Two independent services with nothing tying them together (no workspaces, no shared tooling):

- `backend/` — Go websocket game server. Module `dis-skribbl-backend`, standard `cmd/` + `internal/` layout, depends on `github.com/gorilla/websocket` (raw websockets, not Socket.IO). Every `.go` file is currently a 0-byte placeholder. Run with `go run ./cmd` from `backend/`.
- `frontend/` — this directory. Next.js 16.4 App Router client.

The project is at skeleton stage. The frontend has no websocket client, no state store, no API routes, and no routes beyond `/`; `app/page.tsx` is a placeholder. Realtime and state code is greenfield — pick an approach rather than looking for an existing one.

`public/` already carries the art direction: a tiled `background-hue.png` plus `color_atlas.gif`, `eyes_atlas.gif`, and `mouth_atlas.gif` sprite sheets for a skribbl-style avatar customizer.

## Conventions

These are the parts that are easy to get wrong:

- **No `src/`.** `app/` sits at the frontend root, and the `@/*` path alias maps to `./*`. Shared components live in a root-level `components/` dir, imported as `@/components/*`.
- **Route-typed layouts/pages.** `app/layout.tsx` uses the Next-16-generated `LayoutProps<"/">` global type instead of hand-written props. Follow that for new layouts and pages.
- **Tailwind v4 runs through Turbopack, not PostCSS.** It is wired by the `@tailwindcss/turbopack` rule in `next.config.ts` plus `@import "tailwindcss"` in `app/globals.css`. There is deliberately no `tailwind.config.ts` and no `postcss.config.mjs` — adding PostCSS config conflicts with this setup.
- `next.config.ts` opts into `cacheComponents` and `partialPrefetching`, and disables `devIndicators`.
- Despite what the stock `README.md` says, `next/font`/Geist is **not** used. Fonts come from the `font-family` declaration in `app/globals.css`.
- `AGENTS.md` is generated and re-added by `next dev`. Commit it alongside your work rather than deleting it. It points at `node_modules/next/dist/docs/` (available only after `npm install`) — read the relevant guide there before writing Next 16 APIs from memory, since they differ from older conventions.
