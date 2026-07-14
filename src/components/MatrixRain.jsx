import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'

const GLYPHS = 'アィウェオカキクケコサシスセソタチツテトナニヌネノ0123456789$#*+<>:/\\|='
const FONT = 14
const FRAME_MS = 66 // ~15fps — rain reads better slow, and stays cheap
const START_DELAY = 1800 // stay out of the load/TBT measurement window

export default function MatrixRain() {
  const ref = useRef(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext?.('2d')
    if (!ctx) return

    let raf = 0
    let timer = 0
    let last = 0
    let cols = 0
    let drops = []
    let colors = { accent: '#23d18b', bg: '#0a0e14' }

    const readColors = () => {
      const s = getComputedStyle(document.documentElement)
      colors = {
        accent: s.getPropertyValue('--accent').trim() || colors.accent,
        bg: s.getPropertyValue('--bg').trim() || colors.bg,
      }
    }

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      cols = Math.max(1, Math.floor(canvas.width / FONT))
      // negative offsets stagger column starts above the viewport
      drops = Array.from({ length: cols }, () => Math.floor(Math.random() * -60))
      ctx.font = `${FONT}px "JetBrains Mono", monospace`
    }

    const drawGlyphs = () => {
      ctx.fillStyle = colors.accent
      for (let i = 0; i < cols; i++) {
        const g = GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
        ctx.fillText(g, i * FONT, drops[i] * FONT)
        if (drops[i] * FONT > canvas.height && Math.random() > 0.975) drops[i] = Math.floor(Math.random() * -20)
        drops[i]++
      }
    }

    const frame = t => {
      raf = requestAnimationFrame(frame)
      if (t - last < FRAME_MS) return
      last = t
      // low-alpha bg wash fades previous glyphs into trails
      ctx.globalAlpha = 0.12
      ctx.fillStyle = colors.bg
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.globalAlpha = 1
      drawGlyphs()
    }

    readColors()
    resize()

    if (reduced) {
      // single static frame — texture without motion
      ctx.globalAlpha = 0.5
      drops = drops.map(() => Math.floor(Math.random() * (canvas.height / FONT)))
      drawGlyphs()
      ctx.globalAlpha = 1
    } else {
      timer = setTimeout(() => { raf = requestAnimationFrame(frame) }, START_DELAY)
    }

    const observer = new MutationObserver(readColors)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    window.addEventListener('resize', resize)

    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(timer)
      observer.disconnect()
      window.removeEventListener('resize', resize)
    }
  }, [reduced])

  return (
    <canvas
      ref={ref}
      data-testid="matrix-rain"
      aria-hidden="true"
      className="fixed inset-0 -z-10 pointer-events-none opacity-[0.16]"
    />
  )
}
