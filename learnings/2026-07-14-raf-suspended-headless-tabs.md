# rAF suspended in headless/hidden tabs breaks framer-motion JS-loop animations

## Problem
New framer-motion pointer-tilt (useSpring + useTransform bound to `style`) appeared completely dead when verified via embedded Browser pane and via a background Chrome tab — element inline transform stayed at rest (`perspective(900px)`) after pointermove events.

## Approach
1. Confirmed fresh bundle served (compare `document.scripts[].src` hash against last `vite build` output) — ruled out stale artifact.
2. Confirmed the React handler was attached and firing: found `__reactProps$` key on the DOM node, called `props.onPointerMove` directly; also incremented a global counter inside the handler in an instrumented build. Handler ran, computed correct normalized coords (nx=0.9).
3. Probed the MotionValue directly (temporarily exposed via `window.__tilt`): `.set(0.9)` left `.get()` at 0.5 forever; `.jump(0.9)` updated instantly. So spring animation never started — pointed at the frame loop, not the wiring.
4. Pivot: counted `requestAnimationFrame` ticks over 600ms in the page → **0 ticks**. Chromium suspends rAF entirely for hidden/occluded tabs (embedded Browser pane AND background real-Chrome tabs, `document.visibilityState === 'hidden'`). WAAPI-driven animations (framer entrance/hover variants) still play on the compositor, which is why the site "looked animated" while JS springs were frozen — misleading.
5. Verified for real by shimming rAF *before* the bundle loads (framer captures the reference at module init): fetch page HTML, `document.write` it with `<script>window.requestAnimationFrame=cb=>setTimeout(()=>cb(performance.now()),16)</script>` injected in head, re-append the module script manually (document.write ignores module scripts). Tilt then produced exact expected transforms (`rotateX(6.4deg) rotateY(6.4deg)` for py=0.1, px=0.9 with max 8°).
6. Note: `scrollTo`/`scrollTop` also no-op in hidden tabs → `whileInView` entrances can't be exercised there either; verify initial states + trust the shipped mechanism, or check in a foregrounded tab.

## Reusable rule
When a JS-driven animation (framer springs, MotionValue → style) shows no effect under headless/background-tab verification, first count rAF ticks in-page; 0 ticks means the environment suspended the frame loop — shim rAF before bundle load or verify in a visible tab, and don't "fix" working code.
