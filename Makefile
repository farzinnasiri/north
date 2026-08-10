ENV ?= development
ENV_FILE := .env.$(ENV)

.PHONY: install dev ios android web export-web doctor audit lint typecheck test design-lint check convex-dev convex-sync env-check

env-check:
	@test -f "$(ENV_FILE)" || (echo "Missing $(ENV_FILE). Copy it from $(ENV_FILE).example." && exit 1)

install:
	npm install

dev: env-check
	@set -a; . ./$(ENV_FILE); set +a; npm run start

ios: env-check
	@set -a; . ./$(ENV_FILE); set +a; npm run ios

android: env-check
	@set -a; . ./$(ENV_FILE); set +a; npm run android

web: env-check
	@set -a; . ./$(ENV_FILE); set +a; npm run web

export-web: env-check
	@set -a; . ./$(ENV_FILE); set +a; npx expo export --platform web

doctor:
	npx expo-doctor

audit:
	npm audit --omit=dev

lint:
	npm run lint

typecheck:
	npm run typecheck

test:
	npm test

design-lint:
	npm run design:lint

check: lint typecheck test design-lint

convex-dev: env-check
	@set -a; . ./$(ENV_FILE); set +a; npx convex dev

convex-sync: env-check
	@set -a; . ./$(ENV_FILE); set +a; npx convex dev --once
