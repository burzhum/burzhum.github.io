# Terminal Editorial Portfolio — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and deploy Asrul's animated "Terminal Editorial" portfolio SPA to https://burzhum.github.io.

**Architecture:** React SPA (Vite) with a CSS-variable theme system (`night`/`day` on `<html data-theme>`), section components composed on one scroll page plus a hidden `/lab` route. All animation through Framer Motion honoring `prefers-reduced-motion`. Pure-function cores (terminal parser, boot gate, count-up) are unit-tested; visual sections get render smoke tests + dev-server QA. Deployed by GitHub Actions to GitHub Pages with an automated confidentiality scan on the built output.

**Tech Stack:** React 18, Vite 5, Tailwind CSS 3.4, Framer Motion 11, React Router 6, Vitest + @testing-library/react, GitHub Actions → Pages.

## Global Constraints

- Project root: `C:\Users\HP\Documents\Projects\portfolio` (repo `burzhum/burzhum.github.io`, public). All paths below relative to root. Shell: PowerShell.
- Spec: `docs/superpowers/specs/2026-07-12-portfolio-design.md`. On any conflict, spec wins.
- CONFIDENTIALITY (hard): never in source or built output: `Sungai Buloh`, `HSGB`, `KKM-200`, `10.37.`, colleague names (`Shahir`, `Muiz`, `Afiq`, `Aiezzat`, `Lukman`), any credential. Client is only ever "a 900-bed government hospital". GrottoMud public address `103.233.0.154:4000` / `hiddengrotto.org` IS allowed (published).
- No phone number anywhere. Contact = email + LinkedIn + GitHub + Request-CV mailto only.
- GODM0D3 excluded. App count is exactly 12 (9 enterprise + 3 Grotto).
- Theme tokens (exact): night `bg #0a0e14, ink #e6edf3, muted #8b949e, accent #23d18b, accent2 #39c5cf, card #11161f, line #30363d`; day `bg #f4f1ea, ink #1a1a1a, muted #787878, accent #ff4d00, accent2 #b33900, card #fffdf7, line #1a1a1a`. Toggle labels `day_shift` / `night_shift`, persisted to `localStorage.shift`, default night.
- Fonts: Archivo (display, weights 500–900) + JetBrains Mono, self-hosted via @fontsource. No external font CDNs.
- Animations: transform/opacity only (GPU-cheap). Every animated component must render a static-final-state variant when `useReducedMotion()` is true.
- Copy voice: first person, confident, terse. Headline copy is UPPERCASE in CSS, not in source strings.
- Commit after every task (messages given per task). Never commit `node_modules`, `dist`.

---

### Task 1: Scaffold, tooling, theme tokens

**Files:**
- Create: `package.json`, `vite.config.js`, `tailwind.config.js`, `postcss.config.js`, `index.html`, `src/main.jsx`, `src/App.jsx`, `src/index.css`, `src/test/setup.js`, `tests/smoke.test.jsx`

**Interfaces:**
- Produces: Tailwind classes `bg-bg text-ink text-muted text-accent bg-card border-line font-display font-mono`, helper class `grid-bg`, npm scripts `dev`, `build`, `test`, `preview`.

- [ ] **Step 1: Scaffold Vite project in place**

```powershell
cd C:\Users\HP\Documents\Projects\portfolio
npm create vite@latest . -- --template react
npm install
npm install framer-motion react-router-dom @fontsource/archivo @fontsource/jetbrains-mono
npm install -D tailwindcss@3.4 postcss autoprefixer vitest @testing-library/react @testing-library/jest-dom jsdom
npx tailwindcss init -p
```
Note: `npm create vite .` may warn about existing files (`docs/`, `.git`) — choose "Ignore files and continue".

- [ ] **Step 2: Configure Vite + Vitest**

`vite.config.js` (replace):
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
  },
})
```

`src/test/setup.js`:
```js
import '@testing-library/jest-dom'

// framer-motion + jsdom shims
window.matchMedia = window.matchMedia || function () {
  return { matches: false, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} }
}
window.IntersectionObserver = window.IntersectionObserver || class {
  observe() {} unobserve() {} disconnect() {}
}
window.scrollTo = window.scrollTo || function () {}
```

Add to `package.json` scripts: `"test": "vitest run", "test:watch": "vitest"`.

- [ ] **Step 3: Tailwind theme mapping**

`tailwind.config.js` (replace):
```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)', ink: 'var(--ink)', muted: 'var(--muted)',
        accent: 'var(--accent)', accent2: 'var(--accent2)',
        card: 'var(--card)', line: 'var(--line)',
      },
      fontFamily: {
        display: ['Archivo', 'ui-sans-serif', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
}
```

- [ ] **Step 4: Base CSS with theme variables**

`src/index.css` (replace):
```css
@import '@fontsource/archivo/500.css';
@import '@fontsource/archivo/700.css';
@import '@fontsource/archivo/900.css';
@import '@fontsource/jetbrains-mono/400.css';
@import '@fontsource/jetbrains-mono/700.css';

@tailwind base;
@tailwind components;
@tailwind utilities;

:root, :root[data-theme='night'] {
  --bg: #0a0e14; --ink: #e6edf3; --muted: #8b949e;
  --accent: #23d18b; --accent2: #39c5cf;
  --card: #11161f; --line: #30363d;
  --grid: rgba(35, 209, 139, 0.05);
}
:root[data-theme='day'] {
  --bg: #f4f1ea; --ink: #1a1a1a; --muted: #787878;
  --accent: #ff4d00; --accent2: #b33900;
  --card: #fffdf7; --line: #1a1a1a;
  --grid: rgba(26, 26, 26, 0.05);
}

html { scroll-behavior: smooth; }
body { @apply bg-bg text-ink font-display antialiased; transition: background-color .4s, color .4s; }

.grid-bg {
  background-image: linear-gradient(var(--grid) 1px, transparent 1px),
    linear-gradient(90deg, var(--grid) 1px, transparent 1px);
  background-size: 32px 32px;
}

@keyframes blink { 50% { opacity: 0; } }
.cursor-blink { animation: blink 1s steps(1) infinite; }

@keyframes marquee { to { transform: translateX(-50%); } }
.marquee-track { animation: marquee 18s linear infinite; }

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  .cursor-blink, .marquee-track { animation: none; }
}
```

- [ ] **Step 5: Minimal App + smoke test (write test first)**

`tests/smoke.test.jsx`:
```jsx
import { render, screen } from '@testing-library/react'
import App from '../src/App'

test('renders name', () => {
  render(<App />)
  expect(screen.getByText(/asrul hasni/i)).toBeInTheDocument()
})
```

Run: `npm test` → Expected: FAIL (App renders Vite boilerplate).

`src/App.jsx` (replace):
```jsx
export default function App() {
  return (
    <main className="min-h-screen grid-bg">
      <h1 className="font-display font-black uppercase text-4xl p-10">Asrul Hasni</h1>
    </main>
  )
}
```

`src/main.jsx` (replace):
```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode><App /></React.StrictMode>,
)
```

Delete `src/App.css` and `src/assets/react.svg` boilerplate references.

- [ ] **Step 6: Verify**

Run: `npm test` → Expected: PASS. Run: `npm run build` → Expected: builds clean. Run `npm run dev`, load http://localhost:5173 → dark page, grid visible, Archivo headline.

- [ ] **Step 7: Commit**

```powershell
git add -A; git commit -m "feat: scaffold Vite+React+Tailwind with Terminal Editorial theme tokens"
```

---

### Task 2: Theme system (day_shift / night_shift)

**Files:**
- Create: `src/theme/ThemeContext.jsx`, `src/components/ShiftToggle.jsx`, `tests/theme.test.jsx`
- Modify: `src/main.jsx`, `src/App.jsx`

**Interfaces:**
- Produces: `ThemeProvider` (wraps app), hook `useTheme() → { theme: 'night'|'day', toggle() }`; `<ShiftToggle />` button component. Theme applied as `document.documentElement.dataset.theme`, persisted to `localStorage.shift`.

- [ ] **Step 1: Write failing tests**

`tests/theme.test.jsx`:
```jsx
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
```

Run: `npm test` → Expected: FAIL (module not found).

- [ ] **Step 2: Implement**

`src/theme/ThemeContext.jsx`:
```jsx
import { createContext, useContext, useEffect, useState } from 'react'

const ThemeCtx = createContext(null)

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('shift') === 'day' ? 'day' : 'night')

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('shift', theme)
  }, [theme])

  const toggle = () => setTheme(t => (t === 'night' ? 'day' : 'night'))
  return <ThemeCtx.Provider value={{ theme, toggle }}>{children}</ThemeCtx.Provider>
}

export const useTheme = () => useContext(ThemeCtx)
```

`src/components/ShiftToggle.jsx`:
```jsx
import { useTheme } from '../theme/ThemeContext'

export default function ShiftToggle() {
  const { theme, toggle } = useTheme()
  const next = theme === 'night' ? 'day_shift' : 'night_shift'
  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${next}`}
      className="font-mono text-xs tracking-widest border border-line px-3 py-1.5 hover:text-accent hover:border-accent transition-colors"
    >
      {theme === 'night' ? '☾ night_shift' : '☀ day_shift'}
    </button>
  )
}
```

Wrap app in `src/main.jsx`:
```jsx
import { ThemeProvider } from './theme/ThemeContext'
// ...
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode><ThemeProvider><App /></ThemeProvider></React.StrictMode>,
)
```
Add `<ShiftToggle />` temporarily to App header area.

- [ ] **Step 3: Verify + commit**

Run: `npm test` → PASS. Dev server: clicking toggle flips palette live, survives reload.

```powershell
git add -A; git commit -m "feat: day_shift/night_shift theme system with persistence"
```

---

### Task 3: Data layer + confidentiality guard

**Files:**
- Create: `src/data/profile.js`, `src/data/experience.js`, `src/data/projects.js`, `src/data/skills.js`, `src/data/incidents.js`, `tests/confidentiality.test.js`, `tests/data.test.js`

**Interfaces:**
- Produces (exact shapes consumed by Tasks 6–12):
  - `profile`: `{ name, tagline: string[], role, location, email, linkedin, github, stats: [{value:number, prefix?, suffix?, label}] }`
  - `experience`: `[{ years, company, title, points: string[] }]` (newest first)
  - `projects`: `{ publicTrack: [{name, tag, desc, stack: string[], links: [{label, href}]}], enterpriseTrack: [{name, problem, solution, stack: string[], impact}] }`
  - `skills`: `[{ group, items: string[] }]`
  - `incidents`: `[{ ts, level: 'CRIT'|'WARN'|'OK', text }]`

- [ ] **Step 1: Write failing tests**

`tests/confidentiality.test.js`:
```js
import * as profile from '../src/data/profile'
import * as experience from '../src/data/experience'
import * as projects from '../src/data/projects'
import * as skills from '../src/data/skills'
import * as incidents from '../src/data/incidents'

const ALL = JSON.stringify({ profile, experience, projects, skills, incidents }).toLowerCase()

const FORBIDDEN = [
  'sungai buloh', 'hsgb', 'kkm-200', '10.37.',
  'shahir', 'muiz', 'afiq', 'aiezzat', 'lukman',
  'password', '+60-12',
]

test.each(FORBIDDEN)('data never contains %s', (term) => {
  expect(ALL).not.toContain(term)
})
```

`tests/data.test.js`:
```js
import { profile } from '../src/data/profile'
import { projects } from '../src/data/projects'

test('12 apps total, GODM0D3 excluded', () => {
  expect(projects.publicTrack).toHaveLength(3)
  expect(projects.enterpriseTrack).toHaveLength(9)
  expect(JSON.stringify(projects).toLowerCase()).not.toContain('godm')
})

test('profile has 4 hero stats and no phone', () => {
  expect(profile.stats).toHaveLength(4)
  expect(JSON.stringify(profile)).not.toMatch(/\+?60\s?-?1[0-9]/)
})
```

Run: `npm test` → FAIL (modules missing).

- [ ] **Step 2: Write the data (final copy, verbatim)**

`src/data/profile.js`:
```js
export const profile = {
  name: 'Asrul Hasni',
  role: 'Service Delivery Manager · Infrastructure Lead · AI-Augmented Builder',
  tagline: ['I keep hospitals', 'online_', 'I ship software', 'with AI_'],
  summary:
    '18+ years of enterprise infrastructure. Today I run service delivery for a 900-bed government hospital — and ship production software by directing AI agents. Architecture, operations, deployment and verification are mine; the code is a conversation.',
  location: 'Putrajaya, Malaysia',
  email: 'asrul.hasni@gmail.com',
  linkedin: 'https://www.linkedin.com/in/asrul-hasni',
  github: 'https://github.com/burzhum',
  stats: [
    { value: 99.9, suffix: '%', label: 'SLA availability', decimals: 1 },
    { value: 32, prefix: 'RM', suffix: 'M', label: 'O&M contract managed' },
    { value: 12, label: 'production apps live' },
    { value: 18, suffix: '+', label: 'years in the trade' },
  ],
}
```

`src/data/experience.js`:
```js
export const experience = [
  {
    years: '2025 — now',
    company: 'CET Development · 900-bed government hospital',
    title: 'Lead, Network & Server Engineering — de-facto Service Delivery Manager',
    points: [
      'RM32.2M government O&M contract; accountable for 99.90% availability with a 9-hour annual unplanned-downtime cap.',
      'Lead a 4-person specialist team; primary service-delivery contact up to ministry level.',
      '15+ categories of monthly service reports: network, performance, security posture, incidents.',
      'Backup estate at RTO < 4h / RPO < 24h across 18+ TB of tiered storage.',
    ],
  },
  {
    years: '2010 — 2023',
    company: 'POS Digicert',
    title: 'IT Infrastructure / Service Delivery Engineer',
    points: [
      'Managed infrastructure for enterprise clients across production and DR for 13 years.',
      'Data-center upgrade programmes cut scheduled maintenance downtime by 40%.',
      'VMware platform migration completed with zero production downtime.',
    ],
  },
  {
    years: '2008 — 2010',
    company: 'Hewlett-Packard (M)',
    title: 'Technical Support Engineer (L2)',
    points: ['L2 enterprise support for EMEA/APAC across HP-UX, AIX, RHEL and Windows under strict SLAs.'],
  },
  {
    years: '2006 — 2008',
    company: 'Xybase',
    title: 'Technical Support Engineer',
    points: ['Kept airport information systems alive in a 24/7 critical-operations environment.'],
  },
]
```

`src/data/projects.js`:
```js
export const projects = {
  publicTrack: [
    {
      name: 'GrottoMud — “Alternate Reality”',
      tag: 'LIVE · C · 64-BIT PORT',
      desc: 'The MUD I played in 1998, dead for two decades — revived. ~25 legacy bugs fixed in the C codebase, then a full 32→64-bit modernization with byte-identical world-file decoding. Running on a public VPS.',
      stack: ['C', 'CircleMUD', 'systemd hardening', 'gdb'],
      links: [
        { label: 'play: telnet 103.233.0.154 4000', href: 'telnet://103.233.0.154:4000' },
        { label: 'hiddengrotto.org', href: 'https://www.hiddengrotto.org' },
      ],
    },
    {
      name: 'Grotto Client',
      tag: 'OPEN SOURCE · ELECTRON',
      desc: 'Cross-platform desktop MUD client so friends can actually play. v0.1.0 shipped with Windows, macOS and Linux installers, CI-built.',
      stack: ['Electron', 'xterm.js', 'esbuild', 'vitest'],
      links: [{ label: 'github.com/burzhum/grotto-client', href: 'https://github.com/burzhum/grotto-client' }],
    },
    {
      name: 'hiddengrotto.org',
      tag: 'LIVE · STATIC',
      desc: 'Marketing and lore site for the game — custom domain, TLS, linked from the in-game MOTD.',
      stack: ['nginx', 'static HTML/CSS'],
      links: [{ label: 'visit site', href: 'https://www.hiddengrotto.org' }],
    },
  ],
  enterpriseTrack: [
    {
      name: 'Device Maintenance Platform',
      problem: 'Preventive maintenance for 1,800+ endpoints tracked in spreadsheets; no proof of work, no schedule discipline.',
      solution: 'Full workflow app: schedules, technician job queues, digital signatures with stamps, bulk PDF reports, WhatsApp digests to leads.',
      stack: ['React', 'Express', 'PostgreSQL'],
      impact: 'Every maintenance visit is now signed, photographed and reportable in one click.',
    },
    {
      name: 'IT Team Task Manager',
      problem: 'A multi-zone technical team ran on chat messages and memory.',
      solution: 'Role- and zone-aware task system with admin oversight, deadlines and daily WhatsApp summaries.',
      stack: ['React', 'Express', 'PostgreSQL'],
      impact: 'Nothing falls through: every task has an owner, a zone and a trail.',
    },
    {
      name: 'IT Knowledge Base + Asset Register',
      problem: 'Years of tribal knowledge locked in a legacy helpdesk and individual heads.',
      solution: '2,400+ entry searchable knowledge base fused with a hardware asset register.',
      stack: ['React', 'Express', 'PostgreSQL', 'pg_trgm'],
      impact: 'New engineers find the fix before they find the person who knew it.',
    },
    {
      name: 'Ops Monitoring + WhatsApp Alerting',
      problem: 'A dozen internal apps, zero unified visibility, alerts nobody saw.',
      solution: 'Central health dashboard plus a self-hosted WhatsApp gateway; every service pings, every failure pages.',
      stack: ['Node', 'NestJS', 'whatsapp-web.js'],
      impact: 'Failures announce themselves — before users do.',
    },
    {
      name: 'Switch Port-Security Clearer',
      problem: 'Port-security lockouts needed a CLI-fluent engineer every single time.',
      solution: 'Web tool that telnets to access switches and clears violations safely, with audit log.',
      stack: ['Node', 'Express', 'SQLite', 'telnet'],
      impact: 'A 15-minute specialist task became a 15-second button.',
    },
    {
      name: 'GPS-Geofenced Attendance',
      problem: 'Field staff attendance was unverifiable.',
      solution: 'Mobile-first check-in gated by GPS geofences per site, with admin dashboards.',
      stack: ['React', 'PocketBase'],
      impact: 'Presence is proven, not claimed.',
    },
    {
      name: 'Quran Reading Tracker',
      problem: 'A khatam programme tracked on paper: no progress view, no accountability.',
      solution: 'Teacher/student app with juz progress rings, audio recitation uploads and review workflow, completion certificates rendered as video.',
      stack: ['React', 'Framer Motion', 'Express', 'PostgreSQL', 'Remotion'],
      impact: 'Teachers review recitations asynchronously; completions celebrate themselves.',
    },
    {
      name: 'Village Community Platform',
      problem: 'A kampung community coordinating across scattered chat groups.',
      solution: 'Multi-tenant community platform: announcements, directories, events.',
      stack: ['Express', 'PostgreSQL'],
      impact: 'One place for the whole village.',
    },
    {
      name: 'Uptime Sentinel',
      problem: 'Even the monitoring needed monitoring.',
      solution: 'Independent watchdog service with public status view and escalation rules.',
      stack: ['Node', 'Express'],
      impact: 'The watcher is watched.',
    },
  ],
}
```

`src/data/skills.js`:
```js
export const skills = [
  { group: 'INFRASTRUCTURE', items: ['VMware ESXi', 'Hyper-V', 'Windows Server', 'RHEL / Linux', 'Active Directory', 'DNS / DHCP'] },
  { group: 'NETWORK', items: ['Cisco Catalyst L2/L3', 'Sangfor NGFW', 'Fortinet', 'VLAN / STP', 'Firewall policy'] },
  { group: 'MONITORING + SECURITY', items: ['PRTG', 'Nagios', 'SolarWinds', 'Wazuh SIEM', 'Endpoint security', 'Incident response'] },
  { group: 'BACKUP + STORAGE', items: ['Veeam', 'HPE SAN', 'Synology NAS', 'Tape', 'RTO/RPO design', 'PACS / DICOM'] },
  { group: 'SERVICE DELIVERY', items: ['SLA/KPI accountability', 'BCP / DR', 'RCA reporting', 'ITIL-aligned ops', 'Stakeholder management'] },
  { group: 'BUILD (AI-DIRECTED)', items: ['React', 'Node / Express', 'PostgreSQL', 'Electron', 'C maintenance', 'CI/CD', 'Claude-driven development'] },
]
```

`src/data/incidents.js`:
```js
export const incidents = [
  { ts: '02:14', level: 'CRIT', text: 'Ransomware on shared drives — source isolated, file screening enforced. Zero server compromise.' },
  { ts: '04:41', level: 'CRIT', text: 'Hospital-wide network outage — BCP activated. HIS, imaging and critical-care systems restored in 11.5h.' },
  { ts: '07:03', level: 'WARN', text: 'Core switch loop detected — contained same-day. BPDU Guard rolled out estate-wide after RCA.' },
  { ts: '09:52', level: 'OK', text: 'Backup cycle complete: 18+ TB tiered, RPO < 24h maintained.' },
  { ts: '11:20', level: 'OK', text: 'Monthly report suite submitted: 15+ categories, on time, every month.' },
  { ts: '13:37', level: 'OK', text: '12 production apps reporting healthy. Uptime 99.90%.' },
]
```

- [ ] **Step 3: Verify + commit**

Run: `npm test` → all PASS (confidentiality + data + earlier suites).

```powershell
git add -A; git commit -m "feat: content data layer with automated confidentiality guard"
```

---

### Task 4: App shell, router, /lab stub, footer, 404 trick

**Files:**
- Create: `src/pages/Home.jsx`, `src/pages/Lab.jsx`, `src/components/Nav.jsx`, `src/components/Footer.jsx`, `public/404.html`, `tests/routes.test.jsx`
- Modify: `src/App.jsx`, `src/main.jsx`, `index.html`

**Interfaces:**
- Consumes: `ShiftToggle`, `profile`.
- Produces: `<Home />` renders section placeholders in order (replaced by Tasks 5–11); routes `/` and `/lab`; `<Nav />` fixed top bar with mono breadcrumbs + ShiftToggle; `<Footer />` with easter-egg hints (`` ctrl+` `` and `/lab`).

- [ ] **Step 1: Failing route tests**

`tests/routes.test.jsx`:
```jsx
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
  expect(screen.getByText(/\/lab/i)).toBeInTheDocument()
})
```

Run: `npm test` → FAIL.

- [ ] **Step 2: Implement shell**

`src/App.jsx` (replace — Router moves OUT of App so tests can use MemoryRouter):
```jsx
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Lab from './pages/Lab'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/lab" element={<Lab />} />
      <Route path="*" element={<Home />} />
    </Routes>
  )
}
```

`src/main.jsx` — wrap with `BrowserRouter`:
```jsx
import { BrowserRouter } from 'react-router-dom'
// render tree: <ThemeProvider><BrowserRouter><App/></BrowserRouter></ThemeProvider>
```

`src/components/Nav.jsx`:
```jsx
import ShiftToggle from './ShiftToggle'

export default function Nav() {
  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-bg/85 backdrop-blur-sm border-b border-line">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-5 py-2.5 font-mono text-xs tracking-widest">
        <span className="text-accent">asrul@infra:~$</span>
        <nav className="hidden sm:flex gap-5 text-muted">
          {['about', 'experience', 'projects', 'ops', 'skills', 'contact'].map(s => (
            <a key={s} href={`#${s}`} className="hover:text-accent transition-colors">./{s}</a>
          ))}
        </nav>
        <ShiftToggle />
      </div>
    </header>
  )
}
```

`src/components/Footer.jsx`:
```jsx
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-line py-8 font-mono text-xs text-muted">
      <div className="max-w-5xl mx-auto px-5 flex flex-wrap gap-x-6 gap-y-2 justify-between">
        <span>© {new Date().getFullYear()} Asrul Hasni — built by directing AI agents.</span>
        <span>
          psst: press <kbd className="border border-line px-1">ctrl+`</kbd> · or wander into{' '}
          <Link to="/lab" className="text-accent hover:underline">/lab</Link>
        </span>
      </div>
    </footer>
  )
}
```

`src/pages/Home.jsx` (placeholders swapped out by later tasks):
```jsx
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import { profile } from '../data/profile'

export default function Home() {
  return (
    <div className="min-h-screen grid-bg">
      <Nav />
      <main className="max-w-5xl mx-auto px-5 pt-24 space-y-32">
        <section id="hero"><h1 className="font-black uppercase text-5xl">{profile.name}</h1></section>
        <section id="about" />
        <section id="experience" />
        <section id="projects" />
        <section id="ops" />
        <section id="skills" />
        <section id="contact" />
      </main>
      <Footer />
    </div>
  )
}
```

`src/pages/Lab.jsx`:
```jsx
import { Link } from 'react-router-dom'

export default function Lab() {
  return (
    <div className="min-h-screen grid-bg font-mono p-10">
      <p className="text-accent text-xs tracking-widest">asrul@infra:~/lab$</p>
      <h1 className="font-display font-black uppercase text-4xl mt-4">/lab</h1>
      <p className="text-muted mt-4 max-w-xl text-sm">
        Off-duty experiments: the GrottoMud revival story, homelab notes, scripts that saved a shift.
        Under construction — the good kind, with logs.
      </p>
      <ul className="mt-8 space-y-3 text-sm">
        <li>▸ Reviving a 1998 MUD: 25 bugs in someone else's C, then a 64-bit port</li>
        <li>▸ Self-hosted WhatsApp gateway as an alerting backbone</li>
        <li>▸ PowerShell + plink: running a hospital from a terminal</li>
      </ul>
      <Link to="/" className="inline-block mt-10 text-accent hover:underline text-xs">cd ~ (back home)</Link>
    </div>
  )
}
```

- [ ] **Step 3: GitHub Pages SPA 404 trick**

`public/404.html` (rafgraph spa-github-pages, `pathSegmentsToKeep = 0` for user site):
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Redirecting…</title>
    <script>
      var pathSegmentsToKeep = 0
      var l = window.location
      l.replace(
        l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') +
        l.pathname.split('/').slice(0, 1 + pathSegmentsToKeep).join('/') +
        '/?/' +
        l.pathname.slice(1).split('/').slice(pathSegmentsToKeep).join('/').replace(/&/g, '~and~') +
        (l.search ? '&' + l.search.slice(1).replace(/&/g, '~and~') : '') +
        l.hash,
      )
    </script>
  </head>
  <body></body>
</html>
```

Add decoder to `index.html` `<head>` BEFORE the module script:
```html
<script>
  ;(function (l) {
    if (l.search[1] === '/') {
      var decoded = l.search.slice(1).split('&').map(function (s) {
        return s.replace(/~and~/g, '&')
      }).join('?')
      window.history.replaceState(null, null, l.pathname.slice(0, -1) + decoded + l.hash)
    }
  })(window.location)
</script>
```

- [ ] **Step 4: Verify + commit**

Run: `npm test` → PASS. Dev: nav anchors scroll, /lab loads, footer hints render.

```powershell
git add -A; git commit -m "feat: app shell, nav/footer, /lab route, Pages SPA 404 redirect"
```

---

### Task 5: Boot preloader

**Files:**
- Create: `src/lib/boot.js`, `src/components/BootLoader.jsx`, `tests/boot.test.js`
- Modify: `src/pages/Home.jsx`

**Interfaces:**
- Produces: `shouldBoot(storage) → boolean` and `markBooted(storage)` (pure, from `src/lib/boot.js`); `<BootLoader onDone={fn} />` full-screen overlay.

- [ ] **Step 1: Failing tests for boot gate**

`tests/boot.test.js`:
```js
import { shouldBoot, markBooted, BOOT_LINES } from '../src/lib/boot'

test('boots on fresh session', () => {
  const s = new Map()
  const storage = { getItem: k => s.get(k) ?? null, setItem: (k, v) => s.set(k, v) }
  expect(shouldBoot(storage)).toBe(true)
  markBooted(storage)
  expect(shouldBoot(storage)).toBe(false)
})

test('boot lines are mono-safe and non-empty', () => {
  expect(BOOT_LINES.length).toBeGreaterThanOrEqual(6)
  BOOT_LINES.forEach(l => expect(typeof l).toBe('string'))
})
```

Run: `npm test` → FAIL.

- [ ] **Step 2: Implement**

`src/lib/boot.js`:
```js
export const BOOT_KEY = 'booted'

export const BOOT_LINES = [
  'ASRUL-BIOS v18.7 — POST',
  'CPU ....................... human, caffeinated',
  'MEM ....................... 18+ years, ECC',
  'SLA target ................ 99.90% [LOCKED]',
  'mounting /career .......... ok',
  'mounting /projects ........ 12 apps found',
  'starting ai-agents.service  [ACTIVE]',
  'boot: OK — welcome.',
]

export const shouldBoot = (storage) => storage.getItem(BOOT_KEY) !== '1'
export const markBooted = (storage) => storage.setItem(BOOT_KEY, '1')
```

`src/components/BootLoader.jsx`:
```jsx
import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { BOOT_LINES, shouldBoot, markBooted } from '../lib/boot'

export default function BootLoader() {
  const reduced = useReducedMotion()
  const [show, setShow] = useState(() => !reduced && shouldBoot(sessionStorage))
  const [count, setCount] = useState(0)

  const finish = () => { markBooted(sessionStorage); setShow(false) }

  useEffect(() => {
    if (!show) return
    if (count >= BOOT_LINES.length) { const t = setTimeout(finish, 450); return () => clearTimeout(t) }
    const t = setTimeout(() => setCount(c => c + 1), 170)
    return () => clearTimeout(t)
  }, [show, count])

  useEffect(() => {
    if (!show) return
    const skip = () => finish()
    window.addEventListener('keydown', skip)
    window.addEventListener('pointerdown', skip)
    return () => { window.removeEventListener('keydown', skip); window.removeEventListener('pointerdown', skip) }
  }, [show])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-bg grid-bg p-8 font-mono text-sm cursor-pointer"
          aria-label="Boot sequence — click to skip"
        >
          {BOOT_LINES.slice(0, count).map((l, i) => (
            <p key={i} className={i === BOOT_LINES.length - 1 ? 'text-accent' : 'text-muted'}>{l}</p>
          ))}
          <span className="inline-block w-2.5 h-4 bg-accent cursor-blink" />
          <p className="absolute bottom-6 right-8 text-xs text-muted">any key / click to skip</p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
```

Mount at top of `Home.jsx`: `<BootLoader />` as first child.

- [ ] **Step 3: Verify + commit**

Run: `npm test` → PASS. Dev: hard-reload in new tab → boot plays once (~1.6s), skippable; reload again → skipped (sessionStorage). DevTools "Emulate prefers-reduced-motion" → no boot at all.

```powershell
git add -A; git commit -m "feat: BIOS-style boot preloader, session-once, skippable, reduced-motion aware"
```

---

### Task 6: Hero section

**Files:**
- Create: `src/components/Hero.jsx`, `src/lib/useCountUp.js`, `src/components/Marquee.jsx`, `tests/hero.test.jsx`
- Modify: `src/pages/Home.jsx`

**Interfaces:**
- Consumes: `profile` (tagline, stats, role).
- Produces: `useCountUp(target, {decimals}) → ref-bound displayed number` hook (reused by Task 10); `<Marquee items={string[]} />` (reused nowhere else but standalone).

- [ ] **Step 1: Failing render test**

`tests/hero.test.jsx`:
```jsx
import { render, screen } from '@testing-library/react'
import Hero from '../src/components/Hero'

test('hero renders tagline, role and 4 stat labels', () => {
  render(<Hero />)
  expect(screen.getByText(/i keep hospitals/i)).toBeInTheDocument()
  expect(screen.getByText(/ai-augmented builder/i)).toBeInTheDocument()
  expect(screen.getByText(/sla availability/i)).toBeInTheDocument()
  expect(screen.getByText(/production apps live/i)).toBeInTheDocument()
})
```

Run: `npm test` → FAIL.

- [ ] **Step 2: Implement count-up hook**

`src/lib/useCountUp.js`:
```js
import { useEffect, useRef } from 'react'
import { animate, useInView, useReducedMotion } from 'framer-motion'

export function useCountUp(target, { decimals = 0, duration = 1.6 } = {}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const reduced = useReducedMotion()

  useEffect(() => {
    if (!ref.current) return
    if (reduced || !inView) {
      if (reduced) ref.current.textContent = target.toFixed(decimals)
      return
    }
    const controls = animate(0, target, {
      duration,
      ease: 'easeOut',
      onUpdate: v => { if (ref.current) ref.current.textContent = v.toFixed(decimals) },
    })
    return () => controls.stop()
  }, [inView, reduced, target, decimals, duration])

  return ref
}
```

- [ ] **Step 3: Implement Marquee + Hero**

`src/components/Marquee.jsx`:
```jsx
export default function Marquee({ items }) {
  const strip = items.join(' — ') + ' — '
  return (
    <div className="bg-accent text-bg font-mono font-bold text-xs tracking-widest uppercase overflow-hidden whitespace-nowrap py-1.5 -mx-5" aria-hidden="true">
      <span className="marquee-track inline-block">{strip.repeat(2)}</span>
    </div>
  )
}
```

`src/components/Hero.jsx`:
```jsx
import { motion, useReducedMotion } from 'framer-motion'
import { profile } from '../data/profile'
import { useCountUp } from '../lib/useCountUp'
import Marquee from './Marquee'

function Stat({ s }) {
  const ref = useCountUp(s.value, { decimals: s.decimals ?? 0 })
  return (
    <div>
      <div className="font-black text-3xl md:text-4xl">
        {s.prefix}<span ref={ref}>0</span><span className="text-accent">{s.suffix}</span>
      </div>
      <div className="font-mono text-[10px] tracking-[0.2em] text-muted uppercase mt-1">{s.label}</div>
    </div>
  )
}

const line = {
  hidden: { y: '110%' },
  show: i => ({ y: 0, transition: { delay: 0.15 + i * 0.12, duration: 0.55, ease: [0.22, 1, 0.36, 1] } }),
}

export default function Hero() {
  const reduced = useReducedMotion()
  return (
    <section id="hero" className="pt-10">
      <p className="font-mono text-xs text-muted">
        $ whoami<span className="inline-block w-2 h-3.5 bg-accent ml-1.5 cursor-blink align-middle" />
      </p>
      <h1 className="font-black uppercase leading-[0.95] tracking-tight text-5xl md:text-7xl mt-5" aria-label="I keep hospitals online. I ship software with AI.">
        {profile.tagline.map((t, i) => (
          <span key={t} className="block overflow-hidden">
            <motion.span
              className={`block ${i % 2 === 1 ? 'text-accent' : ''}`}
              variants={line} custom={i}
              initial={reduced ? false : 'hidden'} animate="show"
            >
              {t}
            </motion.span>
          </span>
        ))}
      </h1>
      <p className="font-mono text-xs tracking-widest text-accent2 uppercase mt-6">{profile.role}</p>
      <p className="text-muted max-w-xl mt-4 text-sm leading-relaxed">{profile.summary}</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12">
        {profile.stats.map(s => <Stat key={s.label} s={s} />)}
      </div>
      <div className="mt-14">
        <Marquee items={['Infrastructure', 'Incident Command', 'AI-Augmented Engineering', 'Service Delivery', 'VMware', 'Cisco', 'Veeam', 'React', 'Node', 'PostgreSQL']} />
      </div>
    </section>
  )
}
```

Replace hero placeholder in `Home.jsx` with `<Hero />`.

- [ ] **Step 4: Verify + commit**

Run: `npm test` → PASS. Dev: lines slide up staggered, counters roll on scroll-into-view, marquee loops seamlessly; reduced-motion → static.

```powershell
git add -A; git commit -m "feat: hero — kinetic headline, count-up stats, marquee"
```

---

### Task 7: About section

**Files:**
- Create: `src/components/About.jsx`, `src/components/Section.jsx`, `tests/about.test.jsx`
- Modify: `src/pages/Home.jsx`

**Interfaces:**
- Produces: `<Section id title>` shared wrapper (mono `## title` heading + whileInView fade-rise) — reused by Tasks 8–11.
- Consumes: `profile`. Headshot: if `src/assets/headshot.jpg` exists it renders; otherwise ASCII-frame fallback (user supplies photo later, zero code change).

- [ ] **Step 1: Failing test**

`tests/about.test.jsx`:
```jsx
import { render, screen } from '@testing-library/react'
import About from '../src/components/About'

test('about renders workflow story and profile facts', () => {
  render(<About />)
  expect(screen.getByText(/how i build/i)).toBeInTheDocument()
  expect(screen.getByText(/putrajaya/i)).toBeInTheDocument()
})
```

Run: `npm test` → FAIL.

- [ ] **Step 2: Implement**

`src/components/Section.jsx`:
```jsx
import { motion, useReducedMotion } from 'framer-motion'

export default function Section({ id, title, children }) {
  const reduced = useReducedMotion()
  return (
    <motion.section
      id={id}
      initial={reduced ? false : { opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <h2 className="font-mono text-xs tracking-[0.3em] text-accent uppercase mb-8">
        <span className="text-muted">##</span> {title}
      </h2>
      {children}
    </motion.section>
  )
}
```

`src/components/About.jsx`:
```jsx
import Section from './Section'
import { profile } from '../data/profile'

const headshots = import.meta.glob('../assets/headshot.jpg', { eager: true, import: 'default' })
const headshot = Object.values(headshots)[0]

const FACTS = [
  ['ROLE', 'Service Delivery Manager / Infra Lead'],
  ['LOCATION', profile.location],
  ['INDUSTRY', 'Healthcare · Enterprise IT'],
  ['UPTIME', '18+ years and counting'],
]

const WORKFLOW = [
  ['01 ARCHITECT', 'I define the system: data model, boundaries, failure modes, deploy target.'],
  ['02 DIRECT', 'AI agents write the code under instruction. I interrogate every decision that matters.'],
  ['03 VERIFY', 'Nothing ships on faith — endpoints curled, roles tested, evidence in the report.'],
  ['04 OPERATE', 'I run what I ship: monitoring, backups, alerting, incident response. Production is the exam.'],
]

export default function About() {
  return (
    <Section id="about" title="about">
      <div className="grid md:grid-cols-[180px_1fr] gap-10">
        <div className="border border-line bg-card aspect-square flex items-center justify-center overflow-hidden">
          {headshot
            ? <img src={headshot} alt="Asrul Hasni" className="w-full h-full object-cover" />
            : <pre className="font-mono text-accent text-[9px] leading-tight" aria-label="portrait placeholder">{`
 ┌────────────┐
 │  ▒▒▒▒▒▒▒▒  │
 │  ▒ o  o ▒  │
 │  ▒  __  ▒  │
 │   ▒▒▒▒▒▒   │
 │  [ASRUL]   │
 └────────────┘`}</pre>}
        </div>
        <div>
          <dl className="grid grid-cols-2 gap-x-8 gap-y-4">
            {FACTS.map(([k, v]) => (
              <div key={k}>
                <dt className="font-mono text-[10px] tracking-[0.25em] text-muted">{k}</dt>
                <dd className="text-sm mt-1">{v}</dd>
              </div>
            ))}
          </dl>
          <h3 className="font-black uppercase text-xl mt-10 mb-4">How I build<span className="text-accent">_</span></h3>
          <ol className="space-y-3">
            {WORKFLOW.map(([k, v]) => (
              <li key={k} className="grid md:grid-cols-[130px_1fr] gap-2 text-sm">
                <span className="font-mono text-accent text-xs tracking-widest">{k}</span>
                <span className="text-muted">{v}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Section>
  )
}
```

Replace about placeholder in `Home.jsx` with `<About />`.

- [ ] **Step 3: Verify + commit**

Run: `npm test` → PASS. Dev: section fades in on scroll; ASCII placeholder shows (until photo dropped at `src/assets/headshot.jpg`).

```powershell
git add -A; git commit -m "feat: about — profile facts, AI-directed workflow story, headshot slot"
```

---

### Task 8: Experience timeline

**Files:**
- Create: `src/components/Experience.jsx`, `tests/experience.test.jsx`
- Modify: `src/pages/Home.jsx`

**Interfaces:**
- Consumes: `experience`, `Section`.

- [ ] **Step 1: Failing test**

`tests/experience.test.jsx`:
```jsx
import { render, screen } from '@testing-library/react'
import Experience from '../src/components/Experience'

test('renders all four roles newest first', () => {
  render(<Experience />)
  const companies = screen.getAllByRole('heading', { level: 3 }).map(h => h.textContent)
  expect(companies).toHaveLength(4)
  expect(companies[0]).toMatch(/CET Development/)
  expect(companies[3]).toMatch(/Xybase/)
})
```

Run: `npm test` → FAIL.

- [ ] **Step 2: Implement**

`src/components/Experience.jsx`:
```jsx
import { motion, useReducedMotion } from 'framer-motion'
import Section from './Section'
import { experience } from '../data/experience'

export default function Experience() {
  const reduced = useReducedMotion()
  return (
    <Section id="experience" title="experience — uptime log">
      <div className="relative pl-6 md:pl-8">
        <motion.div
          className="absolute left-0 top-1 bottom-1 w-px bg-accent origin-top"
          initial={reduced ? false : { scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
        <ol className="space-y-12">
          {experience.map((job, i) => (
            <motion.li
              key={job.company}
              initial={reduced ? false : { opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="relative"
            >
              <span className="absolute -left-6 md:-left-8 top-1.5 w-2.5 h-2.5 bg-accent -translate-x-1/2" style={{ left: '-1.5rem' }} aria-hidden="true" />
              <p className="font-mono text-xs text-accent tracking-widest">{job.years}</p>
              <h3 className="font-black uppercase text-lg mt-1">{job.company}</h3>
              <p className="font-mono text-xs text-accent2 mt-0.5">{job.title}</p>
              <ul className="mt-3 space-y-1.5">
                {job.points.map(p => (
                  <li key={p} className="text-sm text-muted leading-relaxed before:content-['▸'] before:text-accent before:mr-2">{p}</li>
                ))}
              </ul>
            </motion.li>
          ))}
        </ol>
      </div>
    </Section>
  )
}
```

Replace placeholder in `Home.jsx` with `<Experience />`.

- [ ] **Step 3: Verify + commit**

Run: `npm test` → PASS. Dev: green line draws down as you scroll, entries slide in.

```powershell
git add -A; git commit -m "feat: experience timeline with scroll-draw line"
```

---

### Task 9: Projects section (two tracks)

**Files:**
- Create: `src/components/Projects.jsx`, `tests/projects.test.jsx`
- Modify: `src/pages/Home.jsx`

**Interfaces:**
- Consumes: `projects`, `Section`.

- [ ] **Step 1: Failing test**

`tests/projects.test.jsx`:
```jsx
import { render, screen } from '@testing-library/react'
import Projects from '../src/components/Projects'

test('renders both tracks with all cards', () => {
  render(<Projects />)
  expect(screen.getByText(/grottomud/i)).toBeInTheDocument()
  expect(screen.getByText(/900-bed government hospital/i)).toBeInTheDocument()
  expect(screen.getAllByTestId('project-card')).toHaveLength(12)
})
```

Run: `npm test` → FAIL.

- [ ] **Step 2: Implement**

`src/components/Projects.jsx`:
```jsx
import { motion, useReducedMotion } from 'framer-motion'
import Section from './Section'
import { projects } from '../data/projects'

const card = (reduced, i) => ({
  initial: reduced ? false : { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-30px' },
  transition: { delay: (i % 3) * 0.07, duration: 0.45 },
})

function PublicCard({ p, i, reduced }) {
  return (
    <motion.article {...card(reduced, i)} data-testid="project-card"
      className="border border-line bg-card p-5 hover:border-accent transition-colors group">
      <p className="font-mono text-[10px] tracking-[0.25em] text-accent">{p.tag}</p>
      <h4 className="font-black uppercase text-lg mt-2 group-hover:text-accent transition-colors">{p.name}</h4>
      <p className="text-sm text-muted mt-2 leading-relaxed">{p.desc}</p>
      <p className="font-mono text-[10px] text-accent2 mt-3">{p.stack.join(' · ')}</p>
      <div className="mt-4 flex flex-col gap-1">
        {p.links.map(l => (
          <a key={l.href} href={l.href} target="_blank" rel="noreferrer"
             className="font-mono text-xs text-accent hover:underline">↗ {l.label}</a>
        ))}
      </div>
    </motion.article>
  )
}

function EnterpriseCard({ p, i, reduced }) {
  return (
    <motion.article {...card(reduced, i)} data-testid="project-card"
      className="border border-line bg-card p-5 hover:border-accent transition-colors">
      <h4 className="font-black uppercase text-base">{p.name}</h4>
      {[['PROBLEM', p.problem], ['SOLUTION', p.solution], ['IMPACT', p.impact]].map(([k, v]) => (
        <p key={k} className="text-xs text-muted mt-2 leading-relaxed">
          <span className="font-mono text-[10px] tracking-[0.2em] text-accent mr-2">{k}</span>{v}
        </p>
      ))}
      <p className="font-mono text-[10px] text-accent2 mt-3">{p.stack.join(' · ')}</p>
    </motion.article>
  )
}

export default function Projects() {
  const reduced = useReducedMotion()
  return (
    <Section id="projects" title="projects — 12 in production">
      <h3 className="font-mono text-xs tracking-widest text-muted mb-5">TRACK A · PUBLIC — go see for yourself</h3>
      <div className="grid md:grid-cols-3 gap-4">
        {projects.publicTrack.map((p, i) => <PublicCard key={p.name} p={p} i={i} reduced={reduced} />)}
      </div>
      <h3 className="font-mono text-xs tracking-widest text-muted mt-12 mb-2">TRACK B · ENTERPRISE — built for a 900-bed government hospital</h3>
      <p className="text-xs text-muted mb-5 font-mono">details anonymized — these run on a private network, doing real work every day</p>
      <div className="grid md:grid-cols-3 gap-4">
        {projects.enterpriseTrack.map((p, i) => <EnterpriseCard key={p.name} p={p} i={i} reduced={reduced} />)}
      </div>
    </Section>
  )
}
```

Replace placeholder in `Home.jsx` with `<Projects />`.

- [ ] **Step 3: Verify + commit**

Run: `npm test` → PASS. Dev: cards stagger in per row; public links work (grotto-client repo, hiddengrotto.org).

```powershell
git add -A; git commit -m "feat: projects — public track with live links, anonymized enterprise case studies"
```

---

### Task 10: NOC dashboard section

**Files:**
- Create: `src/components/Noc.jsx`, `tests/noc.test.jsx`
- Modify: `src/pages/Home.jsx`

**Interfaces:**
- Consumes: `incidents`, `Section`, `useCountUp`.

- [ ] **Step 1: Failing test**

`tests/noc.test.jsx`:
```jsx
import { render, screen } from '@testing-library/react'
import Noc from '../src/components/Noc'

test('renders tiles, sample-data badge, and war-story log', () => {
  render(<Noc />)
  expect(screen.getByText(/illustrative sample data/i)).toBeInTheDocument()
  expect(screen.getByText(/ransomware/i)).toBeInTheDocument()
  expect(screen.getByText(/11\.5h/i)).toBeInTheDocument()
})
```

Run: `npm test` → FAIL.

- [ ] **Step 2: Implement**

`src/components/Noc.jsx`:
```jsx
import { useEffect, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import Section from './Section'
import { incidents } from '../data/incidents'

const TILES = [
  { label: 'AVAILABILITY', base: 99.9, unit: '%', jitter: 0 },
  { label: 'ENDPOINTS UP', base: 1800, unit: '+', jitter: 3 },
  { label: 'BACKUP JOBS OK', base: 9, unit: '/9', jitter: 0 },
  { label: 'OPEN P1 INCIDENTS', base: 0, unit: '', jitter: 0 },
]

const LEVEL_COLOR = { CRIT: 'text-red-400', WARN: 'text-yellow-400', OK: 'text-accent' }

function Tile({ t, reduced }) {
  const [v, setV] = useState(t.base)
  useEffect(() => {
    if (reduced || !t.jitter) return
    const id = setInterval(() => setV(t.base + Math.floor(Math.random() * t.jitter)), 2200)
    return () => clearInterval(id)
  }, [reduced, t])
  return (
    <div className="border border-line bg-card p-4">
      <div className="flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full bg-accent ${reduced ? '' : 'cursor-blink'}`} aria-hidden="true" />
        <span className="font-mono text-[10px] tracking-[0.2em] text-muted">{t.label}</span>
      </div>
      <p className="font-black text-3xl mt-2">{v}<span className="text-accent text-xl">{t.unit}</span></p>
    </div>
  )
}

export default function Noc() {
  const reduced = useReducedMotion()
  return (
    <Section id="ops" title="ops — the night shift never lies">
      <p className="font-mono text-[10px] tracking-widest text-muted -mt-4 mb-6">
        ⚠ ILLUSTRATIVE SAMPLE DATA — the incidents below, however, were real
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {TILES.map(t => <Tile key={t.label} t={t} reduced={reduced} />)}
      </div>
      <div className="border border-line bg-card mt-4 p-4 font-mono text-xs overflow-hidden">
        <p className="text-muted tracking-widest text-[10px] mb-3">$ tail -f /var/log/career/incidents.log</p>
        <ul className="space-y-2">
          {incidents.map(inc => (
            <li key={inc.text} className="flex gap-3">
              <span className="text-muted shrink-0">{inc.ts}</span>
              <span className={`shrink-0 w-11 ${LEVEL_COLOR[inc.level]}`}>[{inc.level}]</span>
              <span className="text-ink/90">{inc.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}
```

Replace placeholder in `Home.jsx` with `<Noc />`.

- [ ] **Step 3: Verify + commit**

Run: `npm test` → PASS. Dev: endpoint tile jitters every ~2s (static under reduced motion); log reads as war-story ticker.

```powershell
git add -A; git commit -m "feat: NOC dashboard — sample tiles + real-incident log"
```

---

### Task 11: Skills + Contact sections

**Files:**
- Create: `src/components/Skills.jsx`, `src/components/Contact.jsx`, `tests/contact.test.jsx`
- Modify: `src/pages/Home.jsx`

**Interfaces:**
- Consumes: `skills`, `profile`, `Section`.
- Produces: Request-CV mailto (exact): `mailto:asrul.hasni@gmail.com?subject=CV%20request%20%E2%80%94%20%5Byour%20company%5D&body=Hi%20Asrul%2C%20saw%20your%20site%20%E2%80%94%20please%20send%20your%20full%20CV.`

- [ ] **Step 1: Failing test**

`tests/contact.test.jsx`:
```jsx
import { render, screen } from '@testing-library/react'
import Contact from '../src/components/Contact'

test('contact has email, linkedin, github, request-cv — and no phone', () => {
  render(<Contact />)
  expect(screen.getByRole('link', { name: /request cv/i })).toHaveAttribute('href', expect.stringContaining('mailto:asrul.hasni@gmail.com?subject=CV%20request'))
  expect(screen.getByRole('link', { name: /linkedin/i })).toHaveAttribute('href', 'https://www.linkedin.com/in/asrul-hasni')
  expect(screen.getByRole('link', { name: /github/i })).toHaveAttribute('href', 'https://github.com/burzhum')
  expect(document.body.textContent).not.toMatch(/\+?60\s?-?1[0-9]/)
})
```

Run: `npm test` → FAIL.

- [ ] **Step 2: Implement**

`src/components/Skills.jsx`:
```jsx
import Section from './Section'
import { skills } from '../data/skills'

export default function Skills() {
  return (
    <Section id="skills" title="skills — no progress bars, just receipts">
      <div className="grid md:grid-cols-2 gap-x-10 gap-y-8">
        {skills.map(g => (
          <div key={g.group}>
            <h3 className="font-mono text-[10px] tracking-[0.3em] text-accent mb-3">{g.group}</h3>
            <div className="flex flex-wrap gap-2">
              {g.items.map(i => (
                <span key={i} className="font-mono text-xs border border-line px-2.5 py-1 hover:border-accent hover:text-accent transition-colors cursor-default">{i}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  )
}
```

`src/components/Contact.jsx`:
```jsx
import Section from './Section'
import { profile } from '../data/profile'

const CV_MAILTO = 'mailto:asrul.hasni@gmail.com?subject=CV%20request%20%E2%80%94%20%5Byour%20company%5D&body=Hi%20Asrul%2C%20saw%20your%20site%20%E2%80%94%20please%20send%20your%20full%20CV.'

export default function Contact() {
  return (
    <Section id="contact" title="contact">
      <h3 className="font-black uppercase text-3xl md:text-5xl leading-tight">
        The site carries my CV's substance.<br />
        <span className="text-accent">Want the paper? Ask.</span>
      </h3>
      <div className="flex flex-wrap gap-4 mt-8 font-mono text-sm">
        <a href={CV_MAILTO} className="bg-accent text-bg font-bold px-5 py-2.5 hover:opacity-90 transition-opacity">REQUEST CV →</a>
        <a href={`mailto:${profile.email}`} className="border border-line px-5 py-2.5 hover:border-accent hover:text-accent transition-colors">{profile.email}</a>
        <a href={profile.linkedin} target="_blank" rel="noreferrer" className="border border-line px-5 py-2.5 hover:border-accent hover:text-accent transition-colors">LinkedIn</a>
        <a href={profile.github} target="_blank" rel="noreferrer" className="border border-line px-5 py-2.5 hover:border-accent hover:text-accent transition-colors">GitHub</a>
      </div>
    </Section>
  )
}
```

Replace placeholders in `Home.jsx`; final Home section order: `BootLoader, Nav, Hero, About, Experience, Projects, Noc, Skills, Contact, Footer`.

- [ ] **Step 3: Verify + commit**

Run: `npm test` → PASS (incl. confidentiality suite — still no phone anywhere).

```powershell
git add -A; git commit -m "feat: skills tag clusters + contact with request-CV mailto"
```

---

### Task 12: Terminal easter egg

**Files:**
- Create: `src/lib/terminal.js`, `src/components/Terminal.jsx`, `tests/terminal.test.js`
- Modify: `src/pages/Home.jsx`

**Interfaces:**
- Produces: `runCommand(input: string) → { lines: string[], action?: 'clear'|'exit'|'nav-lab' }` pure function; `<Terminal />` overlay toggled by `` Ctrl+` `` (backquote), also opened via custom event `window.dispatchEvent(new Event('open-terminal'))` (footer hint can hook this later).

- [ ] **Step 1: Failing parser tests**

`tests/terminal.test.js`:
```js
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
```

Run: `npm test` → FAIL.

- [ ] **Step 2: Implement parser**

`src/lib/terminal.js`:
```js
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
  '    ▐▓▓▓ ASRUL ▓▓▌    Packages: 12 apps (production)',
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
    `enterprise: ${projects.enterpriseTrack.length} apps running inside a 900-bed government hospital`,
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
```

- [ ] **Step 3: Run parser tests**

Run: `npm test` → terminal suite PASS.

- [ ] **Step 4: Implement overlay component**

`src/components/Terminal.jsx`:
```jsx
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { runCommand } from '../lib/terminal'

export default function Terminal() {
  const [open, setOpen] = useState(false)
  const [history, setHistory] = useState([{ lines: ["type 'help' to begin"] }])
  const [input, setInput] = useState('')
  const endRef = useRef(null)
  const inputRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const onKey = (e) => {
      if (e.ctrlKey && e.key === '`') { e.preventDefault(); setOpen(o => !o) }
      if (e.key === 'Escape') setOpen(false)
    }
    const onOpen = () => setOpen(true)
    window.addEventListener('keydown', onKey)
    window.addEventListener('open-terminal', onOpen)
    return () => { window.removeEventListener('keydown', onKey); window.removeEventListener('open-terminal', onOpen) }
  }, [])

  useEffect(() => { if (open) inputRef.current?.focus() }, [open])
  useEffect(() => { endRef.current?.scrollIntoView() }, [history])

  const submit = (e) => {
    e.preventDefault()
    const res = runCommand(input)
    if (res.action === 'clear') setHistory([])
    else setHistory(h => [...h, { prompt: input, lines: res.lines }])
    if (res.action === 'exit') setTimeout(() => setOpen(false), 300)
    if (res.action === 'nav-lab') setTimeout(() => { setOpen(false); navigate('/lab') }, 400)
    setInput('')
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-x-0 bottom-0 z-50 h-[45vh] bg-bg border-t-2 border-accent font-mono text-xs md:text-sm flex flex-col"
          role="dialog" aria-label="terminal"
        >
          <div className="flex justify-between items-center px-4 py-1.5 border-b border-line text-muted">
            <span>asrul@infra: interactive session</span>
            <button onClick={() => setOpen(false)} className="hover:text-accent">[x] esc</button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {history.map((h, i) => (
              <div key={i}>
                {h.prompt !== undefined && <p><span className="text-accent">$ </span>{h.prompt}</p>}
                {h.lines.map((l, j) => <p key={j} className="text-muted whitespace-pre-wrap">{l}</p>)}
              </div>
            ))}
            <div ref={endRef} />
          </div>
          <form onSubmit={submit} className="flex items-center gap-2 px-4 py-2 border-t border-line">
            <span className="text-accent">$</span>
            <input
              ref={inputRef} value={input} onChange={e => setInput(e.target.value)}
              className="flex-1 bg-transparent outline-none text-ink caret-transparent"
              aria-label="terminal input" autoComplete="off" spellCheck="false"
            />
            <span className="w-2 h-4 bg-accent cursor-blink -ml-[calc(100%-1ch)]" style={{ marginLeft: 0 }} aria-hidden="true" />
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
```

Mount `<Terminal />` in `Home.jsx` (after Footer). Update Footer hint to also trigger on click:
```jsx
<button onClick={() => window.dispatchEvent(new Event('open-terminal'))} className="text-accent hover:underline">
  press <kbd className="border border-line px-1">ctrl+`</kbd>
</button>
```

- [ ] **Step 5: Verify + commit**

Run: `npm test` → PASS. Dev: `` ctrl+` `` slides terminal up; every command answers; `lab` navigates; `exit`/esc closes.

```powershell
git add -A; git commit -m "feat: terminal easter egg with tested command parser"
```

---

### Task 13: SEO, OG card, favicon, sitemap

**Files:**
- Create: `public/favicon.svg`, `scripts/og.mjs`, `public/og.png` (generated), `public/robots.txt`, `public/sitemap.xml`
- Modify: `index.html`

**Interfaces:**
- Produces: complete `<head>` metadata; `https://burzhum.github.io/og.png` 1200×630.

- [ ] **Step 1: Favicon (terminal cursor block)**

`public/favicon.svg`:
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" fill="#0a0e14"/>
  <text x="4" y="22" font-family="monospace" font-size="16" fill="#23d18b">&gt;_</text>
</svg>
```

- [ ] **Step 2: OG card generator**

```powershell
npm install -D @resvg/resvg-js
```

`scripts/og.mjs`:
```js
import { Resvg } from '@resvg/resvg-js'
import { writeFileSync } from 'node:fs'

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="#0a0e14"/>
  <g stroke="#23d18b" stroke-opacity="0.07">${
    Array.from({ length: 38 }, (_, i) => `<line x1="${i * 32}" y1="0" x2="${i * 32}" y2="630"/>`).join('')
  }${
    Array.from({ length: 20 }, (_, i) => `<line x1="0" y1="${i * 32}" x2="1200" y2="${i * 32}"/>`).join('')
  }</g>
  <text x="80" y="130" font-family="monospace" font-size="26" fill="#23d18b">asrul@infra:~$ whoami</text>
  <text x="76" y="270" font-family="Arial, sans-serif" font-size="88" font-weight="900" fill="#e6edf3">I KEEP HOSPITALS</text>
  <text x="76" y="370" font-family="Arial, sans-serif" font-size="88" font-weight="900" fill="#23d18b">ONLINE_</text>
  <text x="76" y="470" font-family="Arial, sans-serif" font-size="52" font-weight="900" fill="#e6edf3">I SHIP SOFTWARE WITH AI_</text>
  <text x="80" y="560" font-family="monospace" font-size="24" fill="#8b949e">99.90% SLA · RM32M O&amp;M · 12 APPS · 18+ YEARS — burzhum.github.io</text>
</svg>`

writeFileSync('public/og.png', new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng())
console.log('og.png written')
```

Run: `node scripts/og.mjs` → Expected: `og.png written`; open `public/og.png` to eyeball.

- [ ] **Step 3: Head metadata**

`index.html` `<head>` (replace title/meta block):
```html
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Asrul Hasni — I keep hospitals online. I ship software with AI.</title>
<meta name="description" content="Service Delivery Manager and Infrastructure Lead with 18+ years in enterprise IT — running a 99.90% SLA hospital environment and shipping production software by directing AI agents. 12 apps live." />
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<link rel="canonical" href="https://burzhum.github.io/" />
<meta property="og:type" content="website" />
<meta property="og:url" content="https://burzhum.github.io/" />
<meta property="og:title" content="Asrul Hasni — I keep hospitals online. I ship software with AI." />
<meta property="og:description" content="18+ years enterprise infrastructure · 99.90% SLA · 12 production apps built AI-augmented." />
<meta property="og:image" content="https://burzhum.github.io/og.png" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="theme-color" content="#0a0e14" />
```

- [ ] **Step 4: robots + sitemap**

`public/robots.txt`:
```
User-agent: *
Allow: /
Sitemap: https://burzhum.github.io/sitemap.xml
```

`public/sitemap.xml`:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://burzhum.github.io/</loc></url>
  <url><loc>https://burzhum.github.io/lab</loc></url>
</urlset>
```

- [ ] **Step 5: Verify + commit**

Run: `npm run build` → clean. `npm run preview` → view source shows meta; /favicon.svg + /og.png load.

```powershell
git add -A; git commit -m "feat: SEO head, OG card generator, favicon, robots, sitemap"
```

---

### Task 14: GitHub repo + Actions deploy + live verify

**Files:**
- Create: `.github/workflows/deploy.yml`
- Modify: none

**Interfaces:**
- Produces: live site at https://burzhum.github.io, auto-deploy on push to `main`, CI runs tests + confidentiality scan on `dist/` before deploy.

- [ ] **Step 1: Workflow**

`.github/workflows/deploy.yml`:
```yaml
name: deploy
on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
      - run: npm test
      - run: npm run build
      - name: Confidentiality scan on built output
        run: |
          set -e
          PATTERNS='sungai buloh|hsgb|kkm-200|10\.37\.|shahir|muiz|afiq|aiezzat|lukman'
          if grep -riE "$PATTERNS" dist/; then
            echo '::error::Confidential term found in build output'; exit 1
          fi
          echo 'clean'
      - uses: actions/upload-pages-artifact@v3
        with: { path: dist }
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Create repo + push**

```powershell
cd C:\Users\HP\Documents\Projects\portfolio
git add -A; git commit -m "ci: GitHub Pages deploy workflow with confidentiality gate"
gh repo create burzhum/burzhum.github.io --public --source . --push
gh api -X POST repos/burzhum/burzhum.github.io/pages -f build_type=workflow
```
If Pages API returns 409 (already exists), run instead: `gh api -X PUT repos/burzhum/burzhum.github.io/pages -f build_type=workflow`.

- [ ] **Step 3: Watch CI, verify live**

```powershell
gh run watch --repo burzhum/burzhum.github.io
curl.exe -s -o NUL -w "%{http_code}" https://burzhum.github.io/          # expect 200
curl.exe -s https://burzhum.github.io/ | Select-String "Asrul Hasni"     # expect hit
curl.exe -s -o NUL -w "%{http_code}" https://burzhum.github.io/og.png    # expect 200
curl.exe -s -o NUL -w "%{http_code}" https://burzhum.github.io/lab       # expect 404→ but body is redirect page; check 404.html served
```
Note: first Pages activation can take a few minutes; retry curl once before diagnosing.

- [ ] **Step 4: Deep-link check**

Open https://burzhum.github.io/lab in browser (or headless browse): must land on the /lab page via the 404 redirect trick.

---

### Task 15: Full QA sweep + polish

**Files:**
- Modify: whatever QA flags (fix-forward)

- [ ] **Step 1: Headless browse QA on live site** (use browse skill)

Checklist — run against https://burzhum.github.io:
- Boot preloader plays once per session, skip works
- Both themes: toggle flips full palette, persists across reload
- All 6 nav anchors scroll to sections; all sections populated
- Hero counters animate; marquee loops without gap
- 12 project cards render; 3 public links resolve (hiddengrotto.org 200, grotto-client repo 200)
- Terminal: `` ctrl+` `` opens; run `help`, `whoami`, `neofetch`, `sudo`, `telnet`, `lab` (navigates), `exit`
- /lab direct URL works (deep link)
- Mobile viewport 375px: no horizontal scroll, nav collapses to logo+toggle, cards stack
- Reduced-motion emulation: no boot, no marquee movement, content all visible statically
- Console: zero errors

- [ ] **Step 2: Lighthouse**

```powershell
npx lighthouse https://burzhum.github.io --only-categories=performance,accessibility,best-practices,seo --preset=desktop --quiet --chrome-flags="--headless"
```
Expected: ≥90 all four. If perf below: check font subsetting (@fontsource 400/700/900 only), lazy-render below-fold sections.

- [ ] **Step 3: Fix findings, re-verify, commit each fix**

```powershell
git add -A; git commit -m "fix: QA findings from live sweep"; git push
```

- [ ] **Step 4: Final verification table in report**

Report: live URL, bundle hash, test count, Lighthouse scores, confidentiality-gate proof (CI log line), skipped/at-risk items.

---

## Self-Review Notes

- Spec coverage: positioning/hero (T6), themes (T2), boot (T5), about+photo slot (T7), timeline (T8), 12 projects two tracks (T3/T9), NOC+war stories (T10), skills no-bars (T11), contact request-CV/no-phone (T11), terminal (T12), /lab (T4), SEO/OG (T13), Pages+Actions+404 (T4/T14), QA/reduced-motion/Lighthouse (T15), confidentiality automated (T3 source + T14 dist). Blog/analytics/domain: out of scope per spec. ✓
- Open user inputs (from spec): headshot at `src/assets/headshot.jpg` (fallback works without), LinkedIn slug `asrul-hasni` assumed — confirm before T14 push.
- Type consistency: `useCountUp` signature identical in T6 def and T10 consumption; `runCommand` return `{lines, action?}` consistent; data shapes in T3 match consumers T6–T12. ✓
