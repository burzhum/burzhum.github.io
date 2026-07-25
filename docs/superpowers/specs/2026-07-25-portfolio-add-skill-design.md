# `/portfolio-add` skill — design

Date: 2026-07-25
Status: approved, pre-implementation

## Problem

Every new production app is added to the portfolio (`burzhum.github.io`) by hand. The Aries
Engineering addition on 2026-07-25 exposed the failure mode: the app count is hardcoded in **six**
separate spots (`boot.js`, `terminal.js`, `incidents.js`, `profile.js`, `Projects.jsx` section
title, and a `projects.test.jsx` card-count assertion). A manual edit missed the sixth spot on the
first pass and only a re-run of the test suite caught it. The user asked to automate the update so
it stops being an error-prone hand edit — but explicitly NOT to auto-fire on every deploy, because:

- Most deploys are redeploys of apps already on the portfolio (wrong trigger).
- A deploy is not proof an app is portfolio-ready (staging ≠ cleared to show).
- Confidentiality is load-bearing: hospital apps must be anonymized, client apps need consent.
  Machine-generated copy cannot make those calls.

## Goal

A human-triggered, **add-only** skill that automates the mechanical parts of adding ONE new,
already-live, already-cleared app to the portfolio, while keeping every judgment call (copy, track
placement, attribution consent) with the human, and stopping before anything is pushed public.

Non-goals (YAGNI): editing or promoting existing cards (the Fleet held→live case stays manual),
retiring cards, batch-adding multiple apps, and any every-deploy auto-fire.

## Design decisions (locked with user)

1. **Push posture: stop-before-push.** Skill commits locally, shows the diff + built bundle, and
   halts. Nothing is published until the user says "push". (Higher confidentiality weight than
   `/redeploy`, which auto-pushes.)
2. **Scope: add-only.** One new app per run. No edit / promote / retire branches.
3. **`/redeploy` nudge: yes.** A non-destructive reminder step is added to the `/redeploy` skill.

## Architecture

Two artifacts, both in the `claude-config` repo (`~/.claude`):

- `~/.claude/skills/portfolio-add/SKILL.md` — the new skill (single-file, inline execution, same
  shape as `redeploy/SKILL.md`: frontmatter + Overview + Inputs + Steps + Rationalizations table).
- `~/.claude/skills/redeploy/SKILL.md` — one new step (the nudge).

The spec doc lives in the portfolio repo (`docs/superpowers/specs/`) because the operated-on code
and tests live there.

### Source of truth

The skill reads `project_portfolio.md` memory FIRST (Iron-law style, like `/redeploy` reads the
`reference_*_deploy` file). That memory documents the three-track structure, the card shapes, the
confidentiality FORBIDDEN list, and the count-spot situation. Never derive portfolio internals from
guesswork.

## Interaction flow (human judgment gate)

Questions asked one at a time:

1. **App name + one-line description** (may be supplied as an arg: `/portfolio-add <name>`).
2. **Track:** A Personal / B Client / C Enterprise.
3. **Attribution**, branched on track:
   - **Enterprise →** forced anonymized. No name in copy, no link, hospital referred to only as
     "1,200-bed government hospital". Card shape = `{ name, problem, solution, impact, stack }`
     inserted into `enterpriseTrack`. (`name` here is the anonymized product name, e.g. "Device
     Maintenance Platform", never the hospital's name.)
   - **Client →** skill asks "has the client approved public credit (named + linked)? (Y/N)". Y →
     named card shape `{ name, tag, desc, stack, links }` in `clientTrack`. N → fall back to an
     anonymized `clientTrack` card (no name/link; described generically) — still Track B, still no
     `problem/solution/impact` shape.
   - **Personal →** skill asks public-link or private. Public → `{ name, tag, desc, stack, links }`.
     Private → `{ name, tag, desc, stack, private: true }` (renders the "● private · demo on
     request" badge). Inserted into `publicTrack`.
4. **Copy draft & approve.** Skill drafts the card fields from the one-liner in the correct shape,
   shows it, user approves or edits. No card is written until approved.

## Mechanical pipeline (automatic, after copy approval)

1. **Insert** the approved card object into the correct track array in `src/data/projects.js`.
2. **Count bump — self-healing.** Read the current total from `project_portfolio.md` (or compute
   from the three track lengths pre-insert). Grep `src/` and `tests/` for that integer as a
   standalone app-count token and bump each genuine hit to N+1. This must NOT touch unrelated
   numbers — the grep is scoped to the known count contexts and every candidate hit is shown to the
   user in the pre-push summary for eyeball confirmation. Known count spots as of 2026-07-25 (verify
   live, do not trust as exhaustive): `src/lib/boot.js`, `src/lib/terminal.js`,
   `src/data/incidents.js`, `src/data/profile.js`, `src/components/Projects.jsx`,
   `tests/projects.test.jsx`. Rationale: the manual Aries edit hardcoded "five spots" and there
   were six — deriving the list by grep each run prevents that drift.
3. **Update assertions** in `tests/data.test.js` (per-track lengths + total) and
   `tests/projects.test.jsx` (rendered card count).
4. **Confidentiality gate — HARD BLOCK.** Run `tests/confidentiality.test.js`. Any forbidden string
   present → abort immediately, no commit, report which term and where. After build, also grep the
   emitted `dist/` for the same FORBIDDEN list (the CI gate does this on push; catch it locally
   first).
5. **Full suite.** Run `npm test`. Any failure → abort, no commit.
6. **Build.** `npm run build`; capture the bundle hash.

Any abort leaves the working tree editable for a fix and re-run; nothing is committed on abort.

## Stop-before-push gate

On success the skill:

- Stages and creates a **local** commit (normal, non-caveman message describing the added app).
- Prints a review block: `git diff --stat`, the new card, the list of count-bumped files with
  before/after, test result, confidentiality-gate result, built bundle hash.
- **Halts and waits.** It does NOT push.

User responds:
- **"push"** → skill pushes to `main`, watches the Actions run to `success`, then curl-verifies the
  live site: new bundle hash served AND the new app's identifying string present in the served JS.
  Reports a verification table.
- **anything else / "no"** → nothing is published. Skill states how to revert the local commit
  (`git reset --soft HEAD~1`) and stops.

## `/redeploy` nudge

New step near the end of `redeploy/SKILL.md` (after live-verify, before the learnings/report steps):

> After a successful deploy, grep the portfolio repo `src/data/projects.js` for the deployed app's
> name (or an obvious alias). If absent, print exactly:
> `↳ new app not on portfolio — run /portfolio-add when cleared to show`
> Do not auto-write. This is a reminder only; the app may be internal-only or not yet cleared.

Non-destructive, adds no push, cannot leak anything.

## Testing / verification of the skill itself

The skill is prose (a procedure), not code, so it has no unit tests. It is validated by a real dry
run: invoke `/portfolio-add` for a throwaway/personal app on a scratch branch, confirm the pipeline
bumps the right spots, the gate blocks a deliberately-planted forbidden string, and the stop-before-
push halt fires. The `/redeploy` nudge is validated by grepping projects.js for a known-present and
a known-absent name.

## Rationalizations to encode (STOP triggers)

| Excuse | Reality |
|--------|---------|
| "Count is only in 5 spots" | It was six on 2026-07-25. Grep every run; never trust a hardcoded list. |
| "Client site is public, credit is fine" | Public URL ≠ consent to be named in your portfolio. Ask Y/N. |
| "Hospital app, I'll just soften the name" | Enterprise track is forced-anonymized. No name, no link, ever. |
| "Tests pass, push it" | Stop-before-push is the whole point. Human eyeballs the public diff first. |
| "Deploy done, auto-add to portfolio" | Deploy ≠ cleared to show. The nudge reminds; it never writes. |
