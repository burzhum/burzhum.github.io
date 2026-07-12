import Section from './Section'
import { profile } from '../data/profile'

const CV_MAILTO = 'mailto:asrul.hasni@gmail.com?subject=CV%20request%20%E2%80%94%20%5Byour%20company%5D&body=Hi%20Asrul%2C%20saw%20your%20site%20%E2%80%94%20please%20send%20your%20full%20CV.'

export default function Contact() {
  return (
    <Section id="contact" title="contact">
      <h3 className="font-black uppercase text-3xl md:text-5xl leading-tight">
        The site carries my CV's substance.<br />
        <span className="text-accent">Want the paper? Ask.</span>
      </h3>
      <div className="flex flex-wrap gap-4 mt-8 font-mono text-sm">
        <a href={CV_MAILTO} className="bg-accent text-bg font-bold px-5 py-2.5 hover:opacity-90 transition-opacity">REQUEST CV →</a>
        <a href={`mailto:${profile.email}`} className="border border-line px-5 py-2.5 hover:border-accent hover:text-accent transition-colors">{profile.email}</a>
        <a href={profile.linkedin} target="_blank" rel="noreferrer" className="border border-line px-5 py-2.5 hover:border-accent hover:text-accent transition-colors">LinkedIn</a>
        <a href={profile.github} target="_blank" rel="noreferrer" className="border border-line px-5 py-2.5 hover:border-accent hover:text-accent transition-colors">GitHub</a>
      </div>
    </Section>
  )
}
