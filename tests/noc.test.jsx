import { render, screen } from '@testing-library/react'
import Noc from '../src/components/Noc'

test('renders tiles, sample-data badge, and war-story log', () => {
  render(<Noc />)
  expect(screen.getByText(/illustrative sample data/i)).toBeInTheDocument()
  expect(screen.getByText(/ransomware/i)).toBeInTheDocument()
  expect(screen.getByText(/11\.5h/i)).toBeInTheDocument()
})
