import { render, screen } from '@testing-library/react'
import MatrixRain from '../src/components/MatrixRain'

test('renders decorative canvas: aria-hidden, behind content, pointer-transparent', () => {
  render(<MatrixRain />)
  const canvas = screen.getByTestId('matrix-rain')
  expect(canvas.tagName).toBe('CANVAS')
  expect(canvas).toHaveAttribute('aria-hidden', 'true')
  expect(canvas.className).toMatch(/-z-10/)
  expect(canvas.className).toMatch(/pointer-events-none/)
})
