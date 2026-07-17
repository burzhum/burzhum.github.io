import { render, screen } from '@testing-library/react'
import Projects from '../src/components/Projects'

test('renders both tracks with all cards', () => {
  render(<Projects />)
  expect(screen.getByText(/grottomud/i)).toBeInTheDocument()
  expect(screen.getAllByText(/1,200-bed government hospital/i).length).toBeGreaterThan(0)
  expect(screen.getAllByTestId('project-card')).toHaveLength(13)
})
