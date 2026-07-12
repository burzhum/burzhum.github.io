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
