import { motion, useReducedMotion } from 'framer-motion'

export default function Section({ id, title, children }) {
  const reduced = useReducedMotion()
  return (
    <motion.section
      id={id}
      initial={reduced ? false : { opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <h2 className="font-mono text-xs tracking-[0.3em] text-accent uppercase mb-8">
        <span className="text-muted">##</span> {title}
      </h2>
      {children}
    </motion.section>
  )
}
