# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project context

This is an AI-powered ticket management system (support email → ticket, with AI classification/summaries/suggested replies). Full product context lives in these docs — read them before making product decisions, don't duplicate their content in code comments:

- `project-scope.md` — problem, features, ticket statuses (open/resolved/closed), ticket categories (general question/technical question/refund request), user roles (single initial admin, admin creates agents)
- `tech-stack.md` — chosen stack per layer
- `implementation-plan.md` — phased task breakdown. Done so far: monorepo scaffolding, Prisma/Postgres, Better Auth (email + password) with a seeded admin, and the client login flow. Email ingestion, the ticket API/models, and AI integration don't exist yet.

## Commands

Run from the repo root unless noted. This is a Bun workspaces monorepo (`client/`, `server/`).

- `bun install` — install deps for both workspaces
- `bun run dev` — run client and server together (`bun --filter '*' dev`)
- `bun run dev:server` — server only (`bun --watch src/index.ts`, port 4000)
- `bun run dev:client` — client only (Vite dev server, port 5173)
- `cd client && bun run build` — typecheck (`tsc -b`) + production build
- `cd client && bun run lint` — lint client with oxlint
- `cd client && bun run preview` — preview the production build
- `cd client && bunx --bun shadcn@latest add <component>` — add a shadcn component
- `cd server && bunx prisma migrate dev` — apply/create migrations
- `cd server && bunx prisma db seed` — create the initial admin (runs `prisma/seed.ts`, wired in `prisma.config.ts`)

No test suite exists in either workspace yet.

If `bun` isn't found in a non-interactive shell on this machine, it's installed at `~/.bun/bin` but not on PATH for non-login shells — prefix commands with `export PATH="$HOME/.bun/bin:$PATH"`.

## Conventions

- TypeScript throughout — client, server, and any scripts/config. No plain `.js` files.
- Client imports use the `@/*` alias for `client/src/*` (declared in `tsconfig.json`, `tsconfig.app.json`, and `vite.config.ts`). Don't add `baseUrl` — TS 6 deprecates it, and `paths` already resolve relative to the config file.

## Styling (client)

- Tailwind v4 (`@tailwindcss/vite`) + shadcn/ui — `radix-nova` style, `neutral` base, Geist. See `components.json`.
- **No custom CSS files.** `src/index.css` holds only the Tailwind/shadcn imports and the generated theme layer; style with utilities and shadcn components instead.
- Build UI from shadcn primitives (`Field`, `InputGroup`, `Alert`, `Spinner`, `Separator`, …) rather than hand-rolled markup with long class strings. Bespoke design elements with no primitive get their own component file (e.g. `components/LoginPanel.tsx`).
- Use semantic tokens (`bg-background`, `text-muted-foreground`, `border-border`, `text-destructive`), not raw palette colors — both themes then work without per-element `dark:` variants.
- Dark mode is class-based (`.dark` on `<html>`) via `ThemeProvider`; `main.tsx` applies the stored theme before `createRoot().render()` so the page never paints the wrong theme.
- To pin a subtree to the dark palette in both themes, put `dark` in its own className — `.dark` sets the token custom properties *on* that element, so its children need no `dark:` variants.
- `ui/input.tsx` carries a local fix hiding Chrome's autofill background. `shadcn add --overwrite` silently reverts local edits to `components/ui/*`, so re-check that file after any add.

## Architecture

- **`server/`** — Express 5 on Bun, TypeScript, run directly with `bun --watch` (no separate build/transpile step). Entry point `server/src/index.ts`. Prisma 7 over Postgres (`prisma/schema.prisma`, client generated into `src/generated/prisma`) and Better Auth — see Authentication below.
- **`client/`** — React 19 + TypeScript + Vite, React Router for routing. Entry point `client/src/main.tsx` → `App.tsx`. `RequireAuth` gates authenticated routes, which render inside `Layout` (navbar + `<main>`).
- **Dev-time API access**: `client/vite.config.ts` proxies `/api/*` to `http://localhost:4000`. The browser only ever talks to the Vite origin (5173), so requests to the Express server are same-origin from the browser's perspective — this is why there's no CORS middleware on the server. If client and server are ever deployed to genuinely different origins, that assumption breaks and CORS will need to be added.
- Server routes so far: `/api/health`, `/api/db-health`, `/api/me` (auth-guarded), plus Better Auth's `/api/auth/*`. The schema covers auth only (`User` with a `Role` enum, `Session`, `Account`, `Verification`) — no ticket models yet. The ticket API, email ingestion, and AI integration from `implementation-plan.md` are still to build.

## Authentication

Better Auth (email + password) with the Prisma adapter. Server config `server/src/auth.ts`, client `client/src/lib/auth-client.ts`.

- **There is no public sign-up.** `emailAndPassword.disableSignUp: true` — the sign-up endpoint is off by design. The initial admin comes from the seed script; per `project-scope.md` the admin creates agents from there (not built yet). Don't reach for `authClient.signUp` — it won't work.
- **Mount order matters.** `/api/auth/*splat` is handled by `toNodeHandler(auth)` **before** `express.json()`; Better Auth needs the raw request body. Adding body-parsing middleware above that line breaks auth.
- **Role lives in two places and must stay in sync**: the Prisma `Role` enum on `User` (`ADMIN` | `AGENT`, default `AGENT`) and Better Auth's `user.additionalFields.role` in `server/src/auth.ts`. It's declared `input: false`, so clients can't set or change their own role — keep it that way and assign roles server-side.
- **The client infers roles from the server, don't redeclare them.** `client/src/lib/auth-client.ts` does `inferAdditionalFields<typeof auth>()` over a **type-only** import of `server/src/auth`, and re-exports `Session` / `Role`. Editing `additionalFields` on the server updates `session.user.role` on the client with no client-side edit. The import is erased at build time (`verbatimModuleSyntax`), so no server code reaches the bundle — keep it `import type`, never a value import, or Prisma and the DB config get pulled into the browser.
- **Protecting a server route**: add the `requireAuth` middleware (`server/src/middleware/requireAuth.ts`). It resolves the session via `auth.api.getSession({ headers: fromNodeHeaders(req.headers) })`, 401s when absent, and attaches `req.user` / `req.session` — typed globally in `server/src/types/express.d.ts` off `auth.$Infer.Session`, so don't hand-write those shapes.
- **Protecting a client route**: nest it under `<RequireAuth>` in `App.tsx`. Components read the session with `authClient.useSession()`; always handle its `isPending` state.
- **Role-gating a client route**: nest it under `<RequireRole roles={['ADMIN']} />` (`components/RequireRole.tsx`), inside `RequireAuth`/`Layout`. It forwards `Layout`'s outlet context and redirects non-matching roles to `/`. This is UI-level only — it hides a route, it does not secure data. Any endpoint the route calls must do its own role check server-side.
- **The client sets no `baseURL`** — it depends on the Vite proxy making `/api/auth/*` same-origin (see Dev-time API access above). A cross-origin deployment needs a `baseURL`, `credentials: 'include'`, CORS, and the origin added to `TRUSTED_ORIGINS`.
- **Seeding the admin** (`server/prisma/seed.ts`): because sign-up is disabled, it writes the `User` + `Account` rows directly through Prisma, hashing with Better Auth's own `auth.$context.password.hash()` so the credential verifies at sign-in. The `Account` row needs `providerId: "credential"`. Any future user-creation path must follow the same shape.
- **Env** (`server/.env`, see `.env.example`): `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `TRUSTED_ORIGINS` (comma-separated, split in `auth.ts`), and `ADMIN_EMAIL` / `ADMIN_PASSWORD` for the seed.

## Fetching library documentation

Use the context7 MCP tools (`resolve-library-id` then `query-docs`) to pull current documentation for this stack — Bun, Express, React, Vite, Prisma, Anthropic/Claude API, etc. — instead of relying on training data. Bun in particular moves fast enough that cached knowledge of its APIs/CLI can be stale.
