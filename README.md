# North

North is currently a frontend-only Expo Router prototype. It includes the core
mobile shell, native navigation, Home, Bearing, You, onboarding, closeout, and note
flows. All visible state is local and illustrative; the reserved Convex scaffold
is not used by the running app.

## Setup

```bash
make install
make go
```

`make go` starts Expo Go in LAN mode and prints the QR code for real-time updates
on a physical device. `make dev` starts the general Expo development server.
Use `make ios` or `make android` for a product target. `make web` starts the
development-only browser preview. Run `make check` before handing off changes.
`make add PKG="..."` adds a dependency through
`expo install` so versions stay aligned with the SDK. `make tokens` regenerates
`src/theme.ts` from `DESIGN.md`, `make atlas` inspects bundle contents,
`make doctor` checks Expo dependency compatibility, and `make audit` checks
runtime dependencies. Do not invoke Expo, Convex, npm scripts, or test tools
directly; the Makefile owns those details.

North targets iOS and Android. Web exists only for faster development review;
native behavior remains authoritative and browser parity is not a product
requirement. See `docs/architecture/frontend-stack.md`.

The current frontend does not require Convex or any environment URL to render.
The development deployment configuration remains reserved for future backend
work; production values are intentionally blank.

## Source documents

- `north-product-spec.html` — product decisions and explicitly open problems
- `north.html` — visual system, copy, and prototype screens
- `DESIGN.md` — machine-readable tokens and durable design guidance
- `UBIQUITOUS_LANGUAGE.md` — accepted product vocabulary
- `docs/architecture/paired-domain-roots.md` — ownership and dependency rules
- `docs/architecture/frontend-stack.md` — library decisions, rejected
  alternatives, budgets, and testing standards
