import { motion, useReducedMotion } from 'framer-motion'
import { profile } from '../data/profile'
import { useCountUp } from '../lib/useCountUp'
import Marquee from './Marquee'

function Stat({ s }) {
  const ref = useCountUp(s.value, { decimals: s.decimals ?? 0 })
  return (
    <div>
      <div className="font-black text-3xl md:text-4xl">
        {s.prefix}<span ref={ref}>0</span><span className="text-accent">{s.suffix}</span>
      </div>
      <div className="font-mono text-[10px] tracking-[0.2em] text-muted uppercase mt-1">{s.label}</div>
    </div>
  )
}

const line = {
  hidden: { y: '110%' },
  show: i => ({ y: 0, transition: { delay: 0.15 + i * 0.12, duration: 0.55, ease: [0.22, 1, 0.36, 1] } }),
}

export default function Hero() {
  const reduced = useReducedMotion()
  return (
    <section id="hero" className="pt-10">
      <p className="font-mono text-xs text-muted">
        $ whoami<span className="inline-block w-2 h-3.5 bg-accent ml-1.5 cursor-blink align-middle" />
      </p>
      <h1
        className="font-black uppercase leading-[0.95] tracking-tight text-5xl md:text-7xl mt-5"
        aria-label="I keep hospitals online. I ship software with AI."
      >
        {profile.tagline.map((t, i) => (
          <span key={t} className="block overflow-hidden">
            <motion.span
              className={`block ${i % 2 === 1 ? 'text-accent' : ''}`}
              variants={line} custom={i}
              initial={reduced ? false : 'hidden'} animate="show"
            >
              {t}
            </motion.span>
          </span>
        ))}
      </h1>
      <p className="font-mono text-xs tracking-widest text-accent2 uppercase mt-6">{profile.role}</p>
      <p className="text-muted max-w-xl mt-4 text-sm leading-relaxed">{profile.summary}</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12">
        {profile.stats.map(s => <Stat key={s.label} s={s} />)}
      </div>
      <div className="mt-14 -mx-5">
        <Marquee items={['Infrastructure', 'Incident Command', 'AI-Augmented Engineering', 'Service Delivery', 'VMware', 'Cisco', 'Veeam', 'React', 'Node', 'PostgreSQL']} />
      </div>
    </section>
  )
}
