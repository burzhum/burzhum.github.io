// Confidentiality gate. The term list is NOT in this public repo: it comes from
// the GATE_TERMS secret (CI) or the gitignored .gate-terms file (local), see
// scripts/gate-terms.mjs. Failure messages name files only, never the term.
import { execSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import * as profile from '../src/data/profile'
import * as experience from '../src/data/experience'
import * as projects from '../src/data/projects'
import * as skills from '../src/data/skills'
import * as incidents from '../src/data/incidents'
import { loadGateTerms } from '../scripts/gate-terms.mjs'

const terms = loadGateTerms()
const BINARY = /\.(png|jpe?g|webp|gif|ico|woff2?|ttf|otf|pdf|zip)$/i

test('card data contains no confidential term', () => {
  const ALL = JSON.stringify({ profile, experience, projects, skills, incidents }).toLowerCase()
  const n = terms.data.filter((t) => ALL.includes(t)).length
  expect(n, 'src/data contains a confidential term').toBe(0)
})

test('no tracked text file contains a confidential term', () => {
  const files = execSync('git ls-files', { encoding: 'utf8' })
    .split('\n').filter((f) => f && !BINARY.test(f))
  const hits = []
  for (const f of files) {
    let text
    try { text = readFileSync(f, 'utf8').toLowerCase() } catch { continue }
    if (terms.all.some((t) => text.includes(t))) hits.push(f)
  }
  expect(hits).toEqual([])
})

test('no commit message contains a confidential term', () => {
  const log = execSync('git log --format=%B', { encoding: 'utf8' }).toLowerCase()
  const n = terms.all.filter((t) => log.includes(t)).length
  expect(n, 'a commit message contains a confidential term').toBe(0)
})
