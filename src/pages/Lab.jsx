import { Link } from 'react-router-dom'

export default function Lab() {
  return (
    <div className="min-h-screen grid-bg font-mono p-10">
      <p className="text-accent text-xs tracking-widest">asrul@infra:~/lab$</p>
      <h1 className="font-display font-black uppercase text-4xl mt-4">/lab</h1>
      <p className="text-muted mt-4 max-w-xl text-sm">
        Off-duty experiments: the GrottoMud revival story, homelab notes, scripts that saved a shift.
        Under construction — the good kind, with logs.
      </p>
      <ul className="mt-8 space-y-3 text-sm">
        <li>▸ Reviving a 1998 MUD: 25 bugs in someone else's C, then a 64-bit port</li>
        <li>▸ Self-hosted WhatsApp gateway as an alerting backbone</li>
        <li>▸ PowerShell + plink: running a hospital from a terminal</li>
      </ul>
      <Link to="/" className="inline-block mt-10 text-accent hover:underline text-xs">cd ~ (back home)</Link>
    </div>
  )
}
