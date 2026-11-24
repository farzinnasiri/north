# North: Expo development and Apple setup

## Choose a runtime

| Mode | Purpose | Command | Metro / Fast Refresh |
| --- | --- | --- | --- |
| Expo Go | Optional preview using the matching SDK and its bundled native modules | `make expo-go` | Yes / yes |
| Development client | Daily work on an actual iPhone or Android with this app's native dependencies | `make expo-dev` | Yes / yes |
| Standalone preview | Test without a development server | `make ios-preview` (`preview` profile) | No / no |
| TestFlight | Test the store-signed iOS Release binary internally | `make ios-testflight` (or `make ios-testflight-build` + `make ios-testflight-submit`) | No / no |

North defaults to **React Native Deploy (`rnd`) on GitHub Actions** (`.github/workflows/eas-build.yml`, using GitHub's `xcode-27` / iOS 27 SDK runner on the public repo `farzinnasiri/north`) instead of Expo's EAS build queue. Use `make ios-dev-client` (alias `make build-ios-dev`), `make ios-dev-sim`, `make ios-preview`, and `make android-dev-client` for cloud builds; `make ios` and `make android` start Metro and do not compile an app.

The default native development path is a development client plus Metro. Build and install the client once (via the QR install page published to `https://oooflabs-rn-deploy.pages.dev`), then reuse it for JavaScript, styles, assets and worklet changes. Native dependency/version, SDK, plugin, entitlement, permission, scheme or other native-config changes need a new cloud client build and reinstall. Commit and push changes to GitHub before starting a cloud build, since GitHub Actions builds the pushed branch commit. Build numbers are local (`appVersionSource: "local"`): bump `expo.ios.buildNumber` in `app.json` for each new TestFlight upload.

All native compilation stays on GitHub Actions via `rnd`. Do not use local Xcode builds or download SDKs/emulators unless explicitly requested. A paid Apple Developer membership is needed for physical-iPhone ad-hoc clients and TestFlight. Direct iPhone installation also needs device registration (`make ios-device-register`) and Developer Mode. TestFlight does not need either registration or Developer Mode.

## Registered identities and EAS profiles

EAS project: **@farzin.nasiri/north**, ID `d70b30a1-8671-4044-b939-7802f680d3f1`. Apple team: `LFJY887CD3`.

| Profile | iOS bundle ID / Android package | Backend environment | Distribution |
| --- | --- | --- | --- |
| `development` | `com.oooflabs.north.development` | EAS `development` | Development client, direct install |
| `preview` | `com.oooflabs.north.preview` | EAS `development` | Standalone, direct install |
| `testflight` | `com.oooflabs.north` | EAS `development` | Standalone Release, store signing |
| `production` | `com.oooflabs.north` | EAS `production` | Future public release |

`NORTH_APP_VARIANT` selects the installed identity and scheme, independently of the backend. Schemes are `north-development`, `north-preview` and `north`. TestFlight deliberately uses the permanent identity with development services for private testing. EAS `distribution: internal` is direct installation; TestFlight internal testing uses `distribution: store`. Do not promote a development-backed binary to the public store.

Permanent, development and preview Apple identifiers were registered during initial setup on 19 October 2026. North has no push capability: its one notification, the check-in, is local. The App Store Connect record is created and linked as `6824608465`. No app build, submission, OTA update or production deployment is part of this initial setup.

## Public settings and daily work

North needs no required public settings. The owner may run `make eas-env-sync` to upload the optional `EXPO_PUBLIC_CONTENT_URL`; the app otherwise uses the deployed content Worker. Agents must not open local env files.

```sh
make eas-info
make eas-env-status          # checks required setting presence, without printing values
make ios-device-register     # only for a new iPhone; the owner's Reed phone is already registered
make ios-dev-client          # first build or after native changes; runs only when requested
# Or make android-dev-client
make expo-dev                # daily Metro server, using saved EAS development settings
```

Native launch commands disable dotenv loading and explicitly choose development. `ENV=production` does not switch these shared launch commands. They use EAS `env:exec --non-interactive` to inherit Metro's terminal streams. Do not set `CI=1` for local Metro: it disables file watching and Fast Refresh. Keep the phone and computer on a reachable network; use the launcher or terminal QR code. Do not start a second Metro server on top of one already running.

North has no app backend. Content is published with `make content-push`; see `content-api/README.md`.

## App Store Connect record

The owner created this record on 19 October 2026. Its exact bundle ID, listing name, SKU and primary language were read back through Apple; `make ios-app-link` saved its numeric Apple ID in `submit.testflight.ios.ascAppId` in `eas.json`.

| Field | Value |
| --- | --- |
| Platform | iOS |
| Listing name | North: Your Daily Direction |
| Apple app ID | `6824608465` |
| Primary language | English (U.S.) |
| Bundle ID | `com.oooflabs.north` |
| SKU | `oooflabs-north-ios` |

The installed app remains **North**. Preserve this existing record and bundle ID; do not create a replacement app or identifier. Direct development/preview installs do not need their own App Store Connect records.

To verify the existing link without a build or upload:

```sh
make ios-app-link            # exact bundle lookup; refuses to replace a different app ID
make ios-testflight-check    # local preflight only
```

`ios-app-link` uses `asc --profile oooflabs`. The app-ID preflight now passes. Before a future requested beta, create an internal group with automatic build access and add only authorized App Store Connect users. No group or invitation was created during initial setup because no binary is being submitted.

## Signing and submission credentials

Cloud builds run on GitHub Actions (`farzinnasiri/north`) using `.github/workflows/eas-build.yml` and the shared oooflabs Apple signing credentials stored in GitHub Actions secrets:

- `EAS_ASC_API_KEY`, `EAS_ASC_KEY_ID` (`Q6F666S4RG`), `EAS_ASC_ISSUER_ID` (`f282a20b-2313-4ca7-b771-69e0ea111692`) — shared App Store Connect API key (`~/.config/oooflabs/apple/AuthKey_Q6F666S4RG.p8`, also stored in system keychain under `asc --profile oooflabs`).
- `EAS_IOS_DIST_P12` and `EAS_IOS_P12_PASSWORD` — team iOS Distribution certificate (`UCMN329AP2`, `~/.config/oooflabs/apple/oooflabs-ios-dist.p12`).
- `EAS_IOS_PROFILE` — `North AppStore` provisioning profile (`CW3U3TV6P8`, `~/.config/oooflabs/apple/north-appstore.mobileprovision`) for `com.oooflabs.north` (with `PUSH_NOTIFICATIONS` enabled on all three North bundle IDs).
- `EAS_INSTALL_TOKEN` + repo variable `EAS_INSTALL_URL` (`https://oooflabs-rn-deploy.pages.dev`) — publishes direct ad-hoc builds (`development` / `preview`) to an over-the-air QR install page and syncs registered devices automatically.

Ad-hoc profiles for `com.oooflabs.north.development` and `com.oooflabs.north.preview` are generated/reused automatically at build time from Apple + the device registry. Verify GitHub secrets at any time with `make credentials` (`rnd credentials --platform ios`).

## TestFlight internal distribution

The **Internal Testers** group (`1ff0fce7-ccc4-491c-88d7-a8c3ad1aa878`, `isInternalGroup: true`, `hasAccessToAllBuilds: true`, `feedbackEnabled: true`) is configured on App Store Connect app `6824608465` with `farzinnasiri@protonmail.com` enrolled. Because `usesNonExemptEncryption: false` is set in `app.config.ts`, TestFlight builds auto-clear export compliance.

```sh
make ios-testflight          # GitHub Actions (xcode-27) build + rnd submit to TestFlight
make ios-testflight-build    # Build TestFlight IPA on GitHub Actions without submitting
make ios-testflight-submit   # Download latest iOS IPA and submit to TestFlight via rnd/asc
make ios-testflight-status   # Apple processing / internal beta state
make builds                  # List recent GitHub Actions builds via rnd
```

Remember to bump `expo.ios.buildNumber` in `app.json`, commit, and push before building a new TestFlight upload. Track build completion, upload completion, Apple processing, group/tester access and physical installation separately. If an upload fails, fix the upload issue and re-run `make ios-testflight-submit` instead of rebuilding a valid binary.

EAS Update is not configured for North. Standalone code/config changes require a new cloud binary.

## Setup verification: 19 October 2026

- EAS project linking succeeded for `development`.
- Apple signing profiles are active: development ad hoc `47C58467MS` (the owner's registered iPhone) and TestFlight App Store `YGS7GD56WM`. Both reuse the team distribution certificate. Preview's identifier exists, but its direct-install profile is deferred until a preview build is requested.
- `make check` passed: lint, TypeScript, 29 suites / 127 tests, design lint and generated-token checks. Design lint reported 8 warnings.
- `make doctor` passed 20/21 checks; its remaining check flags 11 existing Expo SDK 57 patch-version mismatches. Dependency upgrades were deferred.
- Focused fixture checks passed for the EAS schema, all identity variants, the missing-app guard, exact-bundle linking/refusal to replace another ID, API-key path quoting, public-variable allowlist and upload exclusions. North's production legal guard still rejects draft legal documents.
- Apple app `6824608465` was read back as **North: Your Daily Direction**, with bundle `com.oooflabs.north`, SKU `oooflabs-north-ios` and primary locale `en-US`; the exact-bundle link and local submission preflight succeeded. No North binary, upload or device behavior has been verified.

## Reuse this workflow in another Expo project

Copy the command names and helper structure, then adapt the project's identity and public-setting allowlist. Keep the project's existing web/backend commands intact.

- Choose new permanent/development/preview bundle IDs, package names, display names and callback schemes before registering Apple IDs. Do not copy this project's EAS UUID, Update URL, Apple app ID or SKU.
- Link the intended EAS project, preserve its SDK/native dependencies, and enable only capabilities the app actually uses.
- Keep the installed variant independent of its service environment. A private TestFlight beta may use development services; a public release needs production services and its own readiness checks.
- Verify public settings, config variants, signing and the app-record guard before an explicitly requested build. Record configuration, build, upload, Apple processing and device evidence separately. Shared key paths and team IDs are machine/team setup, not portable defaults for another owner.

## References

- [Expo development builds](https://docs.expo.dev/develop/development-builds/introduction/)
- [EAS environments](https://docs.expo.dev/eas/environment-variables/usage/)
- [Direct distribution](https://docs.expo.dev/build/internal-distribution/)
- [TestFlight](https://docs.expo.dev/submit/testflight/)
