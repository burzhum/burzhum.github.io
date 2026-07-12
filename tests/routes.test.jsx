import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '../src/App'
import { ThemeProvider } from '../src/theme/ThemeContext'

const at = (path) => render(
  <ThemeProvider><MemoryRouter initialEntries={[path]}><App /></MemoryRouter></ThemeProvider>,
)

test('home renders hero name', () => {
  at('/')
  expect(screen.getAllByText(/asrul/i).length).toBeGreaterThan(0)
})

test('/lab renders lab page', () => {
  at('/lab')
  expect(screen.getByRole('heading', { name: '/lab' })).toBeInTheDocument()
})
