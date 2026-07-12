import { Resvg } from '@resvg/resvg-js'
import { writeFileSync } from 'node:fs'

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="#0a0e14"/>
  <g stroke="#23d18b" stroke-opacity="0.07">${
    Array.from({ length: 38 }, (_, i) => `<line x1="${i * 32}" y1="0" x2="${i * 32}" y2="630"/>`).join('')
  }${
    Array.from({ length: 20 }, (_, i) => `<line x1="0" y1="${i * 32}" x2="1200" y2="${i * 32}"/>`).join('')
  }</g>
  <text x="80" y="130" font-family="monospace" font-size="26" fill="#23d18b">asrul@infra:~$ whoami</text>
  <text x="76" y="270" font-family="Arial, sans-serif" font-size="88" font-weight="900" fill="#e6edf3">I KEEP HOSPITALS</text>
  <text x="76" y="370" font-family="Arial, sans-serif" font-size="88" font-weight="900" fill="#23d18b">ONLINE_</text>
  <text x="76" y="470" font-family="Arial, sans-serif" font-size="52" font-weight="900" fill="#e6edf3">I SHIP SOFTWARE WITH AI_</text>
  <text x="80" y="560" font-family="monospace" font-size="24" fill="#8b949e">99.90% SLA · RM32M O&amp;M · 12 APPS · 18+ YEARS — burzhum.github.io</text>
</svg>`

writeFileSync('public/og.png', new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng())
console.log('og.png written')
