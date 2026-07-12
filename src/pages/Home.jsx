import Nav from '../components/Nav'
import Footer from '../components/Footer'
import { profile } from '../data/profile'

export default function Home() {
  return (
    <div className="min-h-screen grid-bg">
      <Nav />
      <main className="max-w-5xl mx-auto px-5 pt-24 space-y-32">
        <section id="hero"><h1 className="font-black uppercase text-5xl">{profile.name}</h1></section>
        <section id="about" />
        <section id="experience" />
        <section id="projects" />
        <section id="ops" />
        <section id="skills" />
        <section id="contact" />
      </main>
      <Footer />
    </div>
  )
}
