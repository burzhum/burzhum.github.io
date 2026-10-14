# Lenis smooth-scroll blocks scrolling inside nested panels

**Problem:** The terminal overlay (`ctrl+``) cut off long output such as `help`, and the mouse wheel would not scroll it.

**Approach:**
1. Saw that the output div was `overflow-y-auto`, so the CSS was right. The cause had to be event handling.
2. `useSmoothScroll.js` runs Lenis with `smoothWheel: true`. Lenis listens for wheel events on window and calls preventDefault, so nested scroll containers never receive the wheel.
3. Lenis 1.x skips any element that has (or sits inside one that has) the `data-lenis-prevent` attribute. Added it to the terminal panel.
4. Wrote a component test that asserts the attribute on the opened panel. It failed before the fix and passed after.
5. Verified live with real input: headless Chrome via CDP, `Input.dispatchMouseEvent` type `mouseWheel` over the panel. Synthetic `WheelEvent` dispatch never scrolls anything natively, so it proves nothing.
   - Result: scrollTop went 666 → 0 and the page did not move.
   - Control: removed the attribute and wheeled again; it stayed at 666.
   - Gotcha: the output has to overflow first. At a 900px viewport, one `help` fit inside 45vh (max scroll 0), so I used a 600px viewport and ran `help` 3 times.

**Reusable rule:** With Lenis or any wheel-hijacking smooth scroller on the page, every nested scrollable element (modal, terminal, dropdown list) needs `data-lenis-prevent`. Verify with a CDP `mouseWheel` plus a control run without the attribute, not with a dispatched `WheelEvent`.
