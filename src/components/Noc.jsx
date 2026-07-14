import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import Section from './Section'
import Tilt3D from './Tilt3D'
import { incidents } from '../data/incidents'

const spring = { type: 'spring', stiffness: 300, damping: 22 }

const TILES = [
  { label: 'AVAILABILITY', base: 99.9, unit: '%', jitter: 0 },
  { label: 'ENDPOINTS UP', base: 1800, unit: '+', jitter: 3 },
  { label: 'BACKUP JOBS OK', base: 9, unit: '/9', jitter: 0 },
  { label: 'OPEN P1 INCIDENTS', base: 0, unit: '', jitter: 0 },
]

const LEVEL_COLOR = { CRIT: 'text-red-400', WARN: 'text-yellow-400', OK: 'text-accent' }

function Tile({ t, i, reduced }) {
  const [v, setV] = useState(t.base)
  useEffect(() => {
    if (reduced || !t.jitter) return
    const id = setInterval(() => setV(t.base + Math.floor(Math.random() * t.jitter)), 2200)
    return () => clearInterval(id)
  }, [reduced, t])
  return (
    <motion.div
      className="h-full border border-line bg-card p-4 hover:border-accent transition-colors"
      style={reduced ? undefined : { transformPerspective: 700, transformOrigin: 'bottom center' }}
      initial={reduced ? false : { opacity: 0, y: 16, rotateX: 25, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ delay: i * 0.08, ...spring }}
      {...(reduced ? {} : { whileHover: { y: -4, transition: spring } })}
    >
      <div className="flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full bg-accent ${reduced ? '' : 'cursor-blink'}`} aria-hidden="true" />
        <span className="font-mono text-[10px] tracking-[0.2em] text-muted">{t.label}</span>
      </div>
      <p className="font-black text-3xl mt-2">{v}<span className="text-accent text-xl">{t.unit}</span></p>
    </motion.div>
  )
}

export default function Noc() {
  const reduced = useReducedMotion()
  return (
    <Section id="ops" title="ops — the night shift never lies">
      <p className="font-mono text-[10px] tracking-widest text-muted -mt-4 mb-6">
        ⚠ ILLUSTRATIVE SAMPLE DATA — the incidents below, however, were real
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {TILES.map((t, i) => (
          <Tilt3D key={t.label} max={6} className="h-full">
            <Tile t={t} i={i} reduced={reduced} />
          </Tilt3D>
        ))}
      </div>
      <div className="border border-line bg-card mt-4 p-4 font-mono text-xs overflow-hidden">
        <p className="text-muted tracking-widest text-[10px] mb-3">$ tail -f /var/log/career/incidents.log</p>
        <ul className="space-y-2">
          {incidents.map(inc => (
            <li key={inc.text} className="flex gap-3">
              <span className="text-muted shrink-0">{inc.ts}</span>
              <span className={`shrink-0 w-11 ${LEVEL_COLOR[inc.level]}`}>[{inc.level}]</span>
              <span className="text-ink/90">{inc.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}
