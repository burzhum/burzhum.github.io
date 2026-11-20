# Portfolio — agent knowledge

Read this before touching the repo. It is the rulebook for any AI agent working here.

## What this is

Asrul's public portfolio, live at https://burzhum.github.io. This repo is **public**: everything committed here, including this file, is visible to anyone.

- Stack: React 18 + Vite + Tailwind 3.4 + Framer Motion + Lenis smooth scroll. Tests: vitest (+ jsdom).
- Design: "LATENT" reskin of the original Terminal Editorial design. Two themes: `night_shift` (default, near-black / bone / lime `#c8ff2e`) and `day_shift` (cream / ink / dark olive `#4d6b00`). Palette lives in CSS vars in `src/index.css`.
- Fonts: Clash Display (Fontshare CDN `@import`, not on fontsource; Archivo Black is the fallback), Instrument Serif, JetBrains Mono.

## Commands

```
npm ci
npm run dev        # local dev server
npm test           # vitest, must stay green (40 tests as of Oct 2026)
npm run build      # must succeed before any push
```

Do **not** run `npm run refresh-metrics`. It needs private network access and credentials that only the owner has. Leave `src/data/metrics.js` alone unless the owner gives you a new number.

## Deploy

Push to `main` → GitHub Actions builds, runs a confidentiality grep on `dist/`, then publishes to Pages (~50 s). **Every push to `main` is a live deploy.** Do not push without the owner's explicit OK. After a deploy, confirm the new bundle hash is served: `curl -s https://burzhum.github.io | grep -o 'index-[A-Za-z0-9_-]*\.js'`.

## Confidentiality (hard rule)

Most enterprise projects were built for a government hospital client and are shown **anonymised**. Two gates enforce it:

1. `tests/confidentiality.test.js` scans `src/data/*`, **every tracked text file and all commit messages**.
2. `scripts/gate-dist.mjs` scans the built `dist/` (CI runs it after the build).

The term list itself is confidential and is **never in the repo**: it lives outside this folder on the owner's laptop (local runs) and in the `GATE_TERMS` Actions secret (CI). Without it the gate fails closed. **Do not search for, open or ask for the list.** If the gate fails, report the file it names and stop; the owner finds the word.
3. A local `.git/hooks/pre-push` runs that test and blocks the push on failure. Never bypass it (`--no-verify` is forbidden here): CI only fails after the commit is already public.

**Work on this repo in Local mode only, from the owner's laptop clone.** A cloud copy has no pre-push hook, and on a public repo a push to any branch is instantly public. Agents commit; the owner pushes.

Never weaken, skip, or edit either gate. Never add the client's name, its location, contract numbers, internal IP ranges, colleague names or phone numbers anywhere, including commit messages and this file. Enterprise cards describe the client only as a "government hospital".

## Content rules

- Cards are for recruiters: lead with the outcome, not the mechanics. Stack chips may keep tech names.
- No adoption or impact metrics that depend on the client's usage (e.g. "alerts cut from X to Y").
- Tracks in `src/data/projects.js`: `publicTrack` (personal; `private: true` renders "private · demo on request"), `clientTrack` (named only with client consent), `enterpriseTrack` (always anonymised).
- **App count appears in many places.** When adding or removing a card, grep for the current count and update every hit: `boot.js`, `terminal.js`, `incidents.js`, `profile.js`, the `Projects.jsx` section title, `index.html` meta + `og:description`, `tests/projects.test.jsx` (card count) and `tests/data.test.js` (per-track + total). Current total: 18 (7 + 1 + 10).
- Career years: "20+" (started 2006). `18+ TB` lines are storage, not years.
- Do not showcase anything not live (no vaporware).
- Use the typographic apostrophe ’ inside single-quoted JS strings, as the data files already do.

## Gotchas (each one cost a debug cycle)

- jsdom `localStorage` is broken under vitest 4 → in-memory shim in `src/test/setup.js`. Lenis needs a `ResizeObserver` stub there too.
- Any new nested scroll container needs `data-lenis-prevent`, or Lenis swallows its wheel events.
- `useInView` margins: use `'0px 0px -40px 0px'`, never a bare `'-40px'` (insets all four sides and kills mobile count-ups).
- Inserted feature sections must not carry their own `NN` markers; only the 6 canonical sections in `Section.jsx` ORDER are numbered.
- `position: sticky` makes a stacking context: put the z-index on the sticky wrapper itself.
- No WebGL hero (removed: too heavy on older PCs). MatrixRain canvas stays.
- Verify thin outlines with a clipped 2x screenshot of the element, not a full-page shot.
- Headless verification: background tabs throttle rAF to 1 tick/s; bring the tab to front.

Past debugging notes: `learnings/`.
