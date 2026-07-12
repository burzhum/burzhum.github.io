import Section from './Section'
import { profile } from '../data/profile'

const headshots = import.meta.glob('../assets/headshot.jpg', { eager: true, import: 'default' })
const headshot = Object.values(headshots)[0]

const FACTS = [
  ['ROLE', 'Service Delivery Manager / Infra Lead'],
  ['LOCATION', profile.location],
  ['INDUSTRY', 'Healthcare · Enterprise IT'],
  ['UPTIME', '18+ years and counting'],
]

const WORKFLOW = [
  ['01 ARCHITECT', 'I define the system: data model, boundaries, failure modes, deploy target.'],
  ['02 DIRECT', 'AI agents write the code under instruction. I interrogate every decision that matters.'],
  ['03 VERIFY', 'Nothing ships on faith — endpoints curled, roles tested, evidence in the report.'],
  ['04 OPERATE', 'I run what I ship: monitoring, backups, alerting, incident response. Production is the exam.'],
]

export default function About() {
  return (
    <Section id="about" title="about">
      <div className="grid md:grid-cols-[180px_1fr] gap-10">
        <div className="border border-line bg-card aspect-square flex items-center justify-center overflow-hidden">
          {headshot
            ? <img src={headshot} alt="Asrul Hasni" className="w-full h-full object-cover" />
            : <pre className="font-mono text-accent text-[9px] leading-tight" aria-label="portrait placeholder">{`
 ┌────────────┐
 │  ▒▒▒▒▒▒▒▒  │
 │  ▒ o  o ▒  │
 │  ▒  __  ▒  │
 │   ▒▒▒▒▒▒   │
 │  [ASRUL]   │
 └────────────┘`}</pre>}
        </div>
        <div>
          <dl className="grid grid-cols-2 gap-x-8 gap-y-4">
            {FACTS.map(([k, v]) => (
              <div key={k}>
                <dt className="font-mono text-[10px] tracking-[0.25em] text-muted">{k}</dt>
                <dd className="text-sm mt-1">{v}</dd>
              </div>
            ))}
          </dl>
          <h3 className="font-black uppercase text-xl mt-10 mb-4">How I build<span className="text-accent">_</span></h3>
          <ol className="space-y-3">
            {WORKFLOW.map(([k, v]) => (
              <li key={k} className="grid md:grid-cols-[130px_1fr] gap-2 text-sm">
                <span className="font-mono text-accent text-xs tracking-widest">{k}</span>
                <span className="text-muted">{v}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Section>
  )
}
