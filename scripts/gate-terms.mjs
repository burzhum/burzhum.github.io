// Loads the confidentiality gate terms. The list itself is confidential, so it
// is never committed: CI reads the GATE_TERMS secret, local runs read the
// gitignored .gate-terms file. Format, one per line: "<scope> <term>", where
// scope is "all" (whole repo, commit messages, dist) or "data" (src/data only).
// Missing terms FAIL CLOSED: a gate with no list must not pass.
import { existsSync, readFileSync } from 'node:fs'

export function loadGateTerms() {
  let raw = process.env.GATE_TERMS
  if (!raw && existsSync('.gate-terms')) raw = readFileSync('.gate-terms', 'utf8')
  if (!raw || !raw.trim()) {
    throw new Error(
      'Confidentiality gate terms missing: set the GATE_TERMS env/secret or create .gate-terms (ask the owner).',
    )
  }
  const all = []
  const data = []
  for (const line of raw.split(/\r?\n/)) {
    const m = line.match(/^\s*(all|data)\s+(.+?)\s*$/i)
    if (!m) continue
    const term = m[2].toLowerCase()
    if (m[1].toLowerCase() === 'all') all.push(term)
    else data.push(term)
  }
  if (all.length === 0) throw new Error('Confidentiality gate terms file has no "all" terms.')
  return { all, data: [...all, ...data] }
}
