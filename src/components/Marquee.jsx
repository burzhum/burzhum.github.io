export default function Marquee({ items }) {
  const strip = items.join(' — ') + ' — '
  return (
    <div className="bg-accent text-bg font-mono font-bold text-xs tracking-widest uppercase overflow-hidden whitespace-nowrap py-1.5" aria-hidden="true">
      <span className="marquee-track inline-block">{strip.repeat(2)}</span>
    </div>
  )
}
