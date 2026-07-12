import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-line py-8 mt-32 font-mono text-xs text-muted">
      <div className="max-w-5xl mx-auto px-5 flex flex-wrap gap-x-6 gap-y-2 justify-between">
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
    </footer>
  )
}
