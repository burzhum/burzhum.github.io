import { useRef } from 'react'
import { motion, useSpring, useTransform, useReducedMotion } from 'framer-motion'

const spring = { stiffness: 300, damping: 22, mass: 0.6 }

// Pointer-tracking 3D tilt wrapper. Tilt lives here so inner elements can keep
// their own entrance animations without style/animate fighting over rotateX.
export default function Tilt3D({ children, className = '', max = 8, glare = false, testId }) {
  const reduced = useReducedMotion()
  const ref = useRef(null)
  const px = useSpring(0.5, spring)
  const py = useSpring(0.5, spring)
  const rotateX = useTransform(py, [0, 1], [max, -max])
  const rotateY = useTransform(px, [0, 1], [-max, max])
  const glareLeft = useTransform(px, [0, 1], ['-40%', '110%'])

  if (reduced) {
    return <div className={className} data-testid={testId}>{children}</div>
  }

  const onPointerMove = e => {
    const r = ref.current?.getBoundingClientRect()
    if (!r || !r.width || !r.height) return
    px.set((e.clientX - r.left) / r.width)
    py.set((e.clientY - r.top) / r.height)
  }
  const reset = () => { px.set(0.5); py.set(0.5) }

  return (
    <motion.div
      ref={ref}
      data-testid={testId}
      className={`group/tilt relative ${className}`}
      style={{ rotateX, rotateY, transformPerspective: 900, transformStyle: 'preserve-3d' }}
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
    >
      {children}
      {glare && (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden opacity-0 group-hover/tilt:opacity-100 transition-opacity duration-300">
          <motion.div
            className="absolute top-[-20%] bottom-[-20%] w-1/3 rotate-12"
            style={{
              left: glareLeft,
              background: 'linear-gradient(90deg, transparent, color-mix(in srgb, var(--accent) 14%, transparent), transparent)',
            }}
          />
        </div>
      )}
    </motion.div>
  )
}
