import { render, screen } from '@testing-library/react'
import Contact from '../src/components/Contact'

test('contact has email, linkedin, github, request-cv — and no phone', () => {
  render(<Contact />)
  expect(screen.getByRole('link', { name: /request cv/i })).toHaveAttribute('href', expect.stringContaining('mailto:asrul.hasni@gmail.com?subject=CV%20request'))
  expect(screen.getByRole('link', { name: /linkedin/i })).toHaveAttribute('href', 'https://www.linkedin.com/in/asrul-hasni')
  expect(screen.getByRole('link', { name: /github/i })).toHaveAttribute('href', 'https://github.com/burzhum')
  expect(document.body.textContent).not.toMatch(/\+?60\s?-?1[0-9]/)
})
