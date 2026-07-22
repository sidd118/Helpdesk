# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project context

This is an AI-powered ticket management system (support email → ticket, with AI classification/summaries/suggested replies). Full product context lives in these docs — read them before making product decisions, don't duplicate their content in code comments:

- `project-scope.md` — problem, features, ticket statuses (open/resolved/closed), ticket categories (general question/technical question/refund request), user roles (single initial admin, admin creates agents)
- `tech-stack.md` — chosen stack per layer
- `implementation-plan.md` — phased task breakdown. The codebase currently only has Phase 0's monorepo/server/client scaffolding done — no database, auth, email ingestion, or AI integration yet.

## Commands

Run from the repo root unless noted. This is a Bun workspaces monorepo (`client/`, `server/`).

- `bun install` — install deps for both workspaces
- `bun run dev` — run client and server together (`bun --filter '*' dev`)
- `bun run dev:server` — server only (`bun --watch src/index.ts`, port 4000)
- `bun run dev:client` — client only (Vite dev server, port 5173)
- `cd client && bun run build` — typecheck (`tsc -b`) + production build
- `cd client && bun run lint` — lint client with oxlint
- `cd client && bun run preview` — preview the production build

No test suite exists in either workspace yet.

If `bun` isn't found in a non-interactive shell on this machine, it's installed at `~/.bun/bin` but not on PATH for non-login shells — prefix commands with `export PATH="$HOME/.bun/bin:$PATH"`.

## Conventions

- TypeScript throughout — client, server, and any scripts/config. No plain `.js` files.

## Architecture

- **`server/`** — Express 5 on Bun, TypeScript, run directly with `bun --watch` (no separate build/transpile step). Entry point `server/src/index.ts`.
- **`client/`** — React 19 + TypeScript + Vite, React Router for routing. Entry point `client/src/main.tsx` → `App.tsx`.
- **Dev-time API access**: `client/vite.config.ts` proxies `/api/*` to `http://localhost:4000`. The browser only ever talks to the Vite origin (5173), so requests to the Express server are same-origin from the browser's perspective — this is why there's no CORS middleware on the server. If client and server are ever deployed to genuinely different origins, that assumption breaks and CORS will need to be added.
- Server currently exposes only `/api/health`; this is the seed for the ticket API — routes, Prisma schema, auth, and AI integration described in `implementation-plan.md` don't exist yet.

## Fetching library documentation

Use the context7 MCP tools (`resolve-library-id` then `query-docs`) to pull current documentation for this stack — Bun, Express, React, Vite, Prisma, Anthropic/Claude API, etc. — instead of relying on training data. Bun in particular moves fast enough that cached knowledge of its APIs/CLI can be stale.
