import { motion, useSpring, useTransform, useReducedMotion } from 'framer-motion'
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

const parallaxSpring = { stiffness: 120, damping: 20, mass: 0.5 }

export default function Hero() {
  const reduced = useReducedMotion()
  const px = useSpring(0.5, parallaxSpring)
  const py = useSpring(0.5, parallaxSpring)
  // depth layers: h1 moves most + tilts, meta moves less, stats least
  const h1x = useTransform(px, [0, 1], [14, -14])
  const h1y = useTransform(py, [0, 1], [10, -10])
  const h1rx = useTransform(py, [0, 1], [2.5, -2.5])
  const h1ry = useTransform(px, [0, 1], [-2.5, 2.5])
  const metax = useTransform(px, [0, 1], [7, -7])
  const metay = useTransform(py, [0, 1], [5, -5])
  const statx = useTransform(px, [0, 1], [3, -3])
  const staty = useTransform(py, [0, 1], [2, -2])

  const onPointerMove = e => {
    if (reduced) return
    const r = e.currentTarget.getBoundingClientRect()
    if (!r.width || !r.height) return
    px.set((e.clientX - r.left) / r.width)
    py.set((e.clientY - r.top) / r.height)
  }
  const reset = () => { px.set(0.5); py.set(0.5) }

  return (
    <section
      id="hero"
      className="pt-10"
      style={reduced ? undefined : { perspective: '1000px' }}
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
    >
      <p className="font-mono text-xs text-muted">
        $ whoami<span className="inline-block w-2 h-3.5 bg-accent ml-1.5 cursor-blink align-middle" />
      </p>
      <motion.h1
        className="font-black uppercase leading-[0.95] tracking-tight text-5xl md:text-7xl mt-5"
        aria-label="I keep hospitals online. I ship software with AI."
        style={reduced ? undefined : { x: h1x, y: h1y, rotateX: h1rx, rotateY: h1ry, transformStyle: 'preserve-3d' }}
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
      </motion.h1>
      <motion.div style={reduced ? undefined : { x: metax, y: metay }}>
        <p className="font-mono text-xs tracking-widest text-accent2 uppercase mt-6">{profile.role}</p>
        <p className="text-muted max-w-xl mt-4 text-sm leading-relaxed">{profile.summary}</p>
      </motion.div>
      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12"
        style={reduced ? undefined : { x: statx, y: staty }}
      >
        {profile.stats.map(s => <Stat key={s.label} s={s} />)}
      </motion.div>
      <div className="mt-14 -mx-5">
        <Marquee items={['Infrastructure', 'Incident Command', 'AI-Augmented Engineering', 'Service Delivery', 'VMware', 'Cisco', 'Veeam', 'React', 'Node', 'PostgreSQL']} />
      </div>
    </section>
  )
}
