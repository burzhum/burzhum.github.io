import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'

// Drifting particle network — the "latent space" starfield. Points wander slowly,
// faint lime links form between near neighbours, and the pointer nudges nearby nodes.
const COUNT = 90
const LINK_DIST = 130
const FRAME_MS = 33 // ~30fps, cheap

export default function ParticleField() {
  const ref = useRef(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext?.('2d')
    if (!ctx) return

    let raf = 0
    let last = 0
    let pts = []
    const mouse = { x: -9999, y: -9999 }
    let accent = '#c8ff2e'
    let ink = '#edeae2'

    const readColors = () => {
      const s = getComputedStyle(document.documentElement)
      accent = s.getPropertyValue('--accent').trim() || accent
      ink = s.getPropertyValue('--ink').trim() || ink
    }

    const seed = () => {
      const w = canvas.width, h = canvas.height
      pts = Array.from({ length: COUNT }, (_, i) => ({
        x: ((i * 97) % w),
        y: ((i * 53) % h),
        vx: (((i * 7) % 10) - 5) / 40,
        vy: (((i * 13) % 10) - 5) / 40,
        acid: i % 6 === 0, // ~1 in 6 glows lime
      }))
    }

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = Math.max(window.innerHeight, 1)
      seed()
    }

    const hex = (c, a) => {
      // c is #rrggbb
      const r = parseInt(c.slice(1, 3), 16), g = parseInt(c.slice(3, 5), 16), b = parseInt(c.slice(5, 7), 16)
      return `rgba(${r},${g},${b},${a})`
    }

    const draw = () => {
      const w = canvas.width, h = canvas.height
      ctx.clearRect(0, 0, w, h)
      // links
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y
          const d = Math.hypot(dx, dy)
          if (d < LINK_DIST) {
            ctx.strokeStyle = hex(accent, 0.06 * (1 - d / LINK_DIST))
            ctx.lineWidth = 1
            ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.stroke()
          }
        }
      }
      // nodes
      for (const p of pts) {
        ctx.fillStyle = p.acid ? hex(accent, 0.9) : hex(ink, 0.35)
        ctx.beginPath(); ctx.arc(p.x, p.y, p.acid ? 1.6 : 1.1, 0, Math.PI * 2); ctx.fill()
      }
    }

    const step = () => {
      const w = canvas.width, h = canvas.height
      for (const p of pts) {
        // pointer repulsion
        const mdx = p.x - mouse.x, mdy = p.y - mouse.y
        const md = Math.hypot(mdx, mdy)
        if (md < 120 && md > 0.1) { p.x += (mdx / md) * 0.6; p.y += (mdy / md) * 0.6 }
        p.x += p.vx; p.y += p.vy
        if (p.x < 0) p.x = w; else if (p.x > w) p.x = 0
        if (p.y < 0) p.y = h; else if (p.y > h) p.y = 0
      }
    }

    const frame = t => {
      raf = requestAnimationFrame(frame)
      if (t - last < FRAME_MS) return
      last = t
      step(); draw()
    }

    readColors()
    resize()

    if (reduced) {
      draw() // one static frame
    } else {
      raf = requestAnimationFrame(frame)
    }

    const onMove = e => { mouse.x = e.clientX; mouse.y = e.clientY }
    const onLeave = () => { mouse.x = -9999; mouse.y = -9999 }
    const observer = new MutationObserver(readColors)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerleave', onLeave)

    return () => {
      cancelAnimationFrame(raf)
      observer.disconnect()
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerleave', onLeave)
    }
  }, [reduced])

  return (
    <canvas
      ref={ref}
      data-testid="particle-field"
      aria-hidden="true"
      className="fixed inset-0 -z-10 pointer-events-none opacity-70"
    />
  )
}
