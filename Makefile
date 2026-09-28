ENV ?= development
ENV_FILE := .env.$(ENV)

.PHONY: install add dev go ios android web doctor audit atlas tokens tokens-check lint typecheck test design-lint check convex-dev convex-sync env-check

env-check:
	@test -f "$(ENV_FILE)" || (echo "Missing $(ENV_FILE). Copy it from $(ENV_FILE).example." && exit 1)

install:
	npm install

add:
	@test -n "$(PKG)" || (echo 'Usage: make add PKG="expo-image react-native-svg"' && exit 1)
	npx expo install $(PKG)

dev:
	portless north npm run web

go:
	npm run start -- --go --lan

ios:
	npm run ios

android:
	npm run android

web:
	@$(MAKE) dev

doctor:
	npx expo-doctor

audit:
	npm audit --omit=dev

atlas:
	EXPO_UNSTABLE_ATLAS=true npx expo export --platform ios

tokens:
	npm run tokens

tokens-check:
	npm run tokens -- --check

lint:
	npm run lint

typecheck:
	npm run typecheck

test:
	npm test

design-lint:
	npm run design:lint

check: lint typecheck test design-lint tokens-check

convex-dev: env-check
	@set -a; . ./$(ENV_FILE); set +a; npx convex dev

convex-sync: env-check
	@set -a; . ./$(ENV_FILE); set +a; npx convex dev --once
