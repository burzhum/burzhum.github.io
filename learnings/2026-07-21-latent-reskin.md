# Reskin the portfolio to match a reference site's visual language

**Problem:** Make burzhum.github.io "look like" neuralhub.dev/test-sites/websites-kimi3 (a JS-rendered "LATENT SPACE" ML-themed site) without destroying the portfolio's real career content.

**Approach (plain steps):**
1. WebFetch failed (SPA, no SSR) — used `agent-browser open + screenshot --full` to see the reference, and `agent-browser eval` on the live DOM to extract exact design tokens: `getComputedStyle(body)` for bg/ink/font, plus a loop over `*` collecting distinct `color`/`backgroundColor` and every `fontFamily`. That gave the real palette (bg #0a0b0a, ink #edeae2, accent #c8ff2e) and fonts (JetBrains Mono, Clash Display, Instrument Serif) — no guessing from a screenshot.
2. Reskinned, did not rebuild. The site already used CSS-var theming, so the whole palette swap was one edit to `:root` vars in `src/index.css`. Kept all content/components; only changed tokens + added LATENT motifs (status readout panel, numbered section markers, serif italic accents, ghost-outline bands).
3. Fonts: Instrument Serif was on `@fontsource`; Clash Display is NOT (Fontshare-only) → `@import` from `api.fontshare.com` with Archivo Black as the bundled fallback. Verified both with `document.fonts.check('16px "Clash Display"')`.
4. Adopted the reference's *visual system* onto the *user's real facts* — mapped LATENT's ML framing (EPOCH/LOSS/PARAMETERS) to the user's infra domain (SLA 99.90% / SYSTEMS NOMINAL / 2,552 ENDPOINTS). A reskin copies the look, never the content.
5. Verified: build clean, 39 tests pass, then screenshot-compared local preview against the reference, then curl-matched the live GitHub Pages bundle hash after Actions deploy.

**Reusable rule:** To clone a site's look, extract real tokens from its live DOM via a browser `eval` (computed styles + font-family sweep) — never eyeball colors from a screenshot. When the target is CSS-var themed, a full reskin is usually a single edit to the `:root` variables plus a few motif components; keep the content, swap only the visual system.
