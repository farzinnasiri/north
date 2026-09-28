# AGENTS.md

This file is for coding agents. Keep it compact. The code and product sources
are the source of truth.

## Read first

- Read `north-product-spec.html` before changing product behavior or domain
  language. Decisions marked open there are not implementation requirements.
- Read `north.html` and `DESIGN.md` before changing UI, motion, sound, or copy.
- Read `UBIQUITOUS_LANGUAGE.md` before naming public types, functions, routes,
  stored concepts, or product copy.
- Read `docs/architecture/frontend-stack.md` before adding a dependency or
  proposing a different library. It records what was already rejected and why.
- Trace the relevant flow in current code before editing. Do not infer ownership
  from filenames alone.

## Project shape

North is currently a frontend-only Expo Router prototype. The Convex scaffold is
reserved for a later phase and must not be used or changed during frontend
iteration. Use the paired-domain architecture before inventing new boundaries:

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

## Stack

iOS and Android are the product targets. Web is a development-preview surface,
not a shipping target or a parity requirement. Reasoning and rejected
alternatives live in `docs/architecture/frontend-stack.md`. Most of these are
enforced by `eslint.config.js` — if lint blocks an import, read that file before
working around it.

- Styling is React Native `StyleSheet` with tokens from `@/theme`. Never add a
  styling library, and never write a raw hex color outside the generated theme.
- `src/theme.ts` is generated from the `DESIGN.md` frontmatter by `make tokens`.
  Never hand-edit it; change `DESIGN.md` and regenerate.
- Animate with Reanimated 4, never React Native `Animated`. Use the CSS API for
  state-driven transitions and shared values for the needle and gestures.
- Entrances go through `@/components/ui/reveal`, never `entering`/`exiting`
  layout animations: those silently do not run on the web preview, and the one
  screen that needs them already pays for a `.web.tsx` fork.
- Post-onboarding state lives in `@/domains/journey/store` (Zustand, persisted
  to local storage). Screens read it; they never own product state themselves.
- Navigation is Expo Router with native `Stack`, `NativeTabs`, and `formSheet`.
  Import from `expo-router/react-navigation`, never `@react-navigation/*`.
- `expo-audio` not `expo-av`; `expo-image` not `Image`; `expo-sqlite`
  `localStorage` not AsyncStorage; `react-native-svg` not Skia.
- Content carries no icons. Native tab icons use the `sf` and `md` props.
- Do not add glass or blur effects, platform semantic colors, an icon-font
  package, or a notifications library.
- No barrel files. Import from the defining module.

## Commands

Use the Makefile instead of invoking npm, Expo, Convex, linters, tests, or type
checking directly:

```bash
make install
make add PKG="expo-image"
make dev # web app at https://north.localhost
make go
make ios
make android
make doctor
make audit
make atlas
make tokens
make convex-dev
make convex-sync
make check
```

Add dependencies with `make add`, never bare `npm install`; it routes through
`expo install` so versions stay aligned with the SDK.

### Local development with Portless

- For North's browser build, run `make dev` and open `https://north.localhost`; the Makefile runs Expo Web through Portless.
- Use that named URL as the canonical origin for browser QA; do not select, expose, or hard-code the internal localhost port assigned by Portless.
- Native Expo development continues to use `make ios`, `make android`, or `make go`. Portless is for the browser-facing local server and does not replace Metro's device connection workflow.
- Keep `make dev` running while testing. Invoke `npm run web` directly only when specifically diagnosing Portless itself. `make web` is an alias for `make dev`.

`ENV=development` is the default. Pass `ENV=production` only when production
configuration and deployment have been explicitly authorized.

## Deployment

- The current app uses local fixtures and local UI state only. Do not add Convex
  calls, schemas, functions, or backend contracts during this frontend phase.
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
- Keep frontend prototypes local. Do not modify `convex/**` unless the user
  explicitly resumes backend work.
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
- Inactivity does not move the direction backward. A miss yields no movement, not
  punishment.
- Content is authored and selected deterministically in v1; do not add an LLM.
- Success is reaching north, holding it for 30 days, and being able to leave.
- Open product questions remain open. In particular, do not guess the life axes,
  direction formula, mascot behavior, safety policy, or post-exit state.

## UI expectations

- `DESIGN.md` is the durable design contract; the HTML files are the detailed
  source prototypes.
- One screen answers one question and asks for one thing.
- Use one brass element in view. Numbers use JetBrains Mono; human prose uses
  Inter. Only weights 400 and 500 are allowed.
- Do not add dashboards, feeds, trophies, badges, levels, confetti, hype copy,
  or decorative motion.
- Motion, sound, and haptics are specified in `DESIGN.md`. The needle is the
  only spring, four sounds exist and no fifth may be added, a miss is silent and
  unbuzzed, and nothing animates on a loop.
- Verify meaningful interaction changes on iOS and Android when possible. State
  clearly when a platform was not verified.

## Verification and documentation

Run `make check` for ordinary changes. For backend behavior, add focused Convex
tests or runtime evidence appropriate to the risk; lint and type checking do not
prove persistence or concurrency behavior.

### Tests

The standard is not coverage. **A test must fail if the behavior it names is
wrong.** Before writing one, decide what broken implementation it would catch;
if the answer is none, do not write it.

- Do not assert existence alone. `toBeTruthy`, `toBeDefined`, `not.toBeNull`,
  and "it renders" are not assertions of behavior, and lint rejects them as a
  test's only claim.
- Do not write snapshot tests. A snapshot records what the code currently does,
  which is the one thing already readable from the code.
- Test values, not structure. Assert the direction a rule produces, the copy a
  person reads, the control they can press.
- Prefer one test per product rule over many tests per function, and name the
  test after the rule: `a missed deadline does not move the direction`.
- Domain math is tested exhaustively with the literal numbers from
  `north-product-spec.html`, including the cases the spec warns about. Test the
  sandbagging exploit before implementing any early-finish bonus.
- Do not test private helpers, implementation details, or third-party libraries.
- A bug fix starts with a test that reproduces the bug.
- Never weaken or delete a failing test to make `make check` pass. A failing
  test is a finding; report it.

Update `AGENTS.md` only for durable agent rules, `DESIGN.md` only for durable
visual-system decisions, `UBIQUITOUS_LANGUAGE.md` only for accepted domain
language, and architecture docs only when ownership or dependency rules change.
