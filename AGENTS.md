# AGENTS.md

This file is for coding agents. Keep it compact. The code and product sources
are the source of truth.

## Read first

- Read `north-product-spec.html` before changing product behavior or domain
  language. Decisions marked open there are not implementation requirements.
- Read `north.html` and `DESIGN.md` before changing UI, motion, sound, or copy.
- Read `UBIQUITOUS_LANGUAGE.md` before naming public types, functions, routes,
  stored concepts, or product copy.
- Trace the relevant flow in current code before editing. Do not infer ownership
  from filenames alone.

## Project shape

North is an Expo Router app backed by Convex. Use the paired-domain architecture
before inventing new boundaries:

- `src/app/` - thin Expo Router composition entrypoints; every file is a route
- `src/domains/` - frontend domain model, application logic, and domain UI
- `convex/domains/` - backend domain policy, persistence, and orchestration
- `src/components/ui/` - reusable, product-agnostic UI primitives
- `src/platform/`, `convex/platform/` - technical adapters
- `src/shell/` - providers and navigation composition
- `src/screens/` - screen bodies rendered by thin routes
- `convex/` - Convex framework composition roots and schema only

Frontend and backend domain names must match. Keep framework files thin and pull
complexity into the owning domain. Do not add root-level modules, cross-domain
shortcuts, or shared abstractions until an existing boundary demonstrably cannot
own the work.

## Commands

Use the Makefile instead of invoking npm, Expo, Convex, linters, tests, or type
checking directly:

```bash
make install
make dev
make ios
make android
make web
make export-web
make doctor
make audit
make convex-dev
make convex-sync
make check
```

`ENV=development` is the default. Pass `ENV=production` only when production
configuration and deployment have been explicitly authorized.

## Deployment

- The active backend is the Convex development deployment
  `dev:rosy-shepherd-21`.
- Its cloud URL is `https://rosy-shepherd-21.convex.cloud`; its HTTP Actions URL
  is `https://rosy-shepherd-21.convex.site`.
- In this repository, "sync the backend" means `make convex-sync`, which runs a
  one-shot sync to the selected environment.
- Production variables are intentionally blank. Never infer or create a
  production deployment, and never run a production Convex deploy, without
  explicit authorization in the current conversation.

## Ground rules

- Keep changes narrow. Do not clean up adjacent code, formatting, or comments.
- Prefer the simplest implementation that fully serves a current requirement.
  Avoid speculative abstractions, compatibility layers, and temporary paths.
- Grow the product in working end-to-end slices; do not create disconnected
  frontend and backend feature halves.
- Keep generated files generated. Never hand-edit `convex/_generated/**`,
  `.expo/**`, `dist/**`, or native build output.
- If `convex/_generated/ai/guidelines.md` exists, read it before Convex work.
- Convex is the durable source of truth. Local state is transient UI state or a
  documented cache, not competing persistence.
- Convex public functions validate both arguments and returns. Use indexes rather
  than post-query filters and keep public functions thin.
- Do not create a commit or push unless the user explicitly asks in the current
  conversation.

## Product invariants

- One action remains live until it is closed; there is no daily reset.
- No notifications or reminders.
- Completion uses the honor system. Do not add proof or verification.
- Inactivity does not move the bearing backward. A miss yields no movement, not
  punishment.
- Content is authored and selected deterministically in v1; do not add an LLM.
- Success is reaching north, holding it for 30 days, and being able to leave.
- Open product questions remain open. In particular, do not guess the life axes,
  bearing formula, mascot behavior, safety policy, or post-exit state.

## UI expectations

- `DESIGN.md` is the durable design contract; the HTML files are the detailed
  source prototypes.
- One screen answers one question and asks for one thing.
- Use one brass element in view. Numbers use JetBrains Mono; human prose uses
  Inter. Only weights 400 and 500 are allowed.
- Do not add dashboards, feeds, trophies, badges, levels, confetti, hype copy,
  or decorative motion.
- Verify meaningful interaction changes on iOS and Android when possible. State
  clearly when a platform was not verified.

## Verification and documentation

Run `make check` for ordinary changes. For backend behavior, add focused Convex
tests or runtime evidence appropriate to the risk; lint and type checking do not
prove persistence or concurrency behavior.

Update `AGENTS.md` only for durable agent rules, `DESIGN.md` only for durable
visual-system decisions, `UBIQUITOUS_LANGUAGE.md` only for accepted domain
language, and architecture docs only when ownership or dependency rules change.
