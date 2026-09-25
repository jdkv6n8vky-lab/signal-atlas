# Muscle Contraction — verification

Verified locally on 2026-09-24 using an isolated Chromium browser (Chrome 151).

## Scope

- All 20 chapters: 17 mechanism stages, glossary, key facts and eight checkpoint questions.
- Back/next, chapter selection, arrow keys, Space behavior, autoplay advancement and pause, restart and repeated navigation.
- Calcium-dependent force and shortening; invariant actin/myosin lengths and A-band width; changing I bands and H zone.
- ATP depletion preserves attached sarcomere length even when calcium is lowered. Restoring ATP enables release. Depletion at rest does not trigger shortening.
- All four cross-bridge phases, full-cycle playback and interrupted playback.
- Single-twitch calcium precedes force; 60 Hz trains sustain greater force than 1 Hz trains; recovery follows stimulation.
- Glossary filtering and empty results; all checkpoint answers, incorrect feedback, retry, persistence, completion and review.
- Native fullscreen and an explicitly simulated unsupported-fullscreen fallback; Escape restores scrolling and focus in the fallback.
- Reduced-motion defaults and immediate control responses while paused.
- Desktop (1440 × 1000), laptop (1280 × 800), tablet (768 × 1024) mobile (390 × 844), and narrow mobile (320 × 740) layouts, including a mobile sweep of every chapter.
- No browser console errors, duplicate IDs, missing control names, failed asset requests or horizontal document overflow in the checked layouts.

The browser regression suite passed all 38 checks. A final 36-check pass also verified the updated sidebar, animation-pause controls, narrow mobile layout and SERCA recovery/ATP-depletion behavior. The synapse, triad, sarcomere and fullscreen screenshots were also inspected visually. Scientific copy is sourced in the module; the force and timing model is deliberately illustrative, not fitted physiological data.

## Run the checks

```sh
node tools/qa-muscle.cjs
```

This development-only script requires Playwright and a compatible Chromium installation. It supports `PLAYWRIGHT_PATH`, `CHROME_PATH` and `QA_OUTPUT`. It starts a loopback-only static server, opens an isolated browser context, saves screenshots and `results.json` to a temporary output directory, and closes both server and browser on completion. It adds no dependencies to the published site.
