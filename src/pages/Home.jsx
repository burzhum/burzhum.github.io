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

export default function Home() {
  return (
    <div className="min-h-screen grid-bg">
      <MatrixRain />
      <BootLoader />
      <Nav />
      <main className="max-w-5xl mx-auto px-5 pt-24 space-y-32 overflow-x-hidden">
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Noc />
        <Skills />
        <Contact />
      </main>
      <Footer />
      <Terminal />
    </div>
  )
}
