# Mascot module

The Mascot is a frontend-only product module under `src/domains/mascot/`. It
owns the scene interface, expression geometry, SVG rendering, interruption,
reduced motion, and the restrained motion vocabulary. It has no Convex peer
because it owns no durable state or backend policy.

## Interface

Callers render the Mascot where it belongs and pass one complete destination
scene:

```tsx
const scene: MascotScene = {
  expression: 'focused',
  completion: 0.35,
  rotations: {
    outer: { angle: 126, duration: 'settle' },
    cardinals: { angle: 30, duration: 'quick' },
    face: { angle: -3, duration: 'quick' },
  },
};

<Mascot scene={scene} size={168} style={styles.mascot} />
```

Changing `scene` transitions from the currently rendered state, including when
an earlier transition is interrupted. Angles are absolute and continuous, so
the direction and number of turns are explicit: `360` is one clockwise turn
from zero and `-90` is a quarter-turn the other way. Omitting a layer means its
destination is zero degrees.

`size` controls drawing size and `style` controls layout placement. Animated
body transforms remain private so a caller cannot accidentally replace a
gesture transform with positioning CSS.

## Why declarative

An imperative global controller was considered and rejected. It would create
hidden ordering rules, make two simultaneous Mascots conflict over one global
state, and require a mount registry or portal merely to decide where the face
appears. A scene prop keeps ownership with the screen that renders the Mascot
and makes the full result reproducible from React state.

If a distant descendant needs to change an existing Mascot, the owning domain
lifts the `MascotScene` state to their nearest common screen. A global provider
should be introduced only if a real cross-route Mascot survives navigation;
onboarding does not require one.

## Policy ownership

The Mascot module knows how expressions and motion work, not what a product
moment means. Each owning domain maps its own state to a scene. Onboarding does
that in `src/domains/onboarding/mascot-scene.ts`, where its non-judgment rule and
progress choreography can be tested without rendering SVG.

