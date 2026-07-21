import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'

// Custom cursor: a precise lime dot + a lagging ring that grows over interactive targets.
// Disabled on touch / reduced-motion (falls back to the native cursor).
export default function Cursor() {
  const reduced = useReducedMotion()
  const [enabled, setEnabled] = useState(false)
  const [hot, setHot] = useState(false)

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const rx = useSpring(x, { stiffness: 350, damping: 28, mass: 0.4 })
  const ry = useSpring(y, { stiffness: 350, damping: 28, mass: 0.4 })

  useEffect(() => {
    if (reduced) return
    const fine = window.matchMedia('(pointer: fine)').matches
    if (!fine) return
    setEnabled(true)
    document.documentElement.classList.add('has-custom-cursor')

    const move = e => { x.set(e.clientX); y.set(e.clientY) }
    const over = e => {
      const t = e.target
      setHot(!!(t.closest && t.closest('a, button, [role="button"], input, kbd, .cursor-hot')))
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerover', over)
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerover', over)
      document.documentElement.classList.remove('has-custom-cursor')
    }
  }, [reduced])

  if (!enabled) return null

  return (
    <>
      <motion.div
        aria-hidden="true"
        className="fixed top-0 left-0 z-[60] pointer-events-none rounded-full bg-accent mix-blend-difference"
        style={{ x, y, width: 6, height: 6, translateX: '-50%', translateY: '-50%' }}
      />
      <motion.div
        aria-hidden="true"
        className="fixed top-0 left-0 z-[60] pointer-events-none rounded-full border border-accent"
        style={{ x: rx, y: ry, translateX: '-50%', translateY: '-50%' }}
        animate={{ width: hot ? 46 : 26, height: hot ? 46 : 26, opacity: hot ? 0.9 : 0.5 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      />
    </>
  )
}
