import { profile } from '../data/profile'
import { skills } from '../data/skills'
import { projects } from '../data/projects'

const NEOFETCH = [
  '        ▄▄▄▄▄▄        asrul@infra',
  '      ▄▓▓▓▓▓▓▓▓▄      ─────────────',
  '     ▐▓▓  ▓▓  ▓▓▌     OS: Human 18.7 LTS',
  '     ▐▓▓▓▓▓▓▓▓▓▓▌     Host: Putrajaya, MY',
  '      ▀▓▓▓▓▓▓▓▓▀      Uptime: 18+ years',
  '     ▄▓▓▓▓▓▓▓▓▓▓▄     Shell: PowerShell + plink',
  '    ▐▓▓▓ ASRUL ▓▓▌    Packages: 13 apps (production)',
  '     ▀▀▀▀▀▀▀▀▀▀▀▀     SLA: 99.90%',
]

const COMMANDS = {
  help: () => [
    'available commands:',
    '  whoami      who is this guy',
    '  projects    what he shipped',
    '  skills      what he wields',
    '  contact     how to reach him',
    '  resume      about the CV',
    '  neofetch    system info',
    '  telnet      play the MUD',
    '  lab         enter the lab',
    '  sudo        try it',
    '  clear       clear screen',
    '  exit        close terminal',
  ],
  whoami: () => [
    'asrul hasni — service delivery manager · infrastructure lead · ai-augmented builder',
    'i keep hospitals online. i ship software with ai.',
  ],
  projects: () => [
    `public: ${projects.publicTrack.map(p => p.name).join(' | ')}`,
    `enterprise: ${projects.enterpriseTrack.length} apps running inside a 1,200-bed government hospital`,
    'scroll to ./projects for the case studies.',
  ],
  skills: () => skills.map(g => `${g.group}: ${g.items.join(', ')}`),
  contact: () => [
    `email:    ${profile.email}`,
    'linkedin: linkedin.com/in/asrul-hasni',
    'github:   github.com/burzhum',
  ],
  resume: () => [
    'the site carries the full CV substance.',
    'want the paper? hit REQUEST CV in ./contact — it opens a pre-filled email.',
    'interested parties do the work. already done mine.',
  ],
  neofetch: () => NEOFETCH,
  telnet: () => [
    'connecting to alternate reality...',
    '  telnet 103.233.0.154 4000',
    'a MUD from 1998, revived and running. bring friends: github.com/burzhum/grotto-client',
  ],
  sudo: () => [
    'nice try. an incident report has been filed.',
    'RCA: user attempted privilege escalation. root cause: curiosity. corrective action: none — keep exploring.',
  ],
}

export function runCommand(input) {
  const raw = input.trim().toLowerCase()
  const cmd = raw.split(/\s+/)[0] || ''
  if (cmd === '') return { lines: [] }
  if (cmd === 'clear') return { lines: [], action: 'clear' }
  if (cmd === 'exit') return { lines: ['bye.'], action: 'exit' }
  if (cmd === 'lab') return { lines: ['entering /lab...'], action: 'nav-lab' }
  const fn = COMMANDS[cmd]
  if (!fn) return { lines: [`${cmd}: command not found — try 'help'`] }
  return { lines: fn() }
}
