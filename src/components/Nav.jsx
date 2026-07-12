import ShiftToggle from './ShiftToggle'

export default function Nav() {
  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-bg/85 backdrop-blur-sm border-b border-line">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-5 py-2.5 font-mono text-xs tracking-widest">
        <a href="#hero" className="text-accent">asrul@infra:~$</a>
        <nav className="hidden md:flex gap-5 text-muted">
          {['about', 'experience', 'projects', 'ops', 'skills', 'contact'].map(s => (
            <a key={s} href={`#${s}`} className="hover:text-accent transition-colors">./{s}</a>
          ))}
        </nav>
        <ShiftToggle />
      </div>
    </header>
  )
}
