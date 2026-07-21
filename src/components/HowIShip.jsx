import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion'

// LATENT "HOW IT THINKS" analogue: a centred statement with a lime glow that
// tracks the pointer, and a heading that leans toward the cursor.
export default function HowIShip() {
  const reduced = useReducedMotion()
  const mx = useMotionValue(0.5)
  const my = useMotionValue(0.5)
  const glowX = useSpring(mx, { stiffness: 120, damping: 20 })
  const glowY = useSpring(my, { stiffness: 120, damping: 20 })
  const gx = useTransform(glowX, v => `${v * 100}%`)
  const gy = useTransform(glowY, v => `${v * 100}%`)
  const leanX = useTransform(glowX, [0, 1], [16, -16])
  const leanY = useTransform(glowY, [0, 1], [8, -8])

  const onMove = e => {
    if (reduced) return
    const r = e.currentTarget.getBoundingClientRect()
    if (!r.width) return
    mx.set((e.clientX - r.left) / r.width)
    my.set((e.clientY - r.top) / r.height)
  }

  return (
    <section
      id="how"
      onPointerMove={onMove}
      className="relative overflow-hidden border-y border-line py-28 md:py-40 flex flex-col items-center text-center cursor-hot"
    >
      {!reduced && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute w-[45vw] h-[45vw] max-w-[560px] max-h-[560px] rounded-full"
          style={{
            left: gx, top: gy, x: '-50%', y: '-50%',
            background: 'radial-gradient(circle, var(--accent) 0%, transparent 62%)',
            opacity: 0.14, filter: 'blur(30px)',
          }}
        />
      )}
      <div className="relative">
        <div className="font-mono text-xs tracking-[0.3em] uppercase text-muted mb-6">
          <span className="text-accent">04</span> — HOW I SHIP
        </div>
        <motion.h2
          className="font-display font-bold uppercase leading-[0.9] tracking-tight text-5xl md:text-8xl"
          style={reduced ? undefined : { x: leanX, y: leanY }}
        >
          PROMPT → PRODUCTION
        </motion.h2>
        <p className="font-serif italic text-xl md:text-3xl text-ink/85 mt-6">
          watch a change go from conversation to a live hospital system — verified, not hoped ↓
        </p>
      </div>
    </section>
  )
}
