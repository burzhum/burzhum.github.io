import { useEffect, useState } from 'react'
import { motion, useScroll } from 'framer-motion'

const pad = n => String(n).padStart(2, '0')

// Persistent LATENT chrome: a top scroll-progress scanline + a fixed bottom
// readout bar (live session clock left, signature right).
export default function StatusBar() {
  const { scrollYProgress } = useScroll()
  const [secs, setSecs] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setSecs(s => s + 1), 1000)
    return () => clearInterval(t)
  }, [])

  const clock = `${pad(Math.floor(secs / 60))}:${pad(secs % 60)}`

  return (
    <>
      {/* scroll scanline */}
      <motion.div
        aria-hidden="true"
        className="fixed top-0 left-0 right-0 z-[45] h-0.5 bg-accent origin-left"
        style={{ scaleX: scrollYProgress }}
      />
      {/* film grain */}
      <div aria-hidden="true" className="noise-bg pointer-events-none fixed inset-0 z-[44] opacity-[0.04]" />
      {/* bottom readout */}
      <div className="fixed bottom-0 inset-x-0 z-[45] border-t border-line bg-bg/85 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-5 py-2 flex items-center justify-between font-mono text-[10px] tracking-[0.2em] text-muted uppercase">
          <span className="tabular-nums">
            <span className="text-accent">SESSION {clock}</span> · SLA 99.90% · UPTIME GREEN
          </span>
          <span className="hidden sm:inline">ASRUL.HASNI — HOSPITALS ONLINE, SOFTWARE SHIPPED</span>
        </div>
      </div>
    </>
  )
}
