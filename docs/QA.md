# Production QA

Final packaging: 13 September 2026.

## Scope and result

The existing Signal Atlas project was preserved. All 60 lesson slides were reviewed, including mechanisms, glossaries, facts, and all 16 checkpoints. The final pass made only the small corrections listed below; no completed module was rebuilt or redesigned.

Browser review used a loopback-only static server and the Codex in-app browser. Every slide was traversed at 1440 × 900, 1512 × 982, and 1728 × 1117. Screenshot review was combined with checks for SVG label intersections, labels outside their SVG, horizontal overflow, controls outside the guide, sidebar reset, and leftover mechanism content on reading screens.

| Module | Slides | 1440 × 900 | 1512 × 982 | 1728 × 1117 | Fullscreen desktop |
| --- | ---: | --- | --- | --- | --- |
| Anesthesia | 14 | Pass | Pass | Pass | All 14 traversed at 1470 × 923 |
| Insulin | 16 | Pass | Pass | Pass | All 16 traversed at 1470 × 923 |
| CRISPR | 16 | Pass | Pass | Pass | Slides 1–8 verified at 1470 × 923; see limit below |
| Blood Pressure Regulation | 14 | Pass | Pass | Pass | All 14 traversed at 1470 × 923 |

No unresolved visual or functional defect was found in the reviewed states. No application console warnings or errors were recorded during the final browser session.

## Corrections made during this final pass

- Insulin: moved the beta-cell membrane-state label away from the dashed signal path and insulin granules.
- Insulin: moved the GLUT4 label and its leader away from vesicle-trafficking arrows.
- Insulin: placed the hepatic transport note below the cell boundary so it no longer crosses the membrane.
- Blood pressure: routed the sympathetic return path clear of the pressure gauge and response annotation.
- Homepage: changed the count caption to **04 COMPLETED MODULES**, retaining **“Four modules are live.”**

The corrected mechanism positions were inspected again in the browser. The homepage wording and count were confirmed in the rendered page.

## Interaction coverage

- Back, Next, chapter selection, first-slide Back disabled state, completion screens, and return from completion.
- Left/Right keyboard navigation and Space playback control in every module.
- Play/Pause and fullscreen entry/exit; native Escape exit was verified using an actual keyboard event.
- Slider endpoints and buttons, with displayed metrics checked against their resulting states.
- All 16 checkpoints: wrong answer, explanatory feedback, retry, four re-enabled choices, correct answer, and completion score.
- All glossaries and facts: mechanism graphics, metrics, and irrelevant controls are removed; playback is disabled.
- Sidebar chapter navigation resets the guide to its beginning. Long chapter lists and controls remain reachable by scrolling.
- All 12 homepage module launch links were clicked: four network nodes, four illustration cards, and four title links. Each opened the expected module, and each module's home link returned successfully.
- Homepage section navigation, four live cards, and visibly unavailable future topics. Upcoming topics contain no launch links.

### Metric and model checks

- Anesthesia: increasing excitatory input raised firing frequency; increasing GABA or anesthetic effect increased inhibition and reduced output. Baseline/enhanced-inhibition buttons updated the model.
- Insulin: a 200 mg/dL starting glucose with zero secretion response displayed zero insulin signal and one basal transporter; full response displayed a stronger signal and six transporters. Meal/baseline buttons reset the challenge. Glucose decreased during playback and stayed unchanged while paused.
- CRISPR: Target A showed 18/20 pairing with a compatible PAM; B showed 20/20 and a compatible PAM; C showed 20/20 with an incompatible PAM. Later teaching stages follow Target B. NHEJ examples cycled through deletion, insertion, and precise rejoining; HDR examples included a donor-specified change and no incorporation.
- Blood pressure: a low-pressure challenge increased heart rate and resistance; a high-pressure challenge reduced them. With reflex strength at zero, pressure held and autonomic effects remained at baseline. Restoring reflex strength brought pressure toward the illustrative 95 mmHg baseline.

## Local use and GitHub Pages

The final independent static audit passed: all six JavaScript files parse; 46 local file references and 12 HTML fragment targets resolve. Model checks passed 151 renders and 97 control states. A further SVG audit passed 133 mechanism/control variants, checking 882 IDs and 1,318 fragment references with no duplicate IDs or missing targets.

The delivered site uses classic scripts and relative asset/navigation paths. It has no runtime fetch, package installation, build step, API, database, CDN, or remote-font dependency. The `.nojekyll` file is included.

Browser navigation was tested both at the server root and under a `/signal-atlas/` project prefix. All four modules loaded under the prefix, supporting GitHub Pages project-site deployment. Publishing to a public GitHub Pages URL was not performed; deployment instructions are in the README.

Direct `file://` browser testing was unavailable because the browser security policy blocked local-file navigation. The user approved the loopback server used for visual testing. Offline compatibility is supported by the self-contained file structure and source audit; a direct-file browser launch is not claimed as tested.

## Verification limit

The browser returned to a 1280 × 720 window during the second half of the CRISPR fullscreen traversal. Those reading/checkpoint slides passed at that window size, but their final fullscreen recheck and an additional homepage screenshot were not completed: automatic approval review rejected the retest because the workspace was out of credits. On resuming, browser access was available, but permission to restart the loopback preview server was not granted. This is a verification limit, not an observed site defect. No alternate browser-control method was used to bypass either restriction.

The three specifically requested viewport sizes were traversed in full before that block. Development-only test utilities and local preview servers are excluded from the release ZIP.
