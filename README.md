# North

North is a local-only Expo Router app: onboarding, Today (the Compass, two
Suggestions, the open Action and its Check-in), Log, and You. There is no
account. Everything a person enters stays on the phone. The one backend is a
read-only content API (`content-api/`, Cloudflare Worker + D1) that serves the
catalogue of Lines in `data/lines.jsonl`.

## Setup

```bash
make install
make expo-dev
```

Daily native work uses the installed **North Development** client plus Metro.
Build the client once with `make ios-dev-client` or `make android-dev-client`
when a build is requested (built on GitHub Actions via `rnd` with `xcode-27` and
published with a QR install link at `https://oooflabs-rn-deploy.pages.dev`), install
it on your phone, then reuse `make expo-dev` for Fast Refresh. `make expo-go` is an
optional SDK-compatible preview; `make go` aliases it. `make ios` and `make android`
alias the shared development client server. `make dev` starts the browser preview at
`https://north.localhost`.
`make web` aliases that development-only preview. Run `make check` before handing off changes.
`make add PKG="..."` adds a dependency through
`expo install` so versions stay aligned with the SDK. `make tokens` regenerates
`src/theme.ts` from `DESIGN.md`, `make atlas` inspects bundle contents,
`make doctor` checks Expo dependency compatibility, and `make audit` checks
runtime dependencies. Do not invoke Expo, pnpm scripts, or test tools
directly; the Makefile owns those details.

North targets iOS and Android. Web exists only for faster development review;
native behavior remains authoritative and browser parity is not a product
requirement. See `docs/architecture/frontend-stack.md`.

Copy `.env.development.example` to `.env.development` if the development
configuration is missing. Nothing in it is secret.

## Content

`data/lines.jsonl` is the catalogue: one Line per row, with `person`, `said`,
`said_kind`, `source_title`, `source_url`, `takeaway` (today's thing in a few
words), `do` (the concrete step), `axis` and `themes`. Edit it,
then:

| Purpose | Command |
| --- | --- |
| Validate the file | `make content-check` |
| Publish to the API (installed apps see the new version within the hour they next open) | `make content-push` |
| Refresh the copy bundled in the next app build | `make content-snapshot` |
| Deploy the Worker after changing `content-api/` | `make content-deploy` |

`make content-push` uses your own `cf` login and needs D1 access
(`cf auth login --force`, and grant D1 on the consent screen). The Worker has
no write path. Private Drive links are rejected by the validator.

## Expo, GitHub Actions (`rnd`), and Apple setup

See [the development runbook](docs/EXPO-DEVELOPMENT.md) for runtime selection,
rebuild rules, GitHub Actions `rnd` builds (`xcode-27`), signing, and App Store Connect.

| Purpose | Command |
| --- | --- |
| Daily native work | `make expo-dev` |
| Optional Expo Go preview | `make expo-go` |
| Cloud-build signed iPhone dev client (`rnd` / GitHub Actions) | `make ios-dev-client` (alias `make build-ios-dev`) |
| Cloud-build iOS Simulator dev client | `make ios-dev-sim` (alias `make build-ios-sim`) |
| Cloud-build standalone ad-hoc preview IPA | `make ios-preview` (alias `make build-ios-preview`) |
| Cloud-build Android dev client | `make android-dev-client` |
| Register a new iPhone UDID | `make ios-device-register` |
| Cloud-build + submit TestFlight internal beta | `make ios-testflight` |
| Build TestFlight IPA only / submit latest IPA only | `make ios-testflight-build` / `make ios-testflight-submit` |
| Apple processing and TestFlight status | `make ios-testflight-status` |
| List recent cloud builds / check GitHub signing secrets | `make builds` / `make credentials` |
| Verify App Store Connect app link | `make ios-app-link` |

Cloud builds run on GitHub Actions via **React Native Deploy (`rnd`)** using
`.github/workflows/eas-build.yml` on GitHub's `xcode-27` (iOS 27 SDK) runner.
Build numbers are local (`appVersionSource: "local"`): bump `expo.ios.buildNumber`
in `app.json` before each new TestFlight upload, commit, and push before running `rnd`.
The permanent iOS/Android identity is `com.oooflabs.north`; development and preview
append `.development` and `.preview`. The App Store Connect record is **North: Your Daily Direction**,
Apple app ID `6824608465`, bundle `com.oooflabs.north`, SKU `oooflabs-north-ios`, with
the **Internal Testers** group configured for automatic build access.

Native commands use saved EAS development settings and disable local dotenv
loading. Agents must not inspect local env files; the public sync command has
an explicit allowlist. JavaScript/style/worklet edits normally refresh through
Metro; native dependency, SDK, plugin or native-config changes require a new
cloud client build. A standalone TestFlight binary runs without Metro. Its
private-beta profile uses development services with the permanent app identity;
this does not activate production or bypass North's production legal guards.
EAS Update is not configured. No native build or submission was run during setup.

There is no sign-in, no account, and no analytics. The App Store privacy label
is "Data Not Collected". The [release checklist](docs/release/launch-checklist.md)
tracks what remains before a store build.

## Source documents

- `north-product-spec.html` — product decisions and explicitly open problems
- `north.html` — visual system, copy, and prototype screens
- `DESIGN.md` — machine-readable tokens and durable design guidance
- `UBIQUITOUS_LANGUAGE.md` — accepted product vocabulary
- `docs/architecture/domain-roots.md` — ownership and dependency rules
- `docs/architecture/frontend-stack.md` — library decisions, rejected
  alternatives, budgets, and testing standards

## Package manager

Use pnpm 12.16.1, pinned in `package.json`. Run `make install` to install the
locked dependencies with `pnpm install --frozen-lockfile`. Commit `pnpm-lock.yaml`
when changing dependencies. Keep each package root independent; pnpm shares package
contents through its global store. Do not commit `node_modules` or create npm/yarn
lockfiles. Dependency build permissions live in `pnpm-workspace.yaml`.
Add Expo/native packages with `pnpm exec expo install` to preserve SDK compatibility.
