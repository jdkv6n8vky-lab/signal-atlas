# Adding a Signal Atlas module

## File workflow

1. Add `assets/js/modules/your-module.js` and a corresponding stylesheet.
2. Copy a topic HTML file, update its metadata and the two module-specific asset references, and set `data-module="your-module"` on `#module-root`.
3. Register your definition under that same ID in `window.SignalAtlasModules`.
4. Add a live entry to the homepage collection and topic map. Update its module count and the README.
5. Test every chapter, control state, reading screen, and checkpoint at the supported sizes before labeling it live.

Use classic scripts, relative paths, and bundled assets. Avoid imports, fetch requests, web fonts, CDNs, and runtime dependencies so the new module also works from a local file.

## Definition contract

The existing definitions are complete reference implementations. A definition has these fields:

| Field | Purpose |
| --- | --- |
| `id`, `number`, `title`, `discipline`, `accent` | Identity and shared shell styling |
| `initialState` | JSON-compatible data, cloned for each restart |
| `steps` | Ordered chapter definitions |
| `metrics(state, step)` | Scientific readings: `{label, value, unit?, trend?}` |
| `render(state, step)` | Mechanism HTML, normally a responsive SVG |
| `onEnter(state, step, index)` | Optional chapter-specific initialization or state locking |
| `onControl(state, id, value, step)` | Optional response after the engine assigns `state[id]` |
| `onAction(state, action, step)` | Optional named button-action handler |
| `tick(state, dt, step)` | Optional simulation step; `dt` is elapsed seconds. Return `true` when the stage and metrics need redrawing. |
| `sources` | Authoritative references as `{label, url}` |

The engine calls `tick` approximately four times per second while the mechanism is playing and the page is visible. CSS or SVG handles smooth particle motion between updates. Keep elapsed-time phase in state when a redraw would otherwise restart meaningful animation.

## Chapter types

Every chapter has `title`, a concise `description`, and optionally `stageTitle`, `stageSubtitle`, and a short scientific `note`.

- **Mechanism:** omit `type` or set it to `mechanism`. Add a module-specific `phase`, relevant `controls`, and `context: {title, body}`. The context can also be a function of state.
- **Glossary:** `type: 'glossary'`, with `terms: [{term, definition}]`.
- **Facts:** `type: 'facts'`, with `facts: [{title, body}]` and optional chapter-specific `sources`.
- **Quiz:** `type: 'quiz'`, with `quiz: {question, options, correct, explanation}`. `options` is an array of strings; `correct` is its zero-based answer index.

The engine completely replaces the mechanism on reading screens and clears its metrics, controls, and context. Quiz feedback and retry behavior are automatic.

## Controls

- **Range:** `{type: 'range', id, label, min, max, step, unit, hint}`. Numeric values are assigned to `state[id]` on input.
- **Choices:** `{type: 'choices', id, label, options: [{value, label}], hint}`. The original option value type is preserved.
- **Actions:** `{type: 'actions', label, options: [{action, label}], hint}`. Calls `onAction`.

A semantic button inside a rendered mechanism can use `data-action="action-name"`; the engine delegates it to the module handler. Do not attach global event listeners from a render function.

## Visual and scientific rules

Use a responsive viewBox (the existing mechanisms use approximately 1000 × 560) with explicit accessible titles/descriptions. Prefix SVG IDs and CSS classes with the module ID. Leave generous internal margins, use a consistent label scale, and keep annotations out of moving paths. The shared stage reserves separate areas for its title, metrics, and context.

Respect `.is-paused` and reduced-motion preferences. Do not introduce hidden animation loops that ignore engine playback. Keep CSS selectors module-specific to protect the other illustrations.

Model limitations should be visible at the chapter where they matter. Control changes must visibly influence the mechanism. Avoid arbitrary scientific readings: show meaningful values or label relative/illustrative scales clearly. Cite original research or authoritative scientific references and distinguish a model outcome from a guaranteed biological result.
