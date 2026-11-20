// Loads the confidentiality gate terms. The list itself is confidential, so it
// is never committed and never kept inside the repo folder (AI agents working
// here must not be able to read it): CI reads the GATE_TERMS secret, local runs
// read GATE_TERMS_FILE or ~/.portfolio-gate-terms. Format, one per line:
// "<scope> <term>", scope "all" (whole repo, commit messages, dist) or "data"
// (src/data only). Missing terms FAIL CLOSED: a gate with no list must not pass.
// Agents: do not try to locate or open the terms file. If the gate fails, report
// the file it names and let the owner find the word.
import { existsSync, readFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'

export function loadGateTerms() {
  let raw = process.env.GATE_TERMS
  const file = process.env.GATE_TERMS_FILE || join(homedir(), '.portfolio-gate-terms')
  if (!raw && existsSync(file)) raw = readFileSync(file, 'utf8')
  if (!raw || !raw.trim()) {
    throw new Error('Confidentiality gate terms missing (owner-only setup). Ask the owner.')
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
