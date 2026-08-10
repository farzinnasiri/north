# North

North is an Expo Router application backed by Convex. The current repository is
a deliberately small foundation: a branded shell, environment wiring, design
contract, and paired frontend/backend domain boundaries. Product features are
not implemented yet.

## Setup

```bash
cp .env.development.example .env.development
cp .env.production.example .env.production
make install
make convex-sync
make dev
```

Use `make ios`, `make android`, or `make web` for a specific target. Run
`make check` before handing off changes. `make doctor` checks Expo dependency
compatibility, and `make audit` checks runtime dependencies. Do not invoke Expo,
Convex, npm scripts, or test tools directly; the Makefile owns those details.

Development uses `https://rosy-shepherd-21.convex.cloud`. Production values are
intentionally blank until a production deployment is chosen.

## Source documents

- `north-product-spec.html` — product decisions and explicitly open problems
- `north.html` — visual system, copy, and prototype screens
- `DESIGN.md` — machine-readable tokens and durable design guidance
- `UBIQUITOUS_LANGUAGE.md` — accepted product vocabulary
- `docs/architecture/paired-domain-roots.md` — ownership and dependency rules
