import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'

// Pinned bg-morph interlude: as this section scrolls, a paper layer fades in over
// the dark page (the "background morph"), a big serif pull-quote scales through,
// then it morphs back to dark. Mirrors the reference's cream FIELD NOTE panel.
export default function FieldNote() {
  const reduced = useReducedMotion()
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })

  const paper = useTransform(scrollYProgress, [0.12, 0.38, 0.62, 0.88], [0, 1, 1, 0])
  const qScale = useTransform(scrollYProgress, [0.2, 0.5, 0.8], [1.14, 1, 0.94])
  const qOpacity = useTransform(scrollYProgress, [0.24, 0.44, 0.6, 0.8], [0, 1, 1, 0])
  const qY = useTransform(scrollYProgress, [0.2, 0.8], [40, -40])

  if (reduced) {
    return (
      <section aria-label="Field note" className="max-w-3xl mx-auto px-6 py-24 text-center">
        <div className="font-mono text-xs tracking-[0.3em] uppercase text-accent2 mb-6">Field note — §01</div>
        <p className="font-serif text-2xl md:text-4xl leading-tight text-ink">
          I don’t write most of the code anymore. I decide what’s true, draw the boundaries, and make the
          machine prove it. The judgment is the job.
        </p>
      </section>
    )
  }

  return (
    <section ref={ref} className="relative h-[200vh]" aria-label="Field note">
      {/* paper background morph */}
      <motion.div
        aria-hidden="true"
        className="fixed inset-0 z-[30] pointer-events-none"
        style={{ opacity: paper, backgroundColor: '#edeae2' }}
      />
      <div className="sticky top-0 h-screen flex items-center justify-center px-6">
        <motion.div style={{ scale: qScale, opacity: qOpacity, y: qY }} className="relative z-[31] max-w-3xl text-center">
          <div className="font-mono text-xs tracking-[0.3em] uppercase text-[#c2410c] mb-6">Field note — §01</div>
          <p className="font-serif text-3xl md:text-5xl leading-[1.15] text-[#14150f]">
            I don’t write most of the code anymore. I decide what’s true, draw the boundaries, and make the
            machine prove it. <span className="italic">The judgment is the job.</span>
          </p>
        </motion.div>
      </div>
    </section>
  )
}
