# Domain roots

North is local-only, so its domains live in `src/domains/` alone.

```text
src/app/                 thin Expo Router routes
src/screens/             screen composition
src/shell/               providers and app-wide effects
src/domains/<domain>/    domain behavior, local stores, and domain UI
src/components/ui/       product-agnostic UI primitives, including glass
src/platform/            technical adapters
content-api/             the read-only content Worker (Cloudflare + D1)
data/lines.jsonl         the content catalogue, the one file to edit
```

| Domain | Owns | Does not own |
| --- | --- | --- |
| onboarding | Reality, North Star, Contract, the first Suggestion | The unresolved life axes or direction formula |
| actions | The Open Action, its Days, Check-in time and Outcome | Direction movement or content |
| direction | Direction, movement per Outcome, Hold North, the Compass | The Action lifecycle |
| content | The catalogue of Lines, its sync, and Suggestion matching | Person data, which never leaves the phone |
| journey | The local Journey store from first open through Exit | Content or platform adapters |
| personalization | The Signal (profile colour) | Personality results |

## Dependency rules

1. Route files compose screens and translate route parameters. They do not own
   product policy or data access.
2. Screens compose domain UI. Reusable product behavior stays in the owning
   domain, not in `screens/`.
3. Stores write the Journey to local storage on every change. There is no
   remote copy to reconcile.
4. The content API is read-only and receives nothing about the person; the app
   downloads the whole catalogue and matches on the phone.
5. Platform modules adapt technology (haptics, sound, the check-in
   notification, the content API). They never choose product outcomes.
6. Shared code must be meaningfully domain-neutral. Two similar call sites are
   not enough reason to extract an abstraction.
