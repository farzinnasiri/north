# AGENTS.md

## Expo CLI and agent CLI

Read [docs/EXPO-AGENT.md](docs/EXPO-AGENT.md) for the agent workflow.
Expo CLI is the underlying SDK development tool; `@expo/agent-cli` adds
structured status/plans, package skills, local docs and runtime automation.
For agent work use the pinned Make entrypoints: `make agent-status`,
`make agent-plan PLATFORM=ios`, `make agent-start`, and
`make agent ARGS="help workflow"`. Refresh setup with `make agent-setup`
and dependency skills with `make agent-skills`.
The existing `make expo-dev`, `make expo-go`, `make dev`, checks and release
commands retain their roles. Follow this project's Make commands and environment,
build and delivery rules when using the generic Expo reference below.
`agent-start` only starts Metro for an installed client using EAS development
settings; it does not compile native code. `agent-plan` only reports a plan.
Do not execute `dev` or `smoke` plans that build, install tooling or start paid
EAS sessions without the corresponding explicit request. Runtime commands may
require a CLI-bound supported device; report that limitation rather than
starting a build to satisfy it.


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

North is a local-only Expo Router app: no account, no login, and no server copy
of anything the person enters. The one backend is a read-only content API.

- `src/app/` - thin Expo Router composition entrypoints; every file is a route
- `src/domains/` - domain model, application logic, local stores, and domain UI
- `src/components/ui/` - reusable, product-agnostic UI primitives
- `src/platform/` - technical adapters (haptics, sound, check-in notification, content API)
- `src/shell/` - providers and app-wide effects
- `src/screens/` - screen bodies rendered by thin routes
- `data/lines.jsonl` - the content catalogue; the one file to edit
- `content-api/` - the Cloudflare Worker that serves the catalogue read-only

Keep framework files thin and pull complexity into the owning domain. Do not add
root-level modules, cross-domain shortcuts, or shared abstractions until an
existing boundary demonstrably cannot own the work.

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
- The Journey (profile, readings, Actions, notes, preferences) lives in
  `expo-sqlite` `localStorage` through `@/domains/journey/store`. Nothing the
  person enters leaves the phone.
- Content comes from `@/domains/content/store`: the catalogue bundled in the app
  (`src/domains/content/catalogue.json`), replaced by a newer download from the
  content API when one exists. Matching happens on the phone.
- Navigation is Expo Router with native `Stack` and `formSheet`.
  Import from `expo-router/react-navigation`, never `@react-navigation/*`.
- `expo-audio` not `expo-av`; `expo-image` not `Image`; `expo-sqlite`
  `localStorage` not AsyncStorage; `react-native-svg` not Skia.
- Content carries no icons except the existing Settings gear; the system tab bar
  uses SF Symbols.
- Liquid Glass comes from `expo-glass-effect` through `@/components/ui/glass`,
  the system tab bar (`expo-router/unstable-native-tabs`), sheets and headers.
  Never give the tab bar a solid background colour; it turns the glass off.
- `expo-notifications` is used for exactly one thing: the check-in. Do not add
  platform semantic colors or an icon-font package.
- No barrel files. Import from the defining module.

## Commands

Use the Makefile instead of invoking pnpm, Expo, linters, tests, or type
checking directly:

```bash
make install
make add PKG="expo-image"
make dev # web app at https://north.localhost
make go
make expo-dev
make expo-go
make ios-dev-client
make android-dev-client
make eas-env-status
make ios-app-link
make ios
make android
make doctor
make audit
make atlas
make tokens
make content-check     # validate data/lines.jsonl
make content-push      # publish it to D1 (owner's cf login with D1 access)
make content-deploy    # deploy the read-only content Worker
make check
```

Add dependencies with `make add`, never bare `pnpm install`; it routes through
Expo's SDK-compatible installer so versions stay aligned with the SDK.

### Native development and delivery

- Read `docs/EXPO-DEVELOPMENT.md` before native build or Apple setup. Cloud builds
  default to **React Native Deploy (`rnd`) on GitHub Actions** (`xcode-27` / iOS 27 SDK,
  public repo `farzinnasiri/north`, `.github/workflows/eas-build.yml`), not Expo's paid
  EAS build queue. Preserve the registered oooflabs Apple identities and App Store
  Connect app `6824608465`.
- Default to `make expo-dev` with the installed **North Development** client.
  `make expo-go` is an optional supported preview. `go` aliases Expo Go; `ios` and
  `android` alias the shared Metro server. Use the explicit `make ios-dev-client`
  (alias `make build-ios-dev`), `make ios-dev-sim`, `make ios-preview`,
  `make android-dev-client`, `make ios-testflight` (build + submit),
  `make ios-testflight-build` (alias `make build-ios-testflight`), and
  `make ios-testflight-submit` (alias `make submit-testflight`) targets for cloud
  builds/submissions on GitHub Actions via `rnd`. Check runs with `make builds` and
  signing secrets with `make credentials`. Do not build or submit merely to inspect setup.
- `rnd build` dispatches GitHub Actions against the pushed git branch, so commit and
  push changes before starting a cloud build. Build numbers are local (`appVersionSource: "local"`):
  bump `expo.ios.buildNumber` / `expo.android.versionCode` in `app.json` for each new
  TestFlight / store upload.
- Native launch commands run with `EXPO_NO_DOTENV=1` and require no EAS cloud login
  (North has no required public settings; `EXPO_PUBLIC_CONTENT_URL` defaults to the
  deployed content Worker). Never open local env files. Do not set `CI=1` on Metro
  because it disables file watching and Fast Refresh.
- JavaScript, style and worklet edits normally need refresh/reload. Native modules,
  SDKs, plugins, entitlements, permissions or native config need a new cloud build
  and reinstall. Direct iPhone builds (`development` / `preview`) publish an
  over-the-air install page + QR code at `https://oooflabs-rn-deploy.pages.dev` and
  auto-provision ad-hoc profiles from Apple + the device registry.
- `NORTH_APP_VARIANT` controls identity; `EXPO_PUBLIC_APP_ENV` controls services.
  TestFlight is a store-signed Release binary (`com.oooflabs.north`) using development
  services for the private beta, uploaded via `rnd submit` / `asc` to the **Internal Testers**
  group (`hasAccessToAllBuilds: true`). Preserve the separate production legal/service guards.
  `distribution: internal` means direct ad-hoc installation, not TestFlight internal testing.
- Apple identifiers and the App Store Connect record (`6824608465`) are linked.
  Preserve the existing mapping documented in the runbook; do not recreate the app.
  `make ios-app-link` verifies its exact bundle ID and refuses to replace a different app ID.
  No production deployment, OTA publication or public/external distribution is implicitly authorized.
- Verify build, upload, Apple processing, intended tester access and device installation
  separately. Reuse an existing successful build artifact (`make ios-testflight-submit`)
  for upload-only retries. Browser and compiler checks do not establish native cold launch
  or background behavior.

### Local development with Portless

- For North's browser build, run `make dev` and open `https://north.localhost`; the Makefile runs Expo Web through Portless.
- Use that named URL as the canonical origin for browser QA; do not select, expose, or hard-code the internal localhost port assigned by Portless.
- Native development uses `make expo-dev`, or optional `make expo-go`. Portless is for the browser-facing local server and does not replace Metro's device connection workflow.
- Keep `make dev` running while testing. Invoke `pnpm run web` directly only when specifically diagnosing Portless itself. `make web` is an alias for `make dev`.

`ENV=development` is the default. Pass `ENV=production` only when production
configuration and deployment have been explicitly authorized.

## Deployment

- The content API is the Cloudflare Worker `north-content` in `content-api/`,
  served at `https://north-content.farzin-nasiri.workers.dev/v1/catalogue`. It
  reads the D1 database `north-content` and has no write path.
- Content is published only with `make content-push`, which uses the owner's own
  `cf` login. Never add a write endpoint, an admin token, or person data to it.
- Deploying the Worker (`make content-deploy`) and pushing content change what
  every installed app downloads. Do both only when the owner asks.

## Ground rules

- Keep changes narrow. Do not clean up adjacent code, formatting, or comments.
- Prefer the simplest implementation that fully serves a current requirement.
  Avoid speculative abstractions, compatibility layers, and temporary paths.
- Grow the product in working end-to-end slices; do not create disconnected
  frontend and backend feature halves.
- Keep generated files generated. Never hand-edit `.expo/**`, `dist/**`,
  `src/theme.ts`, or native build output. `src/domains/content/catalogue.json`
  is written by `scripts/content.mjs`.
- The phone is the source of truth for the Journey. The content catalogue is a
  cache of the API, with the bundled copy as the floor.
- Do not create a commit or push unless the user explicitly asks in the current
  conversation.

## Product invariants

- One action at a time. It stays open until he checks in; there is no daily reset.
- Exactly one notification: the check-in, at his chosen time on the day he chose,
  and only if he turned it on. No other reminders, streaks, or nudges.
- Completion uses the honor system: done, partly, or missed. Do not add proof or
  verification. Done earns the Action's degrees, partly half, missed nothing.
- Inactivity does not move the direction backward. A miss yields no movement, not
  punishment.
- Suggestions come from the catalogue, selected deterministically on the phone
  from the onboarding readings, North Star, and honest answer. Quotes are shown
  with their attribution and never rewritten. Do not add an LLM.
- Success is reaching north, holding it for 30 days, and being able to leave.
- Open product questions remain open. In particular, do not guess the life axes,
  direction formula, safety policy, or post-exit state.

## UI expectations

- `DESIGN.md` is the durable design contract; the HTML files are the detailed
  source prototypes.
- One screen answers one question and asks for one thing.
- The Compass (`@/domains/direction/ui/direction-compass`) is the one instrument.
  Numbers use JetBrains Mono; human prose uses Inter. Only
  weights 400 and 500 are allowed.
- Do not add dashboards, feeds, trophies, badges, levels, confetti, hype copy,
  or decorative motion.
- Motion, sound, and haptics are specified in `DESIGN.md`. The needle is the
  only spring, four sounds exist and no fifth may be added, a miss is silent and
  unbuzzed, and nothing animates on a loop.
- Verify meaningful interaction changes on iOS and Android when possible. State
  clearly when a platform was not verified.

## Verification and documentation

Run `make check` for ordinary changes. For the content API, run
`cd content-api && pnpm run typecheck` and check the deployed endpoint with
curl; lint and type checking do not prove what the Worker serves.

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

## Package manager

Use pnpm 12.16.1, pinned in `package.json`. Run `make install` to install the
locked dependencies with `pnpm install --frozen-lockfile`. Commit `pnpm-lock.yaml`
when changing dependencies. Keep each package root independent; pnpm shares package
contents through its global store. Do not commit `node_modules` or create npm/yarn
lockfiles. Dependency build permissions live in `pnpm-workspace.yaml`.
Add Expo/native packages with `pnpm exec expo install` to preserve SDK compatibility.

<!-- BEGIN EXPO AGENT CLI MANAGED BLOCK -->
<!-- Generated by `npx @expo/agent-cli agents:setup`. Everything inside the markers is overwritten on the next run. -->

## Expo project

- Project: north
- SDK: 57.0.26
- Native: CNG (no native directories; they are generated by `npx expo prebuild`)
- Expo Go: not compatible (8 reasons; needs a development build, run `npx @expo/agent-cli status --json` for the details)
- Dev client: `expo-dev-client` is installed

## Commands

For the operations listed below, use `@expo/agent-cli` in place of the equivalent commands elsewhere in this file or in loaded skills. Package installation still uses Expo’s SDK-compatible version resolution. Use `bunx` instead of `npx` when `bun.lock` is present.

Most commands take `--json` for a machine-readable report.

- `npx @expo/agent-cli status` — where the project is right now, and what would happen next: which sources changed since the last build, whether an update can ship over the air, and whether EAS already has a build for this fingerprint
- `npx @expo/agent-cli status --json` — the same report as one object, with the raw project probe under `probe`
- `npx @expo/agent-cli status --assert js-only` — a gate on what a change costs: exit 20 when it costs more than the class named, 22 when nothing could be measured, 0 otherwise
- `npx @expo/agent-cli dev --ios` — get the app onto that platform's device: it prints the plan, then runs it. The platform flag (--ios, --android, --web) is required; add --plan to print the steps without running them
- `npx @expo/agent-cli start` — `expo start` and nothing else: a dev server no planning may touch
- `npx @expo/agent-cli install <pkg>` — install a package and report what it changes natively
- `npx @expo/agent-cli install --fix` — fix incompatible package versions using Expo's SDK-compatible version resolution
- `npx @expo/agent-cli lint` — run the project's Expo lint command
- `npx @expo/agent-cli doctor` — diagnose dependency and configuration issues with expo-doctor
- `npx @expo/agent-cli typecheck` — run the TypeScript compiler of this project as a gate: exit 20 with the diagnostics, exit 0 when there are none. A bundle that builds and an app that does not throw do not cover this.
- `npx @expo/agent-cli runtime:eval <js>` — evaluate JavaScript in the running app
- `npx @expo/agent-cli runtime:errors` — collect the runtime errors of the running app
- `npx @expo/agent-cli navigate <route>` — open a route as a deep link on a device
- `npx @expo/agent-cli runtime:tree` — what is on the screen of the running app, by testID
- `npx @expo/agent-cli runtime:tap <testID>` — tap an element; `--verify` reports what changed
- `npx @expo/agent-cli runtime:type <text> --testID <id>` — type into an input
- `npx @expo/agent-cli skills:list` — the agent skills the installed packages ship
- `npx @expo/agent-cli new <dir>` / `npx @expo/agent-cli deploy` — create a project headlessly / deploy web and native
- `npx @expo/agent-cli smoke --ios` — the whole gate in one command: the dev server bundles, the app is up, and nothing threw

## Expo docs

The full Expo docs for this project’s SDK can be local Markdown files.
- `npx @expo/agent-cli docs:sync` downloads them and prints two directories: all docs, and this SDK’s API reference. Grep those directories.
- `npx @expo/agent-cli docs:search <query>` returns ranked pages with file paths and line numbers.
Links in the docs point to `https://docs.expo.dev/<path>.md`. To read one locally, open `<path>.md` in the docs directory that `docs:sync` printed.
Prefer the local docs over web fetches of docs.expo.dev.

## Devices

Run `npx @expo/agent-cli dev` before `navigate`, `runtime:reload` or `runtime:stop`, or they refuse with `NO_BOUND_DEVICE` and name the command. Never boot, shut down or delete a simulator named `agent-cli …` yourself, and never kill an emulator instance started with `-read-only`; it may be bound to another worktree.

## Expo skills

For Expo or EAS work, start with the `expo-overview` skill when it is available in your agent’s skill list. It routes your goal to the relevant Expo or EAS skill. Then read any matching package skills listed below for guidance specific to the installed packages.

<!-- BEGIN EXPO PACKAGE SKILLS -->
## Package skills

No linked package skills are available.

Run `npx @expo/agent-cli skills:sync` after changing dependencies to refresh this index. Run `npx @expo/agent-cli skills:list` to see available package skills.
<!-- END EXPO PACKAGE SKILLS -->

Commands end with a `Suggested next:` section — suggested follow-up commands, not required steps. Run one only when it serves your current goal.
<!-- END EXPO AGENT CLI MANAGED BLOCK -->
