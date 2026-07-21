import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { BOOT_LINES, shouldBoot, markBooted } from '../lib/boot'

// LATENT-style kinetic loader: grid canvas, ghost wordmark, giant lime %-counter,
// a cycling sampling readout, and a progress rule that fills to 100.
export default function BootLoader() {
  const reduced = useReducedMotion()
  const [show, setShow] = useState(() => !reduced && shouldBoot(sessionStorage))
  const [pct, setPct] = useState(0)
  const rafish = useRef(0)

  const finish = () => { markBooted(sessionStorage); setShow(false) }

  // count 0 -> 100 with slight ease, then hand off
  useEffect(() => {
    if (!show) return
    let cur = 0
    const tick = () => {
      cur += Math.max(1, Math.round((100 - cur) * 0.08))
      if (cur >= 100) { cur = 100; setPct(100); rafish.current = window.setTimeout(finish, 480); return }
      setPct(cur)
      rafish.current = window.setTimeout(tick, 60)
    }
    rafish.current = window.setTimeout(tick, 120)
    return () => clearTimeout(rafish.current)
  }, [show])

  // any key / click skips
  useEffect(() => {
    if (!show) return
    const skip = () => finish()
    window.addEventListener('keydown', skip)
    window.addEventListener('pointerdown', skip)
    return () => {
      window.removeEventListener('keydown', skip)
      window.removeEventListener('pointerdown', skip)
    }
  }, [show])

  const readout = BOOT_LINES[Math.min(BOOT_LINES.length - 1, Math.floor((pct / 100) * BOOT_LINES.length))]

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          exit={{ opacity: 0, filter: 'blur(6px)' }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 bg-bg grid-bg cursor-pointer flex flex-col p-6 md:p-8 font-mono"
          aria-label="Boot sequence — click to skip"
        >
          <div className="flex items-center justify-between text-[10px] md:text-xs tracking-[0.25em] text-muted uppercase">
            <span>ASRUL.HASNI — BOOT SEQUENCE</span>
            <span className="tabular-nums">V18.0 · 2026</span>
          </div>

          <div className="flex-1 flex items-center">
            <div className="w-full flex flex-wrap items-end justify-between gap-6">
              <span className="ghost-outline font-display font-bold uppercase leading-none text-6xl md:text-[9rem] select-none">
                INFRA
              </span>
              <span className="font-display font-bold leading-none text-6xl md:text-[9rem] text-accent tabular-nums">
                {String(pct).padStart(3, '0')}<span className="text-muted">%</span>
              </span>
            </div>
          </div>

          <div>
            <div className="h-px bg-line relative mb-3">
              <div className="absolute inset-y-0 left-0 bg-accent" style={{ width: `${pct}%` }} />
            </div>
            <div className="flex items-center justify-between text-[10px] md:text-xs tracking-[0.2em] text-muted uppercase">
              <span className="text-accent">{readout}</span>
              <span className="tabular-nums">NODES 2,552 · SLA GREEN</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
