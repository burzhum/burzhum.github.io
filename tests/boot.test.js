import { shouldBoot, markBooted, BOOT_LINES } from '../src/lib/boot'

test('boots on fresh session', () => {
  const s = new Map()
  const storage = { getItem: k => s.get(k) ?? null, setItem: (k, v) => s.set(k, v) }
  expect(shouldBoot(storage)).toBe(true)
  markBooted(storage)
  expect(shouldBoot(storage)).toBe(false)
})

test('boot lines are mono-safe and non-empty', () => {
  expect(BOOT_LINES.length).toBeGreaterThanOrEqual(6)
  BOOT_LINES.forEach(l => expect(typeof l).toBe('string'))
})
