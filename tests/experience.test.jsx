import { render, screen } from '@testing-library/react'
import Experience from '../src/components/Experience'

test('renders all four roles newest first', () => {
  render(<Experience />)
  const companies = screen.getAllByRole('heading', { level: 3 }).map(h => h.textContent)
  expect(companies).toHaveLength(4)
  expect(companies[0]).toMatch(/CET Development/)
  expect(companies[3]).toMatch(/Xybase/)
})
