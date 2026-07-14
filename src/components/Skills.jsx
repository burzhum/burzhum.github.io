import { motion, useReducedMotion } from 'framer-motion'
import Section from './Section'
import { skills } from '../data/skills'

const spring = { type: 'spring', stiffness: 400, damping: 24 }

const groupVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.03 } },
}

const tagVariants = {
  hidden: { opacity: 0, y: 8, scale: 0.85, rotateY: 90 },
  visible: { opacity: 1, y: 0, scale: 1, rotateY: 0, transition: spring },
}

export default function Skills() {
  const reduced = useReducedMotion()
  return (
    <Section id="skills" title="skills — no progress bars, just receipts">
      <div className="grid md:grid-cols-2 gap-x-10 gap-y-8">
        {skills.map(g => (
          <div key={g.group}>
            <h3 className="font-mono text-[10px] tracking-[0.3em] text-accent mb-3">{g.group}</h3>
            <motion.div
              className="flex flex-wrap gap-2"
              variants={reduced ? undefined : groupVariants}
              initial={reduced ? false : 'hidden'}
              whileInView="visible"
              viewport={{ once: true, margin: '-30px' }}
            >
              {g.items.map(i => (
                <motion.span
                  key={i}
                  variants={reduced ? undefined : tagVariants}
                  style={reduced ? undefined : { transformPerspective: 600 }}
                  {...(reduced ? {} : { whileHover: { scale: 1.08, y: -2, rotateY: 8, transition: spring } })}
                  className="font-mono text-xs border border-line px-2.5 py-1 hover:border-accent hover:text-accent transition-colors cursor-default"
                >
                  {i}
                </motion.span>
              ))}
            </motion.div>
          </div>
        ))}
      </div>
    </Section>
  )
}
