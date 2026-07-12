import { runCommand } from '../src/lib/terminal'

test('help lists commands', () => {
  const { lines } = runCommand('help')
  const joined = lines.join('\n')
  ;['whoami', 'projects', 'skills', 'contact', 'resume', 'neofetch', 'sudo', 'telnet', 'exit'].forEach(c =>
    expect(joined).toContain(c))
})

test('whoami is on brand', () => {
  expect(runCommand('whoami').lines.join(' ')).toMatch(/keep hospitals online/i)
})

test('sudo denies with humor', () => {
  expect(runCommand('sudo rm -rf /').lines[0]).toMatch(/incident report/i)
})

test('telnet points at grottomud', () => {
  expect(runCommand('telnet').lines.join(' ')).toContain('103.233.0.154 4000')
})

test('resume explains request flow', () => {
  expect(runCommand('resume').lines.join(' ')).toMatch(/request cv/i)
})

test('unknown command suggests help', () => {
  expect(runCommand('frobnicate').lines[0]).toContain('command not found')
})

test('case insensitive + trims', () => {
  expect(runCommand('  WHOAMI ').lines.length).toBeGreaterThan(0)
})

test('clear and exit return actions', () => {
  expect(runCommand('clear').action).toBe('clear')
  expect(runCommand('exit').action).toBe('exit')
  expect(runCommand('lab').action).toBe('nav-lab')
})
