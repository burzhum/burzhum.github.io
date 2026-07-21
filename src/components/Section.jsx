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
      style={reduced ? undefined : { transformPerspective: 1200, transformOrigin: 'center 40%' }}
      initial={reduced ? false : { opacity: 0, y: 40, scale: 1.12, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
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
