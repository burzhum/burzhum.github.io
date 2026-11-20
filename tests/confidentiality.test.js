import * as profile from '../src/data/profile'
import * as experience from '../src/data/experience'
import * as projects from '../src/data/projects'
import * as skills from '../src/data/skills'
import * as incidents from '../src/data/incidents'

const ALL = JSON.stringify({ profile, experience, projects, skills, incidents }).toLowerCase()

const FORBIDDEN = [
  '[redacted]', '[redacted]', '[redacted]', '[redacted]',
  '[redacted]', '[redacted]', '[redacted]', '[redacted]', '[redacted]',
  'password', '[redacted]',
]

test.each(FORBIDDEN)('data never contains %s', (term) => {
  expect(ALL).not.toContain(term)
})

// Whole-repo gate: this repo is PUBLIC, so every tracked text file counts,
// not just src/data. Uses the CI list (no 'password' / '[redacted]': those match
// ordinary code). Files that DEFINE the gate are the only exemptions.
import { execSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

const REPO_TERMS = [
  '[redacted]', '[redacted]', '[redacted]', '[redacted]',
  '[redacted]', '[redacted]', '[redacted]', '[redacted]', '[redacted]',
]
const GATE_FILES = new Set([
  'tests/confidentiality.test.js',
  '.github/workflows/deploy.yml',
  'docs/superpowers/plans/2026-07-12-portfolio-site.md',
  'docs/superpowers/plans/2026-07-25-portfolio-add-skill.md',
  'learnings/2026-07-25-dry-run-prose-skills.md',
])
const BINARY = /\.(png|jpe?g|webp|gif|ico|woff2?|ttf|otf|pdf|zip)$/i

test('no tracked file outside the gate files contains a forbidden term', () => {
  const files = execSync('git ls-files', { encoding: 'utf8' })
    .split('\n').filter((f) => f && !BINARY.test(f) && !GATE_FILES.has(f))
  const hits = []
  for (const f of files) {
    let text
    try { text = readFileSync(f, 'utf8').toLowerCase() } catch { continue }
    for (const t of REPO_TERMS) if (text.includes(t)) hits.push(`${f}: ${t}`)
  }
  expect(hits).toEqual([])
})

test('no commit message contains a forbidden term', () => {
  const log = execSync('git log --format=%B', { encoding: 'utf8' }).toLowerCase()
  expect(REPO_TERMS.filter((t) => log.includes(t))).toEqual([])
})
