import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'

// Scroll-pinned statement: a tall track with a sticky centred block whose words
// ignite (muted -> ink, lime for the accent word) as you scroll through it.
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
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.4'] })

  return (
    <section ref={ref} className="relative h-[220vh]" aria-label="Thesis">
      <div className="sticky top-0 min-h-screen flex flex-col justify-center">
        <div className="flex items-center justify-between border-b border-line pb-3 mb-10 font-mono text-xs tracking-[0.3em] uppercase">
          <span className="text-accent">03 <span className="text-muted">— THESIS</span></span>
          <span className="text-muted tabular-nums">HOW I BUILD</span>
        </div>
        <p className="font-display font-semibold uppercase leading-[1.05] tracking-tight text-3xl md:text-6xl max-w-4xl">
          {WORDS.map((w, i) => (
            <Word key={i} word={w} i={i} total={WORDS.length} progress={scrollYProgress} reduced={reduced} />
          ))}
        </p>
      </div>
    </section>
  )
}
