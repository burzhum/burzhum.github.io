import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '../src/App'
import { ThemeProvider } from '../src/theme/ThemeContext'

test('renders name', () => {
  render(
    <ThemeProvider><MemoryRouter><App /></MemoryRouter></ThemeProvider>,
  )
  expect(screen.getAllByText(/asrul hasni/i).length).toBeGreaterThan(0)
})
