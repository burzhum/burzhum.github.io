import { render, screen } from '@testing-library/react'
import Hero from '../src/components/Hero'

test('hero renders tagline, role and stat labels', () => {
  render(<Hero />)
  expect(screen.getByText(/i keep hospitals/i)).toBeInTheDocument()
  expect(screen.getByText(/ai-augmented builder/i)).toBeInTheDocument()
  expect(screen.getByText(/sla availability/i)).toBeInTheDocument()
  expect(screen.getByText(/production apps live/i)).toBeInTheDocument()
})
