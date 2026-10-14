import { render, screen, act } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Terminal from '../src/components/Terminal'

// Lenis smooth-scroll swallows wheel events at window level; without this
// attribute the terminal's long output (e.g. `help`) cannot be scrolled.
test('terminal panel opts out of Lenis so its output can scroll', () => {
  render(<MemoryRouter><Terminal /></MemoryRouter>)
  act(() => { window.dispatchEvent(new Event('open-terminal')) })
  expect(screen.getByRole('dialog', { name: 'terminal' })).toHaveAttribute('data-lenis-prevent')
})
