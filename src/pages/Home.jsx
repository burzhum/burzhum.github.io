import Nav from '../components/Nav'
import Footer from '../components/Footer'
import BootLoader from '../components/BootLoader'
import Hero from '../components/Hero'
import About from '../components/About'
import Experience from '../components/Experience'
import Projects from '../components/Projects'
import Noc from '../components/Noc'
import Skills from '../components/Skills'
import Contact from '../components/Contact'
import Terminal from '../components/Terminal'
import MatrixRain from '../components/MatrixRain'
import Cursor from '../components/Cursor'
import StatusBar from '../components/StatusBar'
import GhostMarquee from '../components/GhostMarquee'
import Thesis from '../components/Thesis'
import FieldNote from '../components/FieldNote'
import { useSmoothScroll } from '../lib/useSmoothScroll'
import { motion, useScroll, useTransform } from 'framer-motion'

export default function Home() {
  useSmoothScroll()
  const { scrollY } = useScroll()
  const auroraY = useTransform(scrollY, [0, 4000], [0, -360])
  return (
    <div className="min-h-screen grid-bg">
      <MatrixRain />
      <motion.div
        aria-hidden="true"
        className="aurora fixed inset-0 pointer-events-none"
        style={{ zIndex: -5, y: auroraY, opacity: 0.5 }}
      />
      <Cursor />
      <BootLoader />
      <Nav />
      <StatusBar />
      <main className="max-w-5xl mx-auto px-5 pt-24 pb-16 space-y-32 overflow-x-hidden">
        <Hero />
        <About />
        <Experience />
      </main>
      <GhostMarquee text="Direct the machine · own the outcome · verified, not hoped" />
      <main className="max-w-5xl mx-auto px-5 pt-8 space-y-32 overflow-x-hidden">
        <Thesis />
        <Projects />
      </main>
      <FieldNote />
      <main className="max-w-5xl mx-auto px-5 pt-8 pb-0 space-y-32 overflow-x-hidden">
        <Noc />
        <Skills />
        <Contact />
      </main>
      <Footer />
      <Terminal />
    </div>
  )
}
