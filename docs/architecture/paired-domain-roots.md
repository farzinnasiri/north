# Paired domain roots

North keeps product knowledge in matching frontend and backend domain roots:

```text
src/app/                 thin Expo Router routes
src/screens/             screen composition
src/shell/               providers and navigation shell
src/domains/<domain>/    frontend domain behavior and domain UI
src/components/ui/       product-agnostic UI primitives
src/platform/            frontend technical adapters

convex/                  schema and registered composition roots
convex/domains/<domain>/ backend policy, persistence, orchestration
convex/platform/         backend technical adapters
```

## Initial boundaries

These names describe settled product knowledge, not a commitment to tables or
functions. Create a directory only when implementing the first working slice.

| Domain | Owns | Does not own |
| --- | --- | --- |
| onboarding | Reality, North Star, contract, initial calibration flow | The unresolved life axes or bearing formula |
| actions | Proposals, naming, deadlines, closeouts, notes, swaps | Bearing movement policy or content authoring |
| bearing | Bearing state, movement policy, recalibration, Hold North | Action lifecycle or the unresolved formula |
| content | Authored Actions and Lessons; deterministic selection inputs | LLM generation or Action lifecycle |
| journey | Cross-stage lifecycle from first open through Exit | Domain persistence copied from the domains above |

## Dependency rules

1. Route files compose screens and translate route parameters. They do not own
   product policy or data access.
2. Screens compose domain UI. Reusable product behavior stays in the owning
   domain, not in `screens/`.
3. A frontend domain calls the public Convex API exposed by its paired backend
   domain. It does not import backend implementation files.
4. Backend registered functions validate the transport boundary and delegate to
   domain modules. Persistence details stay behind the owning domain.
5. Platform modules adapt technology. They never choose product outcomes.
6. Cross-domain workflows are owned by the domain with the business reason to
   coordinate them. Do not create a generic service layer.
7. Shared code must be meaningfully domain-neutral. Two similar call sites are
   not enough reason to extract an abstraction.

## Why this shape

A package-per-domain monorepo was considered. It would enforce boundaries more
mechanically, but would also introduce package manifests, build orchestration,
and versioned interfaces before North has feature code. Paired roots preserve
the important ownership boundary now and leave package extraction available if
independent deployment or reuse later makes it valuable.
