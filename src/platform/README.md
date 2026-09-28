# Frontend platform adapters

Device, storage, analytics, and other technical integrations live here. Product
policy does not.

`sound.ts` owns the three finite product cues through `expo-audio`. Callers
choose the semantic cue and pass the persisted Sound preference; app-lifetime
players prevent navigation from clipping a cue and own deterministic replay.
