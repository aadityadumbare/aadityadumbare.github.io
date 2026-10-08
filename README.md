# adityadumbare.github.io

Personal portfolio for **Aditya Dumbare** — a single-page Angular 22 site with a WebGL hero,
scroll-driven motion, and visitor analytics wired to a separate analytics service.

Live: <https://aadityadumbare.github.io>

---

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Angular 22 — standalone components, signals, **zoneless** (no `zone.js`) |
| Styling | SCSS with CSS custom-property design tokens (no framework) |
| 3D | three.js (hero particle constellation, lazy-loaded) |
| Motion | GSAP + ScrollTrigger, Lenis smooth scroll |
| Analytics | Inline tracker + `AnalyticsService` → [analytics service](./docs/analytics-identity.md) |
| Deploy | GitHub Pages via GitHub Actions |

---

## Design direction

**Kinetic Monochrome** — a near-black canvas, a single signature hue (acid lime `#d4ff00`),
oversized grotesk display type (Space Grotesk) set against monospace micro-labels (JetBrains
Mono), hairline rules and sharp edges.

Dark is the identity. The header toggle switches to a light **Paper** variant; every colour
flows through tokens in `src/styles.scss`, so components never hard-code a palette.

---

## Project structure

```
src/
├─ index.html                     # shell + inline analytics tracker
├─ styles.scss                    # tokens, base, utilities, dialogs, reduced motion
└─ app/
   ├─ app.ts / app.routes.ts      # root component + hash routing
   ├─ data/portfolio.data.ts      # ALL content lives here
   ├─ core/
   │  ├─ models/portfolio.models.ts
   │  └─ services/                # portfolio, theme, motion, analytics
   ├─ features/                   # hero, about, skills, projects, experience, contact, secret, home
   └─ shared/
      ├─ components/              # nav, footer, cursor, particle-field, dialogs, …
      └─ directives/              # reveal, parallax, tilt, magnetic
```

Content is **not** fetched — it is hard-coded in `src/app/data/portfolio.data.ts` and filtered
at runtime by `PortfolioService` into four perspectives (`fullstack | frontend | backend |
personal`), persisted to `localStorage` and switchable via the `?mode=` query param.

---

## Motion system

`core/services/motion.service.ts` is the single owner of page-wide motion:

- **Lenis** inertia scrolling, bridged to **GSAP ScrollTrigger** through the GSAP ticker.
- **Anchor delegation** — every `a[href^="#"]` is intercepted so in-page links land correctly
  under Lenis and update the URL.
- **Scroll locking** — `lockScroll(id)` / `unlockScroll(id)` are ref-counted per caller, so any
  overlay can freeze the page (and the hero loop) without fighting another.
- **Reduced motion** — `prefers-reduced-motion` disables Lenis, stops the 3D loop, and turns
  reveals into instant fades.

`ParticleFieldComponent` dynamically imports three.js, so it lands in its **own lazy chunk** and
never blocks first paint. It pauses when scrolled out of view, when the tab is hidden, and while
a dialog is open (a blurred overlay over a live WebGL canvas is what makes a UI feel frozen).

Micro-interactions are directive-based: `appReveal`, `appParallax`, `appTilt`, `appMagnetic`,
plus a custom cursor component (fine pointers only).

---

## Dialogs

All overlays (project case study, recruiter snapshot, secret admin panel) share one system in
`styles.scss`:

- the overlay centres a **bounded shell**;
- the **header never scrolls** (eyebrow + title + a 44×44 close button);
- the **body is the only scroll region**, so long content is always reachable and the close
  button never scrolls away.

> Gotcha: a `position: fixed` overlay is positioned against the viewport **only if no ancestor
> creates a containing block.** A `transform`, `filter`, or `backdrop-filter` on an ancestor
> breaks it. `appReveal` therefore clears its inline transform once the animation completes, and
> the sticky header keeps its blur on a pseudo-element.

---

## Hidden features (discoveries)

Eight things are hidden on the page. Finding one fires a toast; progress is kept
per browser and can be reset from the admin panel.

| Discovery | How to find it |
| --- | --- |
| Command palette | `⌘/Ctrl + K` |
| The admin panel | Konami code, `Ctrl+Shift+L`, the `#/secret` route, or typing `sudo` |
| Word of power | type `hire` (anywhere outside a form) |
| Root access | type `sudo` |
| Wordmark spin | double-click the logo |
| Headline glitch | hover or click “feel alive” |
| Constellation ripple | click anywhere in the hero |
| Stillness | leave the page untouched for ~18 seconds |

The palette (`⌘/Ctrl + K`) is the hub: jump to any section, toggle the theme,
switch perspective, copy the email address, open the résumé, open the recruiter
snapshot, or open the hidden admin panel. Run **Show my discoveries** inside it
for the running count.

**Stillness** is the most involved: after ~18s without input the hero
constellation eases into the initials “AD”, the link mesh fades out and the hero
scrim lifts so the letters are readable front-on (the grid also stops its slow
rotation). Any input — pointer, key, scroll, touch — releases it and the drift
resumes. Typed secrets are ignored while focus is in a form field, so they never
interfere with the contact form or the admin PIN.

Everything is gated by `prefers-reduced-motion`: the CSS effects are neutralised
by the global kill switch, and the JS effects check `MotionService.reducedMotion()`
and only run while the particle loop is live (so nothing animates behind a dialog).

Full detail — the discovery system, every trigger, the idle-morph internals, and
how to add another one: **[docs/hidden-features.md](./docs/hidden-features.md)**.

---

## Analytics & visitor identity

The site sends page views and custom events to a separate analytics service, and the contact
form attaches a real identity (name + email, with consent) to the visitor's anonymous id.

- Tracker: inline script in `src/index.html` (`pageview`, `[data-track]` clicks, `window.trackEvent`).
- Identity: `core/services/analytics.service.ts` → `POST /api/v1/profiles/identify`.

Full contract, consent model, and a local test recipe: **[docs/analytics-identity.md](./docs/analytics-identity.md)**.

---

## Local development

> **Node version:** Angular CLI 22 requires **Node ≥ 22.22.3** (or 24.15+/26). If your default
> Node is older, switch first — e.g. `nvm use 24.21.0`.

> **`NODE_ENV=production` gotcha:** this machine exports `NODE_ENV=production`, which makes npm
> silently skip **all** devDependencies (`typescript`, `@angular/build`, `@types/*`, …) and the
> build then fails with "Could not find the '@angular/build:application' builder's node package".
> Install with dev deps explicitly:

```bash
npm install --include=dev
npm start                 # dev server on http://localhost:4200
npm run build             # production build
```

The analytics service must be running separately for the contact form to work locally (see the
doc linked above). Local requests target `http://localhost:3000`; production targets the
deployed Render instance.

---

## Build & deploy

```bash
npm run build
```

- Budgets (production): **500 kB** warn / **1 MB** error for the initial bundle —
  the app currently ships ~462 kB raw / ~129 kB transfer.
- three.js is emitted as a **separate lazy chunk** (~155 kB transfer) and is not part of the
  initial payload.
- Output: `dist/temp-angular/browser` (the `angular.json` project is still named `temp-angular`).

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds and publishes to GitHub
Pages. Routing uses `withHashLocation()`, so client-side routes work on Pages with no fallback
configuration.

---

## Accessibility

Focus rings are never removed (`:focus-visible` only); reduced-motion is honoured end to end;
touch targets are ≥ 44×44; form inputs are ≥ 16px to prevent iOS zoom-on-focus; dialogs move
focus in and restore it to the trigger on close; status changes are announced via ARIA live
regions.

---

## Roadmap

Tracked here so it outlives any given session:

- [ ] **Personal mode content.** The `personal` perspective only filters the
      project and experience lists today. It should grow into a real section:
      personal stories, video clips, a photo gallery, and more (a now page,
      reading/listening, side projects). It needs its own content shape in
      `portfolio.data.ts` rather than being forced into `ProjectItem`.
      Media weight is the main risk — images stay local and optimised, video is
      never in the initial bundle (budget is 500 kB, currently ~488 kB).
- [ ] **Open question:** where personal media is hosted (in-repo vs external),
      and whether personal content should stay public.
- [ ] **Palette on touch.** The command palette is keyboard-only, so there is no
      way to *open* it on a phone yet (the footer hint already adapts).

---

## Docs

- [Hidden features & discoveries](./docs/hidden-features.md)
- [Visitor identity & contact form](./docs/analytics-identity.md)
