export default function Marquee({ items }) {
  const strip = items.join(' — ') + ' — '
  return (
    <div className="border-y border-line overflow-hidden whitespace-nowrap py-2" aria-hidden="true">
      <span
        className="marquee-track inline-block font-mono font-bold text-xs tracking-widest uppercase text-accent"
        style={{ textShadow: '0 0 8px var(--accent), 0 0 18px var(--accent)' }}
      >
        {strip.repeat(2)}
      </span>
    </div>
  )
}
