import { motion, useReducedMotion } from 'framer-motion'
import Section from './Section'
import { experience } from '../data/experience'

export default function Experience() {
  const reduced = useReducedMotion()
  return (
    <Section id="experience" title="experience — uptime log">
      <div className="relative pl-6 md:pl-8">
        <motion.div
          className="absolute left-0 top-1 bottom-1 w-px bg-accent origin-top"
          initial={reduced ? false : { scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
        <ol className="space-y-12">
          {experience.map((job, i) => (
            <motion.li
              key={job.company}
              style={reduced ? undefined : { transformPerspective: 900, transformOrigin: 'left center' }}
              initial={reduced ? false : { opacity: 0, x: -16, rotateY: i % 2 ? 12 : -12 }}
              whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="relative"
            >
              <span
                className="absolute top-1.5 w-2.5 h-2.5 bg-accent"
                style={{ left: 'calc(-1.5rem - 5px)' }}
                aria-hidden="true"
              />
              <p className="font-mono text-xs text-accent tracking-widest">{job.years}</p>
              <h3 className="font-black uppercase text-lg mt-1">{job.company}</h3>
              <p className="font-mono text-xs text-accent2 mt-0.5">{job.title}</p>
              <ul className="mt-3 space-y-1.5">
                {job.points.map(p => (
                  <li key={p} className="text-sm text-muted leading-relaxed before:content-['▸'] before:text-accent before:mr-2">{p}</li>
                ))}
              </ul>
            </motion.li>
          ))}
        </ol>
      </div>
    </Section>
  )
}
