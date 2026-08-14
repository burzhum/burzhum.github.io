import { useEffect, useRef, useState } from 'react'

// Neon tubes that chase the pointer across the hero, then coast in a slow orbit when it leaves.
// Engine: threejs-components (ISC) — three.js r180 bundled, ~190KB gzip, so it is imported
// lazily and only on hardware that will actually enjoy it.
//
// Deliberately NOT `fixed`: the layer is absolute at the top of the document, so scrolling past
// the hero moves the canvas out of the viewport and the engine's own IntersectionObserver
// parks the render loop. A fixed layer would render forever.
const START_DELAY = 1200 // stay out of the boot/LCP window before pulling the engine
const MIN_WIDTH = 768 // phones get the matrix rain instead; a GL scene is not worth their battery

const FALLBACK = { accent: '#3fc46e', accent2: '#ff5c1a', ink: '#edeae2' }

function palette() {
  const s = getComputedStyle(document.documentElement)
  const v = (name, fb) => s.getPropertyValue(name).trim() || fb
  const accent = v('--accent', FALLBACK.accent)
  const accent2 = v('--accent2', FALLBACK.accent2)
  const ink = v('--ink', FALLBACK.ink)
  return {
    tubes: [accent, accent2, ink],
    lights: [accent, accent2, ink, accent2],
  }
}

export default function TubesBg() {
  const ref = useRef(null)
  const [enabled, setEnabled] = useState(false)

  // Gate before rendering anything, so touch/reduced-motion visitors never allocate the canvas.
  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (fine && !reduced && window.innerWidth >= MIN_WIDTH) setEnabled(true)
  }, [])

  useEffect(() => {
    if (!enabled) return
    let app = null
    let observer = null
    let cancelled = false

    const timer = setTimeout(async () => {
      const { default: TubesCursor } = await import('threejs-components/build/cursors/tubes1.min.js')
      if (cancelled || !ref.current) return

      const p = palette()
      app = TubesCursor(ref.current, {
        tubes: { colors: p.tubes, lights: { intensity: 180, colors: p.lights } },
      })

      // day_shift / night_shift swap the CSS vars — repaint the tubes to match.
      observer = new MutationObserver(() => {
        const q = palette()
        app?.tubes?.setColors?.(q.tubes)
        app?.tubes?.setLightsColors?.(q.lights)
      })
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    }, START_DELAY)

    return () => {
      cancelled = true
      clearTimeout(timer)
      observer?.disconnect()
      app?.dispose?.()
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div
      aria-hidden="true"
      className="tubes-layer absolute top-0 left-0 w-full h-screen pointer-events-none overflow-hidden"
      style={{ zIndex: -4 }}
    >
      <canvas ref={ref} data-testid="tubes-bg" aria-hidden="true" className="w-full h-full pointer-events-none" />
    </div>
  )
}
