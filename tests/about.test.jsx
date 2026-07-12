import { render, screen } from '@testing-library/react'
import About from '../src/components/About'

test('about renders workflow story and profile facts', () => {
  render(<About />)
  expect(screen.getByText(/how i build/i)).toBeInTheDocument()
  expect(screen.getByText(/putrajaya/i)).toBeInTheDocument()
})
