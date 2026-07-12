import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { BOOT_LINES, shouldBoot, markBooted } from '../lib/boot'

export default function BootLoader() {
  const reduced = useReducedMotion()
  const [show, setShow] = useState(() => !reduced && shouldBoot(sessionStorage))
  const [count, setCount] = useState(0)

  const finish = () => { markBooted(sessionStorage); setShow(false) }

  useEffect(() => {
    if (!show) return
    if (count >= BOOT_LINES.length) {
      const t = setTimeout(finish, 450)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => setCount(c => c + 1), 170)
    return () => clearTimeout(t)
  }, [show, count])

  useEffect(() => {
    if (!show) return
    const skip = () => finish()
    window.addEventListener('keydown', skip)
    window.addEventListener('pointerdown', skip)
    return () => {
      window.removeEventListener('keydown', skip)
      window.removeEventListener('pointerdown', skip)
    }
  }, [show])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-bg grid-bg p-8 font-mono text-sm cursor-pointer"
          aria-label="Boot sequence — click to skip"
        >
          {BOOT_LINES.slice(0, count).map((l, i) => (
            <p key={i} className={i === BOOT_LINES.length - 1 ? 'text-accent' : 'text-muted'}>{l}</p>
          ))}
          <span className="inline-block w-2.5 h-4 bg-accent cursor-blink" />
          <p className="absolute bottom-6 right-8 text-xs text-muted">any key / click to skip</p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
