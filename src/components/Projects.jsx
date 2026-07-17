import { motion, useReducedMotion } from 'framer-motion'
import Section from './Section'
import Tilt3D from './Tilt3D'
import { projects } from '../data/projects'

const spring = { type: 'spring', stiffness: 300, damping: 22 }

const card = (reduced, i) => ({
  initial: reduced ? false : { opacity: 0, y: 24, rotateX: 18 },
  whileInView: { opacity: 1, y: 0, rotateX: 0 },
  viewport: { once: true, margin: '-30px' },
  transition: { delay: (i % 3) * 0.07, duration: 0.45 },
  style: reduced ? undefined : { transformPerspective: 800 },
  ...(reduced ? {} : {
    whileHover: { y: -6, transition: spring },
    whileTap: { scale: 0.985, transition: spring },
  }),
})

function PublicCard({ p, i, reduced }) {
  return (
    <motion.article {...card(reduced, i)} data-testid="project-card"
      className="h-full border border-line bg-card p-5 hover:border-accent transition-colors group">
      <p className="font-mono text-[10px] tracking-[0.25em] text-accent">{p.tag}</p>
      <h4 className="font-black uppercase text-lg mt-2 group-hover:text-accent transition-colors">{p.name}</h4>
      <p className="text-sm text-muted mt-2 leading-relaxed">{p.desc}</p>
      <p className="font-mono text-[10px] text-accent2 mt-3">{p.stack.join(' · ')}</p>
      <div className="mt-4 flex flex-col gap-1">
        {p.private ? (
          <span className="font-mono text-xs text-muted">● private · demo on request</span>
        ) : (
          p.links.map(l => (
            <a key={l.href} href={l.href} target="_blank" rel="noreferrer"
               className="font-mono text-xs text-accent hover:underline">↗ {l.label}</a>
          ))
        )}
      </div>
    </motion.article>
  )
}

function EnterpriseCard({ p, i, reduced }) {
  return (
    <motion.article {...card(reduced, i)} data-testid="project-card"
      className="h-full border border-line bg-card p-5 hover:border-accent transition-colors">
      <h4 className="font-black uppercase text-base">{p.name}</h4>
      {[['PROBLEM', p.problem], ['SOLUTION', p.solution], ['IMPACT', p.impact]].map(([k, v]) => (
        <p key={k} className="text-xs text-muted mt-2 leading-relaxed">
          <span className="font-mono text-[10px] tracking-[0.2em] text-accent mr-2">{k}</span>{v}
        </p>
      ))}
      <p className="font-mono text-[10px] text-accent2 mt-3">{p.stack.join(' · ')}</p>
    </motion.article>
  )
}

export default function Projects() {
  const reduced = useReducedMotion()
  return (
    <Section id="projects" title="projects — 12 in production">
      <h3 className="font-mono text-xs tracking-widest text-muted mb-5">TRACK A · PERSONAL — my own projects, public & private</h3>
      <div className="grid md:grid-cols-3 gap-4">
        {projects.publicTrack.map((p, i) => (
          <Tilt3D key={p.name} glare className="h-full">
            <PublicCard p={p} i={i} reduced={reduced} />
          </Tilt3D>
        ))}
      </div>
      <h3 className="font-mono text-xs tracking-widest text-muted mt-12 mb-2">TRACK B · ENTERPRISE — built for a 900-bed government hospital</h3>
      <p className="text-xs text-muted mb-5 font-mono">details anonymized — these run on a private network, doing real work every day</p>
      <div className="grid md:grid-cols-3 gap-4">
        {projects.enterpriseTrack.map((p, i) => (
          <Tilt3D key={p.name} glare className="h-full">
            <EnterpriseCard p={p} i={i} reduced={reduced} />
          </Tilt3D>
        ))}
      </div>
    </Section>
  )
}
