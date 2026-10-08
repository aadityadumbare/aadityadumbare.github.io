# Hidden features & discoveries

The site hides eight things. Finding one fires a toast; progress is kept per
browser and can be reset from the admin panel. This document covers how the
system works, how each one is triggered, and how to add another.

---

## The discovery system

`src/app/core/services/achievement.service.ts`

- **Discoveries are earned once per browser.** `unlock(id, title, detail)` is a
  no-op if the id is already in the found set. The set is persisted to
  `localStorage["portfolio_discoveries"]`.
- **`notify(title, detail, eyebrow)`** is the transient variant — it always
  shows and is used for confirmations that should repeat (a copied email, a
  failed clipboard).
- Toasts auto-dismiss after **5.2s**, at most **3** are visible at once, and each
  can be dismissed manually. They render through `ToastsComponent`, which is a
  `role="status" aria-live="polite"` region.

`DISCOVERIES` is the single source of truth for the list and therefore for the
`n / 8` readout shown in the command palette and the admin panel. The panel's
**Reset** button calls `AchievementService.reset()` so the hunt can be replayed.

Stored discoveries can also be inspected at any time by running **Show my
discoveries** inside the command palette.

---

## The eight discoveries

| Id | Title | Trigger |
| --- | --- | --- |
| `command-palette` | Power user | Open the palette with `⌘/Ctrl + K` |
| `secret-panel` | Secret panel | Konami code, `Ctrl+Shift+L`, the `#/secret` route, or typing `sudo` |
| `word-hire` | Word of power | Type `hire` |
| `word-sudo` | Root access | Type `sudo` |
| `logo-spin` | Spin cycle | Double-click the wordmark |
| `headline-glitch` | Signal lost | Hover or click “feel alive” |
| `ripple` | Ripple | Click anywhere in the hero |
| `stillness` | Stillness | Leave the page untouched for ~18s |

The admin panel itself still requires the PIN; `sudo` only reveals it.

---

## Command palette

`src/app/shared/components/command-palette/command-palette.component.ts`

Opened with `⌘/Ctrl + K`, or `UiService.toggleCommand()`. Commands are grouped:

| Group | Commands |
| --- | --- |
| Navigate | Go to About / Skills / Projects / Experience / Contact |
| Actions | Toggle theme · Copy email address · Open résumé · Open the recruiter snapshot · Open the hidden admin panel |
| Perspective | Full stack · Frontend · Backend / .NET · Personal |
| Meta | Show my discoveries (`n / 8`) |

**Keyboard model:** type to filter, `↑`/`↓` to move, `↵` to run, `esc` to close.
The input is a `role="combobox"` with `aria-activedescendant`, and the list is a
`role="listbox"` of `role="option"` rows. Escape is also bound at the document
level so it closes even if focus drifts.

While open, the page scroll is locked via `MotionService.lockScroll('command-palette')`.

> **Why `run()` unlocks before executing:** Lenis ignores `scrollTo` while it is
> stopped, so a "Go to …" command would silently do nothing if the palette still
> held its own scroll lock when the command ran. Commands therefore release the
> lock synchronously first. The `UiService.closeCommand()` that follows is
> idempotent, and the effect that would also unlock becomes a no-op.

On touch devices the keyboard hint row is replaced with "Tap a command to run
it" (`@media (hover: none)`).

---

## Typed secrets

`src/app/core/services/keyboard-secrets.service.ts`

Keeps a rolling 16-character buffer of `keydown` characters and matches on the
tail. It **ignores**:

- any event with `ctrlKey`, `metaKey` or `altKey`;
- any event whose target is an `INPUT`, `TEXTAREA`, `SELECT` or contenteditable —
  so it never interferes with the contact form or the admin PIN field;
- non-printable keys (which also reset the buffer).

| Word | Effect |
| --- | --- |
| `hire` | Opens the recruiter snapshot + fires `word-hire` |
| `sudo` | Unlocks the admin panel + fires `word-sudo` |

Matching is suffix-based, so `hire` also matches while typing a longer word
containing it. That is a deliberate trade for an easter egg; the buffer is
cleared on a match so it cannot re-fire in a loop.

---

## Stillness — the constellation spells the initials

The most involved one. `src/app/shared/components/particle-field/particle-field.component.ts`

**Detection.** `markActivity()` is called on pointer, key, wheel, touch and
scroll events. It is **throttled to once per second** — `pointermove` fires ~60×/s
and must not churn timers. After `IDLE_MS` (18s) of no activity, `idleActive`
flips true. `idleBlend` then eases towards 1 at 2% per frame, and back to 0 on
the next input, so the whole thing is reversible and interruptible.

**Targets.** `buildIdleTargets()` rasterises `IDLE_TEXT` (`"AD"`) onto an
offscreen 2D canvas, samples the filled pixels, and maps the **measured glyph
bounding box** (not the canvas) onto the visible plane:

```
targetW = spread.x * 0.35   // compact: ~2000 points must fill the strokes
targetH = spread.y * 0.22
targetY = 2.6               // lifted into the hero's empty band, above the headline
```

Mapping the glyph bounds rather than the canvas is what makes the size
predictable — the canvas has padding around the text.

**Blending.** Each frame blends `position → target` by `idleBlend * 0.045` and
scales the ambient velocity by `1 - idleBlend`, so the drift freezes rather than
fighting the morph.

**Three problems had to be solved before the letters were legible:**

1. **The link mesh filled the counters.** With 2000+ points packed into the
   strokes, the connecting lines turned "A"/"D" into a solid mass. The line
   material's opacity now fades to ~4% of its base as `idleBlend → 1`, and the
   point size grows ~55% and opacity drops ~28% so the strokes have weight
   without blowing out under additive blending.
2. **The rotation viewed the letters edge-on.** The group has a slow ambient
   Y rotation (0.0006 rad/frame, ≈2°/s). After ~30s the accumulated rotation
   meant the letters were seen at a steep angle — near side smeared into noise,
   far side compressed. The spin now stops while morphing and eases back to
   face-on by snapping to the nearest whole turn.
3. **The hero scrim buried them.** The field publishes `--field-idle` (0–1) on
   `<html>`, and `.hero__scrim` uses
   `opacity: calc(1 - var(--field-idle, 0) * 0.62)`. It is published on the root
   element on purpose: the scrim is a **sibling** of the particle component, and
   custom properties only inherit downwards — setting it on the component host
   would never reach the scrim. The property is removed once the blend returns
   to 0, and only written when it moves by more than 0.02 to avoid per-frame
   style churn.

The discovery fires when `idleBlend` first exceeds 0.9.

---

## Shockwave

Clicking in the hero pushes the surrounding points outward.

- The click is converted to world space from the canvas rect and the camera's
  visible extent at the `z = 0` plane.
- The listener is on **`window`**, filtered by the canvas rectangle. It cannot be
  on the component host: the hero's content layer sits above the canvas and is a
  *sibling* of it, so clicks never reach the host.
- Clicks on interactive elements (`a, button, input, textarea, select,
  [role="button"]`) are ignored.
- The push is added to a **separate `impulse` buffer** that decays by
  `IMPULSE_DECAY` (0.92) each frame, so the shockwave settles and leaves the
  ambient drift untouched. Radius 8.5 units, strength 0.42.

---

## Smaller ones

- **Headline glitch** — `.accent-text` carries `data-text`; two pseudo-elements
  render chromatic copies that animate through clip-path bands. Fires on hover
  (pointer devices) or on click, which toggles `accent-text--glitch` for 900ms.
- **Wordmark spin** — double-clicking the nav logo adds `nav__logo--spin` for
  900ms (a 360° `rotateY` with a slight scale).
- **Theme scanline** — `ThemeService.toggleTheme()` adds `theme-flash` to
  `<html>` for 700ms, which plays a sweeping gradient band via `html::after`.
  The class is removed and the animation restarted so rapid toggles each play.

---

## Accessibility & performance guarantees

- **Reduced motion is honoured everywhere.** The CSS effects (scanline, glitch,
  spin) are neutralised by the global kill switch at the end of `styles.scss`.
  The JS effects check `MotionService.reducedMotion()` before doing anything.
- **Nothing animates behind a dialog.** The particle loop is gated on
  `!MotionService.overlayOpen()`, and the idle morph is driven from that loop —
  so it simply pauses while a modal is open.
- **No layout thrash.** All effects animate `transform`, `opacity`, `clip-path`
  or WebGL buffers. The only exception is the scanline class toggle, which forces
  one reflow to restart its animation.
- **Activity detection is throttled** to once per second, so pointer movement
  costs nothing.
- **Stacking order** (only the cursor needs to be above everything):
  `--z-overlay: 200` · secret panel `210` · palette `205` · toasts `350` ·
  `--z-cursor: 400`.

---

## Adding a discovery

1. Add an id to the `DiscoveryId` union **and** the `DISCOVERIES` array in
   `core/services/achievement.service.ts` (the array drives the `n / 8` total).
2. Call `achievements.unlock(id, 'Title', 'One-line detail')` at the trigger.
3. If it needs a new global listener, put it in a service and inject that service
   from `HomeComponent` so it is instantiated with the app
   (`KeyboardSecretsService` and `MotionService` are wired this way).

Keep the count in this document and in the README in step.

---

## Verifying locally

```bash
npm start                      # http://localhost:4200
```

In dev builds Angular exposes component instances, which makes these testable
from the console:

```js
ng.getComponent(document.querySelector('app-toasts')).achievements.found()
ng.getComponent(document.querySelector('app-particle-field')).idleBlend
```

Things worth checking after a change:

- `⌘/Ctrl + K` opens, locks scroll, filters, runs, and closes cleanly.
- A "Go to …" command actually scrolls.
- Typed `hire` / `sudo` do **not** fire while focus is in the contact form.
- The idle morph reaches `idleBlend === 1` after ~18s **with the hero in view**
  (the loop pauses when the hero is scrolled away, which is intended).
- Nothing animates while a dialog is open.

---

## File map

| File | Role |
| --- | --- |
| `core/services/achievement.service.ts` | Discovery set, toasts, persistence, reset |
| `core/services/ui.service.ts` | Shared open-state for the palette and recruiter snapshot |
| `core/services/keyboard-secrets.service.ts` | Typed-word matching |
| `shared/components/command-palette/` | The palette |
| `shared/components/toasts/` | Toast stack |
| `shared/components/particle-field/particle-field.component.ts` | Shockwave + stillness |
| `shared/components/cursor/cursor.component.ts` | Click pulse + press feedback |
| `shared/components/nav/nav.component.ts` | Wordmark spin |
| `features/hero/hero.component.*` | Headline glitch |
| `core/services/theme.service.ts` | Scanline on theme flip |
| `app/app.ts` | Konami / `Ctrl+Shift+L` → discovery |
