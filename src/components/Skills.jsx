import Section from './Section'
import { skills } from '../data/skills'

export default function Skills() {
  return (
    <Section id="skills" title="skills — no progress bars, just receipts">
      <div className="grid md:grid-cols-2 gap-x-10 gap-y-8">
        {skills.map(g => (
          <div key={g.group}>
            <h3 className="font-mono text-[10px] tracking-[0.3em] text-accent mb-3">{g.group}</h3>
            <div className="flex flex-wrap gap-2">
              {g.items.map(i => (
                <span key={i} className="font-mono text-xs border border-line px-2.5 py-1 hover:border-accent hover:text-accent transition-colors cursor-default">{i}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  )
}
