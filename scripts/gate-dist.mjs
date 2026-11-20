// CI step: scan the built dist/ for confidential terms. Prints file names only,
// never the matched term, so the job log cannot leak the list.
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { loadGateTerms } from './gate-terms.mjs'

const { all } = loadGateTerms()
const hits = []
function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) walk(p)
    else {
      const text = readFileSync(p, 'latin1').toLowerCase()
      if (all.some((t) => text.includes(t))) hits.push(p)
    }
  }
}
walk('dist')
if (hits.length) {
  console.error('::error::Confidential term found in build output:\n' + hits.join('\n'))
  process.exit(1)
}
console.log(`clean (${all.length} terms)`)
