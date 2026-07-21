// Giant outlined text scrolling horizontally — the LATENT "thought space" ghost band.
// Two copies + translateX(-50%) keyframe = seamless loop (see .marquee-track).
export default function GhostMarquee({ text, duration = 26 }) {
  const strip = `${text} — `
  return (
    <div className="overflow-hidden select-none py-6" aria-hidden="true">
      <div
        className="marquee-track inline-block whitespace-nowrap ghost-outline font-display font-bold uppercase text-[13vw] leading-[0.85]"
        style={{ animationDuration: `${duration}s` }}
      >
        {strip.repeat(4)}
      </div>
    </div>
  )
}
