# Expo agent workflow

Expo CLI (`expo`, supplied by this app's Expo dependency) handles the SDK's
development server, compatible package installation, exports and native tooling.
`@expo/agent-cli` orchestrates those tools for coding agents and adds JSON
reports, development plans, runtime inspection, package skill sync and local docs.
EAS CLI handles cloud services. The agent CLI builds on both; it does not
replace this repository's environment, build or release decisions.

The Makefile pins agent CLI **1.0.25** and runs it through pnpm's shared dlx
cache. App dependencies, the lockfile and SDK stay independent of this tool.
Change `EXPO_AGENT_VERSION` deliberately after reviewing a new release.

## Setup

```sh
make agent-setup
make agent-status
make agent-plan PLATFORM=ios
# Or: make agent-plan PLATFORM=android
```

Setup updates Expo's managed block in `AGENTS.md`, makes `CLAUDE.md` import
it, links package skills for Codex and Claude Code, and caches this project's
SDK docs under `~/.expo/agent-cli/docs`. It reuses the globally installed Expo
skills (`expo-overview` and its related skills), so `--no-plugins` avoids
installing a duplicate plugin. On a new machine, install the official Expo
agent skills/plugin if `expo-overview` is missing. Package skill availability
depends on installed dependencies; an empty list does not require an SDK upgrade.
Generated links are machine-local and ignored by git. Run `make agent-skills`
after dependency changes. Setup can refresh the generated reference; keep
project-specific rules outside its markers.

## Daily loop

1. Run `make agent-status` and inspect `make agent-plan PLATFORM=ios` (or
   `android`) to understand compatibility and rebuild needs.
2. For an already installed development client, run `make agent-start` in a
   separate terminal. It invokes agent CLI `start --dev-client --lan`, syncs
   package skills, and starts Metro with `EXPO_NO_DOTENV=1` and the development
   identity (no EAS login needed). It does not build or boot a
   simulator. Open the installed client and connect through its launcher/QR.
   Use `PORT=8082` if necessary; reuse an existing Metro server first. Ctrl-C
   stops this foreground server. Do not set `CI=1`; it disables Fast Refresh.
3. Edit, use Fast Refresh/full reload, and run the relevant existing Make checks.
   `make expo-dev` remains the interactive native workflow; `make dev` remains
   the existing browser workflow. Start one Metro server for the chosen mode.
4. Use `make agent ARGS="help runtime:errors"` (or another command's help)
   before runtime automation. Some commands require a device bound by agent CLI
   `dev`, an installed compatible debug build, or SDK 58+. A manually connected
   physical client alone does not establish that binding. If unavailable,
   report the missing capability and verify on the device through the existing
   workflow. Do not trigger a build or create a simulator to make a check pass.

A status of "no recorded build" means this CLI has no build baseline; it does
not prove the development client on the phone is missing or incompatible.
Likewise, Expo Go compatibility is the CLI's package analysis, not device evidence.

Native dependency, SDK, plugin, entitlement, permission and native-config
changes need a new cloud client build and reinstall. Follow
[the native development runbook](../docs/EXPO-DEVELOPMENT.md) and the existing
`make ios-dev-client` / `make android-dev-client` commands when a build is requested.
The generic agent CLI `dev` and `smoke` commands can build/prebuild, install
software or start paid EAS sessions; a printed plan is not approval to run it.
Use their command help and review their plan before an authorized execution.
`--eas` is an explicit cloud choice, not the daily physical-device Metro path.
Deployment, OTA updates, backend publication and TestFlight remain separate
requested actions through the existing project commands.

## Other agent commands

```sh
make agent ARGS="help workflow"
make agent ARGS="skills:list --json"
make agent ARGS="docs:search development-builds"
make agent ARGS="doctor --json"
make agent ARGS="install expo-image" # only when adding this dependency is part of the task
```

`make agent` passes arguments to the pinned CLI with dotenv disabled and the
development identity selected. Only `agent-start` injects saved EAS public
settings; use the existing EAS-wrapped project commands when an operation needs
them. Never inspect local env files or print credentials.

Reports use `--json`; stdout carries the report and stderr carries progress.
Exit codes: `0` success, `1` tool/usage error, `7` a human step is required,
`20` a measured failure, `22` inconclusive.
These are CLI exit codes; Make itself returns `2` for a failed recipe.
Inspect the JSON result to distinguish failures when using the Make targets.
Follow suggested commands only when they serve the task and respect this
project's rules. Status/plans establish
tooling state; they do not prove app behavior, native auth, haptics or background
delivery. Report device evidence separately.

Reference: [Expo's agent CLI announcement](https://expo.dev/blog/introducing-expo-agent-cli).
