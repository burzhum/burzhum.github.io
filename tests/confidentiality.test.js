import * as profile from '../src/data/profile'
import * as experience from '../src/data/experience'
import * as projects from '../src/data/projects'
import * as skills from '../src/data/skills'
import * as incidents from '../src/data/incidents'

const ALL = JSON.stringify({ profile, experience, projects, skills, incidents }).toLowerCase()

const FORBIDDEN = [
  'sungai buloh', 'hsgb', 'kkm-200', '10.37.',
  'shahir', 'muiz', 'afiq', 'aiezzat', 'lukman',
  'password', '+60-12',
]

test.each(FORBIDDEN)('data never contains %s', (term) => {
  expect(ALL).not.toContain(term)
})
