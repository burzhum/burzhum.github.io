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
import ParticleField from '../components/ParticleField'
import Cursor from '../components/Cursor'
import StatusBar from '../components/StatusBar'
import GhostMarquee from '../components/GhostMarquee'
import Thesis from '../components/Thesis'
import HowIShip from '../components/HowIShip'
import { useSmoothScroll } from '../lib/useSmoothScroll'

export default function Home() {
  useSmoothScroll()
  return (
    <div className="min-h-screen grid-bg">
      <ParticleField />
      <Cursor />
      <BootLoader />
      <Nav />
      <StatusBar />
      <main className="max-w-5xl mx-auto px-5 pt-24 pb-16 space-y-32 overflow-x-hidden">
        <Hero />
        <About />
        <Experience />
        <Thesis />
        <Projects />
      </main>
      <GhostMarquee text="Latent space — thought, rendered · hospitals online · software shipped" />
      <main className="max-w-5xl mx-auto px-5 space-y-32 overflow-x-hidden">
        <Noc />
        <Skills />
      </main>
      <div className="mt-32">
        <HowIShip />
      </div>
      <main className="max-w-5xl mx-auto px-5 pt-32 overflow-x-hidden">
        <Contact />
      </main>
      <Footer />
      <Terminal />
    </div>
  )
}
