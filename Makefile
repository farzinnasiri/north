SHELL := /bin/bash
.DEFAULT_GOAL := help

# Expo CLI serves the existing interactive workflow; agent-cli adds agent reports and skills.
EXPO_AGENT_VERSION := 1.0.25
EXPO_AGENT := pnpm --silent dlx @expo/agent-cli@$(EXPO_AGENT_VERSION)
EXPO_AGENT_ENV := EXPO_NO_DOTENV=1 NORTH_APP_VARIANT=development EXPO_PUBLIC_APP_ENV=development
PLATFORM ?= ios
ARGS ?= help

.PHONY: agent agent-setup agent-status agent-plan agent-start agent-skills agent-help

agent: ## Run the pinned agent CLI, e.g. make agent ARGS="runtime:errors --json"
	@$(EXPO_AGENT_ENV) $(EXPO_AGENT) $(ARGS)

agent-setup: ## Refresh project instructions, package skills and SDK docs for Codex/Claude
	@$(EXPO_AGENT_ENV) $(EXPO_AGENT) agents:setup --yes --project --agent codex --agent claude-code --no-plugins --json

agent-status: ## Inspect project/native compatibility without starting or building the app
	@$(EXPO_AGENT_ENV) $(EXPO_AGENT) status --json

agent-plan: ## Inspect the native dev plan without executing it; PLATFORM=ios|android|web
	@case "$(PLATFORM)" in ios|android|web) ;; *) echo "PLATFORM must be ios, android or web" >&2; exit 1 ;; esac
	@$(EXPO_AGENT_ENV) $(EXPO_AGENT) dev --$(PLATFORM) --dev-client --plan --json

agent-start: ## Metro + package skill sync for the installed client
	@$(EXPO_AGENT_ENV) $(EXPO_AGENT) start --dev-client --lan $(if $(PORT),--port $(PORT))

agent-skills: ## Refresh dependency-provided skill links and their AGENTS.md index
	@$(EXPO_AGENT_ENV) $(EXPO_AGENT) skills:sync --agent codex --agent claude-code --json

agent-help: ## Show the project-specific agent workflow
	@cat docs/EXPO-AGENT.md

ENV ?= development
ENV_FILE := .env.$(ENV)
EAS := pnpm dlx eas-cli@25.2.0
EAS_ENV ?= $(ENV)
PROFILE ?= development

.PHONY: install add dev go ios android web doctor audit audit-fix atlas tokens tokens-check lint typecheck test design-lint check env-check content-check content-snapshot content-push content-deploy

env-check:
	@test -f "$(ENV_FILE)" || (echo "Missing $(ENV_FILE). Copy it from $(ENV_FILE).example." && exit 1)

install:
	pnpm install --frozen-lockfile
eas-init:
	EXPO_NO_DOTENV=1 $(EAS) project:init --account farzin.nasiri --non-interactive

eas-info:
	EXPO_NO_DOTENV=1 $(EAS) project:info

add:
	@test -n "$(PKG)" || (echo 'Usage: make add PKG="expo-image react-native-svg"' && exit 1)
	pnpm exec expo install $(PKG)

dev: env-check
	@set -a; . ./$(ENV_FILE); set +a; EXPO_PUBLIC_APP_ENV="$(ENV)" portless north pnpm run web

go: expo-go

ios: expo-dev

android: expo-dev

web:
	@$(MAKE) dev

doctor:
	pnpm dlx expo-doctor

audit:
	pnpm audit --prod

audit-fix:
	pnpm audit --fix

atlas:
	EXPO_UNSTABLE_ATLAS=true pnpm exec expo export --platform ios

tokens:
	pnpm run tokens

tokens-check:
	pnpm run tokens --check

lint:
	pnpm run lint

typecheck:
	pnpm run typecheck

test:
	pnpm test

design-lint:
	pnpm run design:lint

check: lint typecheck test design-lint tokens-check

# Content: data/lines.jsonl is the one file to edit. See content-api/README.md.
content-check: ## Validate data/lines.jsonl
	node scripts/content.mjs check

content-snapshot: ## Rewrite the catalogue bundled in the app from data/lines.jsonl
	node scripts/content.mjs snapshot

content-push: ## Publish data/lines.jsonl to the D1 database (needs cf login with D1 access)
	node scripts/content.mjs push

content-deploy: ## Deploy the read-only content Worker
	cd content-api && pnpm install --frozen-lockfile && pnpm run typecheck && cf deploy

# Native cloud builds default to React Native Deploy (`rnd`) on GitHub Actions (xcode-27).
.PHONY: help expo-go expo-dev expo-dev-clean ios-device-register ios-dev-client ios-dev-sim ios-preview android-dev-client \
	ios-testflight-check ios-testflight-build ios-testflight-submit ios-testflight ios-testflight-status \
	build-ios-dev build-ios-sim build-ios-preview build-ios-testflight submit-testflight builds credentials \
	eas-init eas-info eas-env-sync eas-env-status

help:
	@echo 'Agents: make agent-status, make agent-plan PLATFORM=ios|android, make agent-start'
	@echo 'Agent setup and guide: make agent-setup, make agent-help'
	@echo "Daily: make dev (web), make expo-dev (installed native client), make expo-go (optional)"
	@echo "Cloud builds (GitHub Actions / rnd, xcode-27):"
	@echo "  make ios-dev-client (or build-ios-dev), make ios-dev-sim (or build-ios-sim), make ios-preview (or build-ios-preview)"
	@echo "  make android-dev-client, make ios-device-register, make builds, make credentials"
	@echo "TestFlight: make ios-testflight (build+submit), make ios-testflight-build (or build-ios-testflight),"
	@echo "  make ios-testflight-submit (or submit-testflight), make ios-testflight-status"
	@echo "Apple: make ios-app-link, make ios-testflight-check"
	@echo "Checks: make check, make doctor; content: make content-check / content-push / content-deploy"
	@echo "go = expo-go; ios/android = expo-dev. Cloud builds run on GitHub Actions via rnd."

expo-go:
	pnpm run expo:go

expo-dev:
	pnpm run expo:dev

expo-dev-clean:
	pnpm run expo:dev:clean

ios-device-register:
	pnpm run ios:device-register

ios-dev-client:
	pnpm run ios:dev-client

ios-dev-sim:
	pnpm run ios:dev-sim

ios-preview:
	pnpm run ios:preview

android-dev-client:
	pnpm run android:dev-client

ios-testflight-check:
	pnpm run ios:testflight:check

ios-testflight-build:
	pnpm run ios:testflight:build

ios-testflight-submit:
	@node scripts/check-ios-submission.mjs
	rnd build:download --platform ios
	@IPA=$$(ls -t build/*.ipa 2>/dev/null | head -n 1); \
	if [ -z "$$IPA" ]; then (cd build && unzip -o $$(ls -t *.zip | head -n 1)); IPA=$$(ls -t build/*.ipa | head -n 1); fi; \
	rnd submit --platform ios --profile testflight --path "$$IPA"

ios-testflight:
	pnpm run ios:testflight

ios-testflight-status:
	pnpm run ios:testflight:status

build-ios-dev: ios-dev-client
build-ios-sim: ios-dev-sim
build-ios-preview: ios-preview
build-ios-testflight: ios-testflight-build
submit-testflight: ios-testflight-submit

builds: ## List recent React Native Deploy builds
	rnd build:list

credentials: ## Verify GitHub Actions signing secrets for iOS
	rnd credentials --platform ios

# Owner-authorized helper: sources local config and sends only the public allowlist.
eas-env-sync: env-check
	@set -e; set -a; . "./$(ENV_FILE)"; if [ -f .env.local ]; then . ./.env.local; fi; set +a; \
	EXPO_NO_DOTENV=1 node scripts/eas-public-env.mjs sync "$(EAS_ENV)"

eas-env-status:
	EXPO_NO_DOTENV=1 $(EAS) env:exec "$(EAS_ENV)" 'node scripts/eas-public-env.mjs check "$(EAS_ENV)"' --non-interactive

.PHONY: ios-app-link ios-signing

ios-app-link: ## Link the Apple app record by its exact bundle ID; no build or upload
	pnpm run ios:app-link

ios-signing: ## Configure EAS signing only, PROFILE=development|testflight|preview
	EXPO_NO_DOTENV=1 EXPO_NO_CAPABILITY_SYNC=1 \
	EXPO_ASC_API_KEY_PATH="$${EXPO_ASC_API_KEY_PATH:-$$HOME/.config/oooflabs/apple/AuthKey_Q6F666S4RG.p8}" \
	EXPO_ASC_KEY_ID=Q6F666S4RG EXPO_ASC_ISSUER_ID=f282a20b-2313-4ca7-b771-69e0ea111692 \
	EXPO_APPLE_TEAM_ID=LFJY887CD3 EXPO_APPLE_TEAM_TYPE=INDIVIDUAL \
	$(EAS) credentials:configure-build -p ios -e "$(PROFILE)"
