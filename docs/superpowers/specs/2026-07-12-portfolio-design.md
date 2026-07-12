# Personal Portfolio Website — Design Spec

Date: 2026-07-12
Status: approved-pending-user-spec-review
Supersedes: `Personal/personal-github-pages-portfolio-brainstorm.md` (codex draft — contained fabricated timeline, inflated certifications, invented projects; corrected here from CV and vault)

## Purpose

Public personal portfolio for Asrul Hasni Ismail, hosted free on GitHub Pages. Primary goal: support job applications (SDM / infrastructure-lead roles) while presenting the rare hybrid profile — 18+ years enterprise infrastructure leadership **plus** AI-augmented builder of 12 production applications.

The site must answer fast: who is he, what does he run, what has he shipped, why contact him.

## Positioning

- Identity line: **Service Delivery Manager · Infrastructure Lead · AI-Augmented Builder**
- Hero statement: *"I keep hospitals online. I ship software with AI."*
- AI-augmentation is owned loudly: directing AI agents to ship production software is presented as a headline skill, not a footnote.
- Source of truth for career facts: `Personal/Asrul_Hasni_SDM_CV_Final.docx` (latest CV). NOT the codex brainstorm doc.

### Headline metrics (hero counters)

| Value | Label | Source |
|---|---|---|
| 99.90% | SLA availability | CV (contractual) |
| RM32M | O&M contract managed | CV (RM 32.2M) |
| 12 | production apps live | vault (9 hospital + 3 Grotto) |
| 18+ | years experience | CV (since 2006) |

GODM0D3 is **excluded** everywhere — not Asrul's project.

## Visual Design — "Terminal Editorial"

Locked via visual-companion session (mockups preserved in `.superpowers/brainstorm/1913-1783860198/content/`, final: `style-4-hybrid.html`).

- Blend: terminal/NOC DNA (mono prompt lines, blinking cursor, grid background, mono uppercase labels) + bold editorial typography (massive uppercase kinetic headlines, marquee strip, stat blocks with accent punctuation).
- **Two themes, toggle labeled `day_shift / night_shift`** (ops joke as theme control), persisted in localStorage:
  - **Night Shift (default):** near-black `#0a0e14`, phosphor green `#23d18b` accent, subtle green grid.
  - **Day Shift:** paper `#f4f1ea`, ink `#1a1a1a`, orange `#ff4d00` accent, ink grid.
- Typography: heavy sans (e.g. Inter/Archivo black weights) for headlines; monospace (e.g. JetBrains Mono / Cascadia) for prompts, labels, terminal.
- No skill percentage bars, no glassmorphism, no gradient blobs (rejected as "portal vibe").

## Animation — Showpiece level

All animation via Framer Motion (use `motion-framer` skill at build time). Every effect respects `prefers-reduced-motion` (reduced variant: instant reveals, no preloader, counters render final values).

- **Boot preloader:** BIOS/POST-style boot sequence, once per session (sessionStorage), skippable on click/keypress.
- Hero: typing effect on `$ whoami`, kinetic line-by-line headline reveal, count-up stat counters, scrolling marquee.
- Scroll-driven section reveals throughout; timeline draws itself on scroll.
- Theme switch: full-page crossfade.
- Micro-interactions: cursor blink, hover states on cards/buttons, terminal-style focus states.
- NO custom cursor, NO WebGL, NO parallax excess (maximal-chaos tier rejected).

## Site Structure

Single-page scroll at `/` plus hidden `/lab` route. React Router with GitHub Pages 404.html redirect trick for deep links.

Scroll order:

1. **Boot preloader** (overlay)
2. **Hero** — per locked mockup
3. **About** — photo/headshot (user to supply), structured profile (role, location Putrajaya, industries, current focus), short AI-augmented workflow story: architect → direct AI agents → review → deploy → operate. Honest framing: he owns architecture, ops, deployment, verification; AI writes code under direction.
4. **Experience timeline** — from CV, animated vertical timeline:
   - 2025–now: CET Development @ government hospital — Lead, Network & Server Engineering / de-facto SDM (RM32.2M O&M, 4-person team, 15+ monthly report categories, KKM-level stakeholders)
   - 2010–2023: POS Digicert — IT Infrastructure / Service Delivery Engineer (DC upgrades −40% maintenance downtime, zero-downtime VMware migration)
   - 2008–2010: Hewlett-Packard — Technical Support Engineer L2 (EMEA/APAC, HP-UX/AIX/RHEL/Windows)
   - 2006–2008: Xybase — Technical Support Engineer (airport information systems, 24/7 ops)
5. **Projects — two tracks:**
   - **Track A: Public / linkable (the proof):**
     - GrottoMud — 1998 CircleMUD revived: ~25 bugs fixed in legacy C, full 64-bit port, live on public VPS (`telnet` connect info + hiddengrotto.org link)
     - Grotto Client — cross-platform Electron MUD client, v0.1.0 released, Win/Mac/Linux installers → github.com/burzhum/grotto-client
     - GrottoSite — hiddengrotto.org, custom domain + TLS
   - **Track B: Enterprise (anonymized case studies)** — client named only as "a 900-bed government hospital"; NO hospital name, NO IPs/hostnames, NO contract number, screenshots (if any) demo-seeded or blurred. Card format: Problem → Solution → Stack → Impact:
     - Device-maintenance platform (PPM): scheduled maintenance for 1000+ devices, techs sign off with digital signatures, WhatsApp digests
     - Task management for the IT team (CET): role/zone-driven workflows
     - IT knowledge base: 2,400+ entries + hardware asset register
     - Monitoring + alerting: dashboard watching every app + self-hosted WhatsApp gateway for alerts (Sentinel + OpenWA as one case study)
     - Switch port-security clearing tool: telnet automation against H3C switches
     - GPS-geofenced attendance app
     - Quran khatam tracker with audio recitation review (e-Khatam)
     - Village community platform (KampungKu)
6. **NOC dashboard section** — animated fake-live ops tiles (uptime, SLA, backups, endpoints) + scrolling incident-log ticker whose entries are the real war stories (from CV, anonymized): ransomware contained with zero server compromise; 11.5h full clinical-systems BCP recovery (eHIS/PACS/CCIS generic-labeled as "HIS/PACS/critical care"); multiple same-day major outage recoveries. Marked clearly as illustrative sample data.
7. **Skills** — grouped mono-tag clusters (no bars): Infrastructure / Networking / Monitoring & Security / Backup & Storage / Cloud / Dev & AI stack (React, Node, Postgres, Electron, C maintenance, AI-agent-directed development)
8. **Contact** — email `asrul.hasni@gmail.com`, LinkedIn `linkedin.com/in/asrul-hasni`, GitHub `github.com/burzhum`. **No phone. No contact form. No CV download** — instead a **"Request CV"** button: `mailto:` with prefilled subject ("CV request — [your company]") . Rationale: site carries full CV substance; interested parties self-select by asking.
9. **Footer** — hint for terminal easter egg + tiny `telnet` nod.

### Terminal easter egg

Global overlay, opened via `` Ctrl+` `` or footer hint link. Fake shell, mono, theme-aware. Commands: `help`, `whoami`, `projects`, `skills`, `contact`, `resume` (explains request-CV flow), `neofetch` (ASCII profile card), `sudo` (joke denial), `telnet` (points to GrottoMud), `exit`. Pure client-side.

### /lab (hidden page)

Informal playground, linked only from terminal + footer easter-egg hint: homelab notes, GrottoMud revival lore/write-up, scripts snippets. Content can start thin and grow.

## Confidentiality rules (hard)

- Never publish: hospital name, internal IPs/hostnames, contract number, server details, credentials, colleague names.
- "900-bed government hospital" / "Malaysian public healthcare" is the ceiling of specificity.
- Incident stories keep CV-level anonymization (SDM CV already scrubbed dates).
- Public repo — secret-hygiene scan before every push.

## Tech Stack

- React 18 + Vite + Tailwind CSS + Framer Motion (Asrul's production stack)
- React Router (/, /lab, 404 redirect trick)
- Repo: `burzhum/burzhum.github.io` (public), deploy via GitHub Actions → GitHub Pages
- URL: https://burzhum.github.io — custom domain (e.g. asrul.my) attachable later via CNAME, no rebuild
- Local project: `C:\Users\HP\Documents\Projects\portfolio`
- SEO: meta tags, OpenGraph + custom social card image, sitemap, favicon (terminal-cursor motif)
- Performance targets: Lighthouse ≥90 across the board; animations GPU-cheap (transform/opacity only)

## Testing / QA / Definition of Done

- Local dev QA with browse skill: both themes, reduced-motion mode, mobile viewport, terminal easter egg, /lab route, 404 deep-link redirect
- Build → deploy via Actions → verify live with curl (bundle hash) + headless browse against https://burzhum.github.io
- No role-gating (static public site) — qa-roles N/A
- Committed + pushed; secrets-clean diff

## Out of scope (v1)

- Blog (dead blog worse than none — revisit later; stack migration to Astro NOT needed, markdown section can be added to SPA)
- Contact form / any backend
- Custom domain purchase
- CV PDF hosting
- Analytics (can add later — privacy-light option like GoatCounter if wanted)

## Open items for user

- Headshot photo (needed for About)
- LinkedIn URL slug confirm (`asrul-hasni`)
- Grotto Client repo public link confirm for Track A cards
