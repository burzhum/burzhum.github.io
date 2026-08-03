# useInView '-40px' margin killed count-up stats on mobile

**Problem:** On phones, two of the four hero stats rendered a permanent `0`
(SLA availability, production apps live). Desktop was fine. Nothing in the
console, no layout overflow, no failing test.

**Approach**

1. Reproduced at a real narrow viewport. Chrome's `resize_window` did not
   change `innerWidth` on a maximized window, so instead injected a
   same-origin `<iframe>` 390x844 into the page — that gives a genuine
   387px layout viewport that JS can measure and script.
2. Scripted a horizontal-overflow sweep inside the iframe
   (`getBoundingClientRect().right > innerWidth`). It found only the
   intentional marquees — so the bug was not overflow.
3. Read the actual text content of the stat grid at that width: two cells
   stayed `0` while the other two counted up. The dead ones were both the
   **left column**.
4. Measured the failing spans: `left: 20, right: 38`. The count-up hook
   used `useInView(ref, { once: true, margin: '-40px' })`. A bare `-40px`
   is a rootMargin on **all four sides**, so the observer root starts at
   x = 40. A short number span (`"0"`, 18px wide) at container padding
   `px-5` (20px) ends at x = 38 — entirely left of the root. It can never
   intersect, so `inView` never flips and the element keeps its initial
   `0`. On desktop the container is centred, the left offset is large, and
   the bug is invisible.
5. Fix: make the inset vertical-only — `margin: '0px 0px -40px 0px'`.

**Rule:** an IntersectionObserver `rootMargin` written as a single negative
value shrinks the root horizontally too. If any observed element is narrow
and sits near a screen edge (small viewports make this common), it will
never fire. Always spell out the sides you actually mean.
