# Implementation Plan

Based on `project-scope.md` and `tech-stack.md`. Each phase should leave the system in a working, demoable state.

## Phase 0 — Project Setup

- [ ] Initialize monorepo structure (`client/`, `server/`)
- [ ] Scaffold Express + TypeScript server (build, dev script, tsconfig)
- [ ] Scaffold React + TypeScript client with React Router (Vite)
- [ ] Add Tailwind CSS to client
- [ ] Set up Prisma with PostgreSQL, confirm local DB connection
- [ ] Add `.env` handling for both client and server, document required vars
- [ ] Write Dockerfile(s) + docker-compose for local dev (app + Postgres)
- [ ] Set up linting/formatting (ESLint, Prettier) for both packages

## Phase 1 — Data Model & Auth

- [ ] Define Prisma schema: `User` (role: admin/agent), `Ticket`, `Message`, `Session`
- [ ] Add `TicketStatus` enum (open, resolved, closed) and `TicketCategory` enum (general_question, technical_question, refund_request) to schema
- [ ] Write and run initial migration
- [ ] Implement DB-backed session auth (login, logout, session middleware)
- [ ] Write seed script that creates the initial admin account on first deploy
- [ ] Implement role-based access middleware (admin-only vs agent-accessible routes)
- [ ] API: admin can create/list/deactivate agent accounts
- [ ] Client: login page
- [ ] Client: admin page to create/list agents

## Phase 2 — Email Ingestion → Tickets

- [ ] Configure inbound parse webhook (SendGrid or Mailgun) pointing at server endpoint
- [ ] API: endpoint receives inbound email payload, validates request source
- [ ] Parse sender, subject, body, attachments from inbound payload
- [ ] Create `Ticket` + first `Message` from a new inbound email
- [ ] Detect replies to an existing ticket (subject tag or `In-Reply-To`/`References` headers) and append as `Message` instead of new ticket
- [ ] Store attachments (to disk/object storage, referenced from `Message`)
- [ ] Basic sender validation to reject obvious spam/empty payloads

## Phase 3 — Core Ticket Management UI

- [ ] API: list tickets with filter (status, category) and sort params
- [ ] API: get single ticket with full message thread
- [ ] API: update ticket status / category (manual override)
- [ ] Client: dashboard shell (nav, auth-gated routes)
- [ ] Client: ticket list view with filter/sort controls
- [ ] Client: ticket detail view with message thread
- [ ] Client: manual status/category controls on ticket detail
- [ ] Client: dashboard summary (counts by status/category)

## Phase 4 — AI Classification & Summaries

- [ ] Server: Claude API client wrapper (key config, retries, error handling)
- [ ] Prompt + function: classify ticket into one of the 3 categories
- [ ] Auto-classify on ticket creation; store result; allow agent to override
- [ ] Prompt + function: generate a short AI summary for a ticket thread
- [ ] Client: show AI summary and category (with override control) on ticket detail
- [ ] Fallback behavior when AI call fails (leave category unset / flag for manual review)

## Phase 5 — Knowledge Base & Suggested Replies

- [ ] Prisma schema: `KnowledgeBaseArticle` (title, content, embedding)
- [ ] Admin CRUD API + UI for KB articles
- [ ] Generate/store embeddings for KB articles (pgvector)
- [ ] Retrieval function: fetch relevant KB articles for a given ticket
- [ ] Prompt + function: generate a suggested reply using retrieved KB content
- [ ] Client: show suggested reply as an editable draft on ticket detail (agent must approve/edit, not auto-sent)

## Phase 6 — Outbound Replies

- [ ] Server: send approved reply via SendGrid/Mailgun outbound API
- [ ] Thread outbound reply correctly (headers/subject) so future replies match the ticket
- [ ] Update ticket status on send (e.g., open → resolved)
- [ ] Store sent reply as a `Message` on the ticket
- [ ] Client: send/approve action on the suggested reply draft

## Phase 7 — Hardening & Deployment

- [ ] Session security review (expiry, secure cookies, CSRF protection)
- [ ] Rate limiting / auth on inbound webhook endpoint
- [ ] Centralized error logging (server) and basic request logging
- [ ] Production Dockerfile(s), deploy to chosen cloud provider
- [ ] Environment/secrets setup in deployment target
- [ ] Smoke test: end-to-end flow from inbound email to sent reply in deployed environment
