import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeProvider, useTheme } from '../src/theme/ThemeContext'

function Probe() {
  const { theme, toggle } = useTheme()
  return <button onClick={toggle}>{theme}</button>
}
const wrap = () => render(<ThemeProvider><Probe /></ThemeProvider>)

beforeEach(() => { localStorage.clear(); document.documentElement.dataset.theme = '' })

test('defaults to night', () => {
  wrap()
  expect(screen.getByRole('button')).toHaveTextContent('night')
  expect(document.documentElement.dataset.theme).toBe('night')
})

test('toggle switches to day and persists', () => {
  wrap()
  fireEvent.click(screen.getByRole('button'))
  expect(screen.getByRole('button')).toHaveTextContent('day')
  expect(localStorage.getItem('shift')).toBe('day')
  expect(document.documentElement.dataset.theme).toBe('day')
})

test('restores stored theme', () => {
  localStorage.setItem('shift', 'day')
  wrap()
  expect(screen.getByRole('button')).toHaveTextContent('day')
})
