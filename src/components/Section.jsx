import { motion, useReducedMotion } from 'framer-motion'

const ORDER = ['about', 'experience', 'projects', 'ops', 'skills', 'contact']
const pad = n => String(n).padStart(2, '0')

export default function Section({ id, title, children }) {
  const reduced = useReducedMotion()
  const idx = ORDER.indexOf(id)
  const num = idx >= 0 ? pad(idx + 1) : '00'
  const total = pad(ORDER.length)
  return (
    <motion.section
      id={id}
      style={reduced ? undefined : { transformPerspective: 1200, transformOrigin: 'top center' }}
      initial={reduced ? false : { opacity: 0, y: 32, rotateX: 10 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="flex items-center justify-between border-b border-line pb-3 mb-8 font-mono text-xs tracking-[0.3em] uppercase">
        <span className="text-accent">
          {num} <span className="text-muted">— {title}</span>
        </span>
        <span className="text-muted tabular-nums">{num} / {total}</span>
      </div>
      {children}
    </motion.section>
  )
}
