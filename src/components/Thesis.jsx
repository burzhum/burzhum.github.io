import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'

// Statement whose words ignite (muted -> ink, lime for accent words) as the
// section scrolls through the viewport. No sticky pin — so no trailing dead space.
const WORDS =
  'Software is leverage. Leverage is direction — not typing. I architect, direct, verify. The machine writes the code; production is the proof.'.split(
    ' '
  )
const ACCENT = new Set(['leverage.', 'leverage', 'verify.', 'proof.'])

function Word({ word, i, total, progress, reduced }) {
  const start = i / total
  const end = Math.min(1, start + 1.2 / total)
  const acid = ACCENT.has(word.toLowerCase())
  const color = useTransform(
    progress,
    [start, end],
    ['var(--muted)', acid ? 'var(--accent)' : 'var(--ink)']
  )
  return (
    <motion.span style={reduced ? { color: acid ? 'var(--accent)' : 'var(--ink)' } : { color }} className="mr-[0.3em]">
      {word}
    </motion.span>
  )
}

export default function Thesis() {
  const reduced = useReducedMotion()
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.9', 'center 0.4'] })

  return (
    <section ref={ref} aria-label="How I build">
      <div className="flex items-center justify-between border-b border-line pb-3 mb-10 font-mono text-xs tracking-[0.3em] uppercase">
        <span className="text-accent">HOW I BUILD</span>
        <span className="text-muted tabular-nums">— THE METHOD</span>
      </div>
      <p className="font-display font-semibold uppercase leading-[1.08] tracking-tight text-2xl md:text-4xl max-w-3xl">
        {WORDS.map((w, i) => (
          <Word key={i} word={w} i={i} total={WORDS.length} progress={scrollYProgress} reduced={reduced} />
        ))}
      </p>
    </section>
  )
}
