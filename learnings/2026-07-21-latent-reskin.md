# Reskin the portfolio to match a reference site's visual language

**Problem:** Make burzhum.github.io "look like" neuralhub.dev/test-sites/websites-kimi3 (a JS-rendered "LATENT SPACE" ML-themed site) without destroying the portfolio's real career content.

**Approach (plain steps):**
1. WebFetch failed (SPA, no SSR) — used `agent-browser open + screenshot --full` to see the reference, and `agent-browser eval` on the live DOM to extract exact design tokens: `getComputedStyle(body)` for bg/ink/font, plus a loop over `*` collecting distinct `color`/`backgroundColor` and every `fontFamily`. That gave the real palette (bg #0a0b0a, ink #edeae2, accent #c8ff2e) and fonts (JetBrains Mono, Clash Display, Instrument Serif) — no guessing from a screenshot.
2. Reskinned, did not rebuild. The site already used CSS-var theming, so the whole palette swap was one edit to `:root` vars in `src/index.css`. Kept all content/components; only changed tokens + added LATENT motifs (status readout panel, numbered section markers, serif italic accents, ghost-outline bands).
3. Fonts: Instrument Serif was on `@fontsource`; Clash Display is NOT (Fontshare-only) → `@import` from `api.fontshare.com` with Archivo Black as the bundled fallback. Verified both with `document.fonts.check('16px "Clash Display"')`.
4. Adopted the reference's *visual system* onto the *user's real facts* — mapped LATENT's ML framing (EPOCH/LOSS/PARAMETERS) to the user's infra domain (SLA 99.90% / SYSTEMS NOMINAL / 2,552 ENDPOINTS). A reskin copies the look, never the content.
5. Verified: build clean, 39 tests pass, then screenshot-compared local preview against the reference, then curl-matched the live GitHub Pages bundle hash after Actions deploy.

**Reusable rule:** To clone a site's look, extract real tokens from its live DOM via a browser `eval` (computed styles + font-family sweep) — never eyeball colors from a screenshot. When the target is CSS-var themed, a full reskin is usually a single edit to the `:root` variables plus a few motif components; keep the content, swap only the visual system.

---

## Part 2 — Motion / scroll-reactive layer + long iteration loop

**Problem:** After the static reskin, add the reference's *behaviour* — loader, particles, custom cursor, scroll-zoom, rolling text, pinned bg-morph, mouse-follow — then iterate through ~15 rounds of user feedback.

**Lessons (each cost real time — follow them):**

1. **agent-browser caches aggressively.** Opening the same URL twice serves the cached page → you screenshot/eval the OLD build and misdiagnose. Always cache-bust: `agent-browser open "https://site/?v=$(date +%s)"`. Confirm the live server separately with `curl` for the bundle hash + a grep of a unique new string in the JS. A hash match on `curl` + a stale browser render = browser cache, tell the user to hard-reload (`Ctrl+Shift+R`); it is NOT a deploy failure.

2. **`position: sticky` creates a stacking context at root z-auto(0).** A `fixed` sibling with `z-30` then paints OVER the entire sticky subtree, no matter how high the z-index on the nested content is. Fix: put the z-index ON the sticky wrapper itself (`sticky top-0 z-35`), not on the inner element. This is how the pinned "bg-morph" section (FieldNote) hid its own quote for a debug cycle.

3. **Inline text only wraps where there's a break opportunity.** Rendering a statement as per-word `<span>`s with `mr-[0.3em]` margins and NO whitespace between them = zero soft-wrap points → the whole line is unbreakable → overflows → clipped by `overflow-x-hidden` (looks like a sizing bug, isn't). Fix: put a real space inside each span (`{word}{' '}`), drop the margin. Verify with `p.scrollWidth === p.clientWidth`.

4. **Background "morph between sections" ≠ animating body bg.** The reference keeps `body` bg constant; the morph is a `fixed inset-0` colored layer whose *opacity* is scrubbed by that section's `useScroll` progress (`0→1→0`). Cheap, reversible, and it visually repaints the whole viewport.

5. **Framer `useScroll`/`useTransform` covers the GSAP-ScrollTrigger spec** (scroll-scrub, pins via CSS `sticky`, parallax via `y` tied to `scrollY`). No need to add GSAP+Lenis+ScrollTrigger when the app is already React+Framer — Lenis alone gives the smooth-scroll momentum.

6. **Glass/gradients cheaply:** `.glass` = `background: color-mix(in oklab, var(--panel) 55%, transparent)` + `backdrop-filter: blur() saturate()`. Layered `.aurora` = stacked `radial-gradient(... color-mix(var(--accent) 18%, transparent) ...)` on a `fixed` motion.div with `y` parallax.

7. **Reduced-motion + jsdom guards are non-negotiable per component:** canvas `getContext` null-guard, `useReducedMotion` static branch, and a `ResizeObserver` stub in test setup (Lenis needs it — else every Home-render test throws `ResizeObserver is not defined`).

8. **Design feedback is hue/brightness-sensitive.** User called `#c8ff2e` (electric lime) "too bright for my eyes" → dropped to `#3fc46e` (calmer green). All UI followed automatically because everything reads `var(--accent)`. Single-var theming pays off across many iteration rounds.

**Reusable rule:** For scroll-reactive polish on a React site, reach for Framer `useScroll`+`sticky`+Lenis before GSAP; build "bg morph" as an opacity-scrubbed fixed overlay; and when a pinned element's content vanishes, suspect the sticky-creates-a-stacking-context trap first. When verifying live via a headless browser, always cache-bust the URL and cross-check the bundle hash with curl — a stale render is almost always browser cache, not a bad deploy.
