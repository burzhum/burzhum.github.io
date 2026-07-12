import { useEffect, useRef } from 'react'
import { animate, useInView, useReducedMotion } from 'framer-motion'

export function useCountUp(target, { decimals = 0, duration = 1.6 } = {}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
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
