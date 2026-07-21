import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="mt-32 font-mono text-xs text-muted">
      {/* LATENT-style giant rolling ghost-outline band */}
      <div className="overflow-hidden select-none" aria-hidden="true">
        <div className="marquee-track inline-block whitespace-nowrap glow-outline font-display font-bold uppercase text-[13vw] leading-[0.85]" style={{ animationDuration: '30s' }}>
          {'HOSPITALS ONLINE — SOFTWARE SHIPPED — '.repeat(4)}
        </div>
      </div>

      <div className="border-t border-line pt-8 pb-10">
        <div className="max-w-5xl mx-auto px-5 grid gap-8 md:grid-cols-3">
          <div>
            <div className="text-ink font-bold tracking-[0.2em] uppercase">Asrul·Hasni</div>
            <p className="mt-2 leading-relaxed max-w-xs">
              Service delivery for a 1,200-bed hospital — and production software, built by directing AI agents.
            </p>
          </div>
          <div>
            <div className="text-muted/70 tracking-[0.25em] uppercase mb-2">Sitemap</div>
            <ul className="space-y-1">
              {['about', 'experience', 'projects', 'ops', 'skills', 'contact'].map(s => (
                <li key={s}>
                  <a href={`#${s}`} className="hover:text-accent transition-colors">./{s}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="text-muted/70 tracking-[0.25em] uppercase mb-2">Colophon</div>
            <p className="leading-relaxed">
              React 18 · Vite · Tailwind<br />
              Framer Motion · Canvas<br />
              Clash Display / Instrument Serif / JetBrains Mono
            </p>
            <p className="mt-3 text-muted/60">No hospitals were taken offline in the making of this site.</p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-5 mt-8 flex flex-wrap gap-x-6 gap-y-2 justify-between border-t border-line pt-6">
          <span>© {new Date().getFullYear()} Asrul Hasni — built by directing AI agents.</span>
          <span>
            psst: press{' '}
            <button
              onClick={() => window.dispatchEvent(new Event('open-terminal'))}
              className="text-accent hover:underline"
            >
              <kbd className="border border-line px-1">ctrl+`</kbd>
            </button>{' '}
            · or wander into <Link to="/lab" className="text-accent hover:underline">/lab</Link>
          </span>
        </div>
      </div>
    </footer>
  )
}
