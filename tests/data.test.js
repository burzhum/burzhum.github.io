import { profile } from '../src/data/profile'
import { projects } from '../src/data/projects'

test('13 apps total, GODM0D3 excluded', () => {
  expect(projects.publicTrack).toHaveLength(5)
  expect(projects.enterpriseTrack).toHaveLength(8)
  expect(JSON.stringify(projects).toLowerCase()).not.toContain('godm')
})

test('profile has 4 hero stats and no phone', () => {
  expect(profile.stats).toHaveLength(4)
  expect(JSON.stringify(profile)).not.toMatch(/\+?60\s?-?1[0-9]/)
})
