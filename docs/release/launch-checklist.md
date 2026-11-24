# North release checklist

North is local-only: no account, no sign-in, no analytics. The only network call
is the read-only content download. See [Expo setup](../EXPO-DEVELOPMENT.md) and
[content-api/README.md](../../content-api/README.md).

## Done

- [x] Permanent identity `com.oooflabs.north`, with `.development` and `.preview` identities.
- [x] Public GitHub repo (`farzinnasiri/north`) with React Native Deploy (`rnd`) workflow (`.github/workflows/eas-build.yml`, `xcode-27` / iOS 27 SDK) and GitHub Actions iOS signing secrets + install service (`https://oooflabs-rn-deploy.pages.dev`).
- [x] App Store Connect record **North: Your Daily Direction** (`6824608465`), linked by exact bundle ID, with **Internal Testers** TestFlight group (`hasAccessToAllBuilds: true`) and `farzinnasiri@protonmail.com` enrolled.
- [x] Content API: Worker `north-content` and D1 `north-content`, read-only, rate-limited, 1,200 Lines published with takeaways.

## Before a release build

- [ ] Build a new development client (`make ios-dev-client`): `expo-notifications`, `expo-glass-effect` and native tabs are native changes.
- [ ] On a physical iPhone on iOS 26: Liquid Glass on buttons, cards, tab bar, sheets and headers; the check-in notification and its three actions; cold launch offline (bundled catalogue).
- [ ] On iOS 18 and Android: the translucent glass fallback looks right.
- [ ] Remove the unused Sign in with Apple capability from the App IDs.
- [ ] Run `make content-snapshot` so the bundled catalogue matches the published one.

## Owner decisions

- [ ] Price and paywall (series plan: free download, one non-consumable unlock).
- [ ] Release countries, supported ages, content and safety review.
- [ ] Public support page and a short privacy policy that says no data is collected.

## Privacy and store forms

- [ ] Apple App Privacy: Data Not Collected. Google Data Safety: no data collected or shared.
- [ ] Review the Apple privacy manifests and required-reason APIs for each native SDK.
- [ ] Media-library permission is asked only when saving a Reality card.

## Build, review, and rollout

- [ ] Run `make check`, `make doctor`, and `make audit`.
- [ ] Build and test release binaries. Android target API meets the current Play requirement.
- [ ] Verify icons, splash, deep links, accessibility, dynamic type, and offline behavior.
- [ ] Store descriptions, screenshots, age rating, support and privacy URLs, export compliance.
- [ ] TestFlight / Play closed testing. New personal Play accounts can require 12 testers for 14 days.
- [ ] Submit only after explicit publication authorization.

## References

- [Apple review guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Google target API requirements](https://support.google.com/googleplay/android-developer/answer/11926878)
- [Google testing requirements](https://support.google.com/googleplay/android-developer/answer/14151465)
