import { useEffect, useRef } from 'react'
import { animate, useInView, useReducedMotion } from 'framer-motion'

export function useCountUp(target, { decimals = 0, duration = 1.6 } = {}) {
  const ref = useRef(null)
  // Vertical-only inset. A uniform '-40px' also shrinks the root horizontally, and on mobile
  // (container padding is px-5 = 20px) a short number span sits entirely left of that inset —
  // it never intersects, so the stat stays stuck at 0. Only the bottom inset was ever wanted.
  const inView = useInView(ref, { once: true, margin: '0px 0px -40px 0px' })
  const reduced = useReducedMotion()

  useEffect(() => {
    if (!ref.current) return
    if (reduced) {
      ref.current.textContent = target.toFixed(decimals)
      return
    }
    if (!inView) return
    const controls = animate(0, target, {
      duration,
      ease: 'easeOut',
      onUpdate: v => { if (ref.current) ref.current.textContent = v.toFixed(decimals) },
    })
    return () => controls.stop()
  }, [inView, reduced, target, decimals, duration])

  return ref
}
