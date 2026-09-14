# Signal Atlas

**Interactive maps of the biological systems that keep us alive.**

Signal Atlas is a self-contained science education website built with HTML, CSS, vanilla JavaScript, and original SVG illustrations. Four immersive modules turn a biological mechanism into an explorable sequence of signals, sensors, and responses. The project runs offline and can be published directly on GitHub Pages.

## The live collection

| Module | Exploration | Chapters | Main interactions |
| --- | --- | ---: | --- |
| 01 | How Anesthesia Works | 14 | Stimulus strength, inhibitory tone, anesthetic effect, neural firing and network activity |
| 02 | How Insulin Works | 16 | Glucose challenge, insulin response, receptor signaling, GLUT4 transport, glucose uptake |
| 03 | How CRISPR Edits DNA | 16 | Target A/B/C selection, sequence pairing, PAM recognition, NHEJ/HDR repair |
| 04 | Blood Pressure Regulation | 14 | High/low pressure challenges, pressure impulse, reflex strength, real-time correction |

Each module includes an interactive mechanism, glossary, sourced facts, four checkpoint questions with explanations and retry, and a completion screen. Upcoming topics are labeled as unavailable and are not links.

## Run locally

1. Keep the entire `signal-atlas` folder together.
2. Open `index.html` in a current browser.
3. Choose any of the four live modules.

**No installation, Node.js, npm, build step, API, database, internet connection, or server is required.** All fonts use local system fallbacks; graphics and styles are included. Source-reference links are the only feature that needs the internet.

For the largest stage, use the fullscreen button. Native fullscreen depends on browser support and user interaction; an expanded-layout fallback is provided. On smaller screens, the guide moves above the stage and the page scrolls naturally.

## Controls

- **Back / Next:** navigate chapters. On the last chapter, Finish opens a completion screen.
- **Chapter list:** jump directly to any chapter.
- **Play / Pause:** control biological animation and any time-evolving model. Playback does not automatically advance chapters.
- **Sliders and choices:** immediately update the current model, its metrics, and the visualization, including when paused.
- **Left / Right Arrow:** previous / next chapter, except while editing a range input or another form control.
- **Space:** play / pause when a link or button does not have keyboard focus. Focused buttons retain their normal Space activation.
- **Escape:** exit native fullscreen or the expanded-layout fallback.
- **Restart module:** clear that module’s checkpoint answers and return its model to initial conditions.

Checkpoint answers are saved in the browser’s local storage when available. Nothing is sent to a server. Private-browser or local-file storage restrictions do not prevent the modules from working. Reduced-motion preferences start simulations paused and suppress CSS movement.

## Publish with GitHub Pages

1. Create a GitHub repository or choose an existing one.
2. Upload the **contents** of `signal-atlas` to the repository root. `index.html`, `assets`, and `topics` should be siblings. Include `.nojekyll` if your upload method shows hidden files.
3. Open the repository’s **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Choose the branch containing the files, normally `main`, and the **/ (root)** folder. Save.
6. Wait for GitHub to finish its Pages deployment, then open the URL displayed in Pages settings.

All navigation and asset paths are relative, so both repository project URLs and custom domains work. There is no custom workflow to configure. If you prefer publishing from `/docs`, place the complete site contents there and select that folder in Pages settings.

See GitHub’s [publishing-source documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site) and [site-creation guide](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site).

## Project structure

```text
signal-atlas/
├── index.html
├── README.md
├── .nojekyll
├── assets/
│   ├── css/
│   │   ├── global.css           # Identity, homepage, responsive rules
│   │   ├── modules.css          # Shared module shell and learning screens
│   │   ├── anesthesia.css
│   │   ├── insulin.css
│   │   ├── crispr.css
│   │   └── pressure.css
│   ├── icons/
│   │   └── atlas.svg
│   └── js/
│       ├── site.js             # Homepage navigation
│       ├── module-engine.js    # State, controls, playback, learning screens
│       └── modules/
│           ├── anesthesia.js
│           ├── insulin.js
│           ├── crispr.js
│           └── pressure.js
├── topics/
│   ├── how-anesthesia-works.html
│   ├── how-insulin-works.html
│   ├── how-crispr-edits-dna.html
│   └── blood-pressure-regulation.html
└── docs/
    ├── adding-a-module.md
    └── QA.md
```

## Scientific scope

These are **simplified educational models**, not clinical predictions, medical advice, or laboratory design tools. Numerical scales and time courses illustrate cause and effect; they are not fitted patient data. Molecular and anatomical objects are not drawn to scale.

- **Anesthesia:** illustrates a major GABA-A-mediated inhibitory pathway. Different anesthetics act through different molecular targets, and consciousness is a network-level phenomenon rather than a single receptor switch.
- **Insulin:** distinguishes insulin-dependent GLUT4 transport in muscle/adipose tissue from hepatic glucose handling. Its beta-cell sequence shows the ATP-sensitive potassium-channel and calcium mechanism. The glucose trajectory is an illustrative closed-system challenge.
- **CRISPR:** uses an artificial teaching sequence. Guide complementarity and a compatible PAM are both important. DNA repair is variable: NHEJ can create indels, and HDR with a donor can produce a specified change; neither a perfect match nor a selected repair option guarantees an outcome in a real experiment.
- **Blood pressure:** isolates the short-term baroreceptor reflex. Reduced sympathetic vasoconstrictor tone explains systemic arteriolar dilation; the diagram does not attribute generalized vessel dilation to the vagus. Kidney, hormonal, and long-term volume regulation are outside this model.

Primary scientific references appear on each module’s facts and completion screens. No third-party images or remote assets are used.

## Extend the atlas

Each module registers a definition on `window.SignalAtlasModules`. The shared engine reads its chapter data, controls, metric function, scientific SVG renderer, and optional time-step callback. It handles navigation, quizzes, glossary/fact layouts, keyboard controls, persistence, and fullscreen, so additional modules do not need a duplicate application shell.

Read [Adding a module](docs/adding-a-module.md) for the contract and extension workflow. The delivered site contains no unfinished future-topic pages.

## Technology and accessibility

Semantic HTML, responsive CSS Grid/Flexbox, custom properties, original vector diagrams, CSS/SVG animation, and `requestAnimationFrame`. Accessible names, visible keyboard focus, labeled controls, meaningful SVG descriptions, live quiz feedback, and reduced-motion support are included.

Development and verification details are in [QA notes](docs/QA.md). Development-only tools are not shipped and are not required to use the website.
