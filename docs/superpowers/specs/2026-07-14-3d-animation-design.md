# 3D Animation Pass — "Terminal Editorial, Extruded"

**Date:** 2026-07-14
**Approved by:** Asrul (in-session, AskUserQuestion)
**Scope:** CSS 3D everywhere via Motion (framer-motion 12, already installed). No new dependencies. No WebGL.

## Goal

Upgrade every animated surface of burzhum.github.io from flat transforms to 3D (perspective, rotateX/rotateY, depth parallax) while preserving the site's hard guarantees.

## Hard constraints (all kept)

- `useReducedMotion` fallback on every effect — reduced users get static or flat equivalents.
- Transform/opacity-only animation (no layout-triggering properties).
- Lighthouse performance ≥95 (target: keep 100).
- Terminal Editorial identity untouched: Nav, Marquee, BootLoader, Terminal easter egg unchanged.
- 35 existing tests + confidentiality double-gate untouched and passing.
- Deploy held until explicit user OK (auto-deploy not selected).

## Design

### New primitive: `src/lib/Tilt3D.jsx`

Reusable pointer-tracking tilt wrapper:

- `useMotionValue` pointer position (0–1 per axis) → `useTransform` → `useSpring` (stiffness 300, damping 22) → `rotateX`/`rotateY`, max ±8° (configurable `max` prop).
- `transformPerspective: 900`, `transformStyle: preserve-3d`.
- Optional `glare` prop: gradient light-sweep strip whose horizontal position follows the pointer; revealed via Tailwind `group-hover` opacity (no extra JS).
- Reduced motion → renders a plain `div` with the same className, children intact.
- Tilt lives on a wrapper; entrance animations stay on the inner element so `style` motion values never fight `animate` values for the same property.

### Per-section treatments

| Surface | Change |
|---|---|
| Hero | Pointer-parallax depth layers: h1 (strongest, plus ±2° tilt), role/summary (medium), stats (subtle). Spring-smoothed motion values on section-level pointermove. Kinetic line reveal kept. |
| Section wrapper | Scroll reveal upgraded: `rotateX 10°→0` + rise + fade, `transformPerspective 1200`, origin top. |
| Project cards (12) | Wrapped in `Tilt3D` with glare. Entrance upgraded to `rotateX 18°→0`. Existing hover lift/tap spring kept on inner article. |
| NOC tiles | Wrapped in `Tilt3D` (max 6°, no glare). Entrance upgraded to 3D flip-up `rotateX 25°→0` stagger. |
| Skills tags | Stagger cascade upgraded to `rotateY 90°→0` flip, 30ms stagger kept. |
| Experience items | Swing in alternating `rotateY ∓12°→0` with existing x-slide, perspective 900. Scroll-draw timeline kept. |
| About | Headshot/ASCII card wrapped in `Tilt3D` with glare. |
| Contact | Section-level 3D reveal only (via shared Section). Buttons unchanged. |

### Testing

- New `Tilt3D` tests: renders children; reduced-motion renders static (no transform handlers).
- Full suite + confidentiality gate must pass.
- `npm run build` clean; local preview browse-verified (tilt, reveals, reduced-motion sanity).

### Out of scope

Three.js/WebGL, new dependencies, Nav/Marquee/BootLoader/Terminal changes, custom domain, deploy (separate user OK).
