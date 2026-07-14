import { render, screen } from '@testing-library/react'
import Tilt3D from '../src/components/Tilt3D'

// Force prefers-reduced-motion BEFORE first useReducedMotion call in this module registry
window.matchMedia = q => ({
  matches: q.includes('prefers-reduced-motion'),
  media: q,
  addEventListener() {}, removeEventListener() {},
  addListener() {}, removeListener() {},
})

test('reduced motion renders static div — no tilt, no glare', () => {
  render(<Tilt3D testId="tilt-reduced" glare><p>static</p></Tilt3D>)
  const el = screen.getByTestId('tilt-reduced')
  expect(screen.getByText('static')).toBeInTheDocument()
  expect(el.className).not.toMatch(/group\/tilt/)
  expect(el.querySelector('[aria-hidden="true"]')).toBeNull()
  expect(el.style.transform).toBe('')
})
