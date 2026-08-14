# WebGL tubes hero background

**Problem:** Add the CodePen "Tubes Cursor" WebGL background (soju22 / Kevin Levron) to the portfolio hero without wrecking bundle size, day_shift readability, or the existing MatrixRain + cursor layers.

## Approach

1. **Get the pen's source without a browser.** codepen.io returns Cloudflare 403 to curl and to WebFetch. The rendered mirror does not: `https://cdpn.io/<user>/fullpage/<slug>` serves 200 with the whole pen inlined in an `srcdoc` attribute. Read the import line from there.
2. **Check the real license before the pen's comment.** The pen header said `CC BY-NC-SA 4.0`, but that covers the pen's own five lines. The engine it imports — npm `threejs-components` — is **ISC**. Read `registry.npmjs.org/<pkg>` for the authoritative license, not the demo's banner.
3. **Keep the engine out of the main bundle.** `tubes1.min.js` is 760 KB raw / 209 KB gzip because three.js r180 is bundled inside it. A static import triples the entry chunk. Use `await import(...)` inside a `setTimeout` so it lands after the boot/LCP window, and Vite emits it as its own chunk.
4. **Let the engine park itself.** The library already runs an `IntersectionObserver` on its canvas plus a `visibilitychange` listener. That only helps if the canvas can actually leave the viewport — so the layer is `absolute` at the top of the document, not `fixed`. A fixed full-screen canvas always intersects and renders forever.
5. **Gate on hardware, not on guesswork.** Render nothing unless `(pointer: fine)`, no `prefers-reduced-motion`, and `innerWidth >= 768`. Phones keep the cheap canvas rain instead.
6. **A/B the theme before trusting it.** On the cream day theme the tubes looked plausible at `opacity: .3` until a control screenshot with the layer `display:none` proved the dark GL scene was greying the entire page. Hidden outright on day_shift.

## Driving Chrome when agent-browser can't launch it

`agent-browser doctor` failed with `Chrome exited early (exit code: 0) without writing DevToolsActivePort`, and `--cdp 9222` dropped the connection mid-session. Fallback that worked: launch Chrome manually with `--remote-debugging-port=9222 --user-data-dir=<scratch>`, then drive CDP from a ~40-line Node script using the **global `WebSocket`** (Node 22+, no `ws` dependency). `Page.addScriptToEvaluateOnNewDocument` seeds `sessionStorage.booted=1` to skip the BootLoader; `Input.dispatchMouseEvent` moves the pointer so cursor-driven scenes actually animate; `Page.captureScreenshot` returns base64 PNG.

**Screenshot trap:** the first "final" capture showed a blank hero and no tubes. Nothing was broken — the Chrome window had gone to the background, so `document.visibilityState` was `hidden` and rAF ran **1 tick/sec**. Always probe `visibilityState` + a one-second rAF tick count before believing a screenshot, and call `Page.bringToFront` before capturing.

## Rule

When a demo's headline library is heavy, dynamic-import it behind a hardware gate and give its canvas a scroll position it can leave — then verify with a foregrounded browser and a control screenshot, because a backgrounded tab and a washed-out theme both fail silently.

---

# Follow-up: the INFRA ghost lettering was unreadable

**Problem:** the hero's outlined "INFRA" could not be read on night_shift. Reported right after the tubes shipped, so it looked like a regression from them.

**It was not.** `.ghost-outline` strokes with `var(--line)`, the hairline colour — `#24271f` against `--bg #0a0b0a` is **1.30:1**. The word had been effectively invisible since the LATENT reskin; the tube field's bloom behind the glass panel just drew the eye to where it should have been.

## Approach

1. Compute the ratio before touching anything. A 12-line Node script (sRGB → linear → relative luminance) turns "looks faint" into `1.30:1`, which decides the fix instead of guessing at a colour.
2. Give the ghost type its **own token** (`--ghost`) rather than nudging `--line`. `--line` draws real borders and dividers all over the site; brightening it to fix one word would have repainted every rule on the page.
3. Set it per theme and check both. First pass lightened day to `#7c8073` too — but day strokes with near-black `#14150f` at **15.27:1** and already read perfectly. Day keeps its old value, so day_shift renders byte-identically.
4. Verify with a **clipped, 2x screenshot of just the panel**, not a full-page shot. At full-page scale a 1px stroke is a few grey pixels and any judgement about it is imaginary.

Result: night `#5f635a` = 3.21:1 against the page, 2.91:1 over the glass panel. Same class also drives the BootLoader's giant INFRA, which now reads slightly stronger — checked, kept.

## Rule

Before recolouring anything for legibility, compute the contrast ratio and check whether the token you are about to change is shared. A "ghost" element still needs its own colour token — borrowing the border colour is how something ends up rendered correctly and still unreadable.
