# `/portfolio-add` Skill Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a human-triggered, add-only `/portfolio-add` skill that automates the mechanical parts of adding one new live+cleared app to the `burzhum.github.io` portfolio and stops before pushing public, plus a non-destructive nudge in `/redeploy`.

**Architecture:** Two prose artifacts in the `claude-config` repo (`~/.claude`): a new `skills/portfolio-add/SKILL.md` (single-file inline procedure, same shape as `skills/redeploy/SKILL.md`) and one added step in `skills/redeploy/SKILL.md`. The skill is a procedure, not code, so it is validated by a real dry-run against the portfolio repo on a scratch branch (count-grep coverage, a planted-forbidden-string gate block, and the stop-before-push halt), not by unit tests.

**Tech Stack:** Markdown skill files; the portfolio repo is React 18 + Vite + Vitest; commands are Git Bash / PowerShell on Windows; git for both `~/.claude` (claude-config) and the portfolio repo.

## Global Constraints

- **Add-only.** One new app per run. No edit / promote / retire / batch.
- **Stop-before-push.** The skill commits locally and HALTS. It pushes ONLY after the user types "push". Never push otherwise.
- **Enterprise track is forced-anonymized.** No real client/hospital name, no link. Hospital referred to only as "1,200-bed government hospital". Card shape `{ name, problem, solution, impact, stack }` where `name` is the anonymized product name.
- **Client track needs consent.** Ask "client approved public credit (named + linked)? (Y/N)". N → anonymized client card (no name/link).
- **Confidentiality gate is a HARD BLOCK.** `tests/confidentiality.test.js` failure, or any FORBIDDEN string in built `dist/`, aborts the run with no commit.
- **Count bump is self-healing.** Derive the count-spot list by grepping the current total each run; never trust a hardcoded list (it was 6 spots on 2026-07-25, not the assumed 5).
- **Skill files live in `~/.claude/skills/` (claude-config repo).** Commit there with normal, non-caveman messages. Portfolio-repo changes (the actual card) commit in the portfolio repo.
- Portfolio repo path: `C:/Users/HP/Documents/Projects/portfolio`. Portfolio memory: `~/.claude/projects/C--Users-HP-Documents/memory/project_portfolio.md`.

---

### Task 1: Author `portfolio-add/SKILL.md`

**Files:**
- Create: `C:/Users/HP/.claude/skills/portfolio-add/SKILL.md`

**Interfaces:**
- Consumes: nothing (first task).
- Produces: the `portfolio-add` skill, invocable as `/portfolio-add [app name]`. Referenced by name from Task 2's `/redeploy` nudge (`run /portfolio-add`).

- [ ] **Step 1: Create the skill file with the full content below (verbatim).**

Write `C:/Users/HP/.claude/skills/portfolio-add/SKILL.md`:

````markdown
---
name: portfolio-add
description: Use when adding ONE new, already-live, already-cleared app to Asrul's public portfolio site burzhum.github.io. Triggers "/portfolio-add", "add X to my portfolio", "put X on the site/portfolio", "update the portfolio with the new app". Add-only — does not edit, promote, or remove existing cards. Stops before pushing public.
---

# Portfolio Add

## Overview

Adds ONE new production app to the portfolio (`burzhum.github.io`, repo `burzhum/burzhum.github.io`,
local `C:/Users/HP/Documents/Projects/portfolio`). Automates the mechanical parts (count bump across
every hardcoded spot, test + confidentiality gate, build) and keeps the judgment (copy, track,
attribution consent) human. It is **add-only** and it **stops before pushing public**.

**Iron Law 1: read `project_portfolio.md` memory before touching any file.** It is the source of
truth for the three-track structure, card shapes, the confidentiality FORBIDDEN list, and the count
situation. Path: `~/.claude/projects/C--Users-HP-Documents/memory/project_portfolio.md`.

**Iron Law 2: never push without an explicit "push".** The skill commits locally and halts. The
human reviews the public-facing diff first (higher confidentiality weight than a normal deploy —
this is a public site and hospital names must never leak).

## When NOT to use

- App is not live yet, or not cleared to be shown publicly → stop. Deploy ≠ portfolio-ready.
- Editing existing copy, promoting a held app, or removing a card → out of scope, do it by hand.
- Bulk-adding several apps → run once per app, or do it manually.

## Inputs

- App name + one line on what it does (name may be passed as `/portfolio-add <name>`).
- Track (asked): A Personal / B Client / C Enterprise.
- Attribution (asked, branches on track).

## Steps

1. **Read the memory file** (Iron Law 1). Confirm the current three tracks
   (`publicTrack` / `clientTrack` / `enterpriseTrack`), their card shapes, the current app total N,
   and the FORBIDDEN confidentiality list. Then read `src/data/projects.js` to see the live shapes.

2. **Interactive judgment gate — ask one at a time:**
   - **App name + one-line description** (if not already given).
   - **Track:** A Personal / B Client / C Enterprise.
   - **Attribution**, branched:
     - **Enterprise →** forced anonymized. Card shape `{ name, problem, solution, impact, stack }`
       into `enterpriseTrack`. `name` = anonymized product name (e.g. "Device Maintenance
       Platform"), NEVER the real org name. No link. Hospital only ever "1,200-bed government
       hospital".
     - **Client →** ask: "Has the client approved public credit — named and linked? (Y/N)".
       - Y → `{ name, tag, desc, stack, links: [{ label, href }] }` into `clientTrack`.
       - N → anonymized `clientTrack` card `{ name, tag, desc, stack }` (generic name, no link).
     - **Personal →** ask public-link or private.
       - Public → `{ name, tag, desc, stack, links: [...] }` into `publicTrack`.
       - Private → `{ name, tag, desc, stack, private: true }` into `publicTrack` (renders the
         "● private · demo on request" badge).
   - **Draft the card copy** in the chosen shape from the one-liner. Show it. Get approve/edit.
     Do NOT write anything until the copy is approved.

3. **Insert the approved card** into the correct track array in `src/data/projects.js`, matching the
   existing formatting exactly (2-space indent, trailing commas as in the file).

4. **Bump the count — self-healing, never a hardcoded list.** Let N = current total (from the memory
   file / sum of the three track lengths before insert), N+1 = new total. Grep the repo for N as an
   app-count token and bump each genuine hit:

   ```bash
   cd C:/Users/HP/Documents/Projects/portfolio && \
   grep -rnE "\b<N>\b" src/ tests/ | grep -viE "years|[0-9]:<N>|<N>vw|20<N>|[0-9]{3}<N>"
   ```

   Manually inspect each hit — bump ONLY the ones that mean "number of apps"
   (as of 2026-07-25: `src/lib/boot.js`, `src/lib/terminal.js`, `src/data/incidents.js`,
   `src/data/profile.js`, `src/components/Projects.jsx` section title, and the
   `tests/projects.test.jsx` card-count assertion). Do NOT touch `experience.js` "13 years",
   the `13:37` timestamp, or `13vw`/`30s` CSS. If the grep surfaces a NEW spot not in that list,
   bump it too and note it — this is exactly the drift the grep exists to catch.

5. **Update the data assertions** in `tests/data.test.js`: the relevant track's `toHaveLength`, and
   the total (`publicTrack.length + clientTrack.length + enterpriseTrack.length` → N+1). The
   `tests/projects.test.jsx` card-count assertion is covered by Step 4's grep.

6. **Confidentiality gate — HARD BLOCK.** Run it first, before the full suite:

   ```bash
   cd C:/Users/HP/Documents/Projects/portfolio && npx vitest run tests/confidentiality.test.js
   ```

   Any failure → ABORT: no commit, report which FORBIDDEN term appears and in which data file, leave
   the tree editable for a fix. Never soften or work around a forbidden string — fix the copy.

7. **Full suite + build:**

   ```bash
   cd C:/Users/HP/Documents/Projects/portfolio && npm test && npm run build
   ```

   Any test failure → ABORT (no commit). On success, grep the built `dist/` for the FORBIDDEN list
   as a second gate (CI does this on push; catch it locally):

   ```bash
   grep -riE "sungai buloh|hsgb|kkm-200|10\.37\.|shahir|muiz|afiq|aiezzat|lukman" dist/ && echo "LEAK — ABORT" || echo "dist clean"
   ```

   Capture the built bundle hash (`ls dist/assets/index-*.js`).

8. **Local commit (Iron Law 2 — do NOT push):**

   ```bash
   cd C:/Users/HP/Documents/Projects/portfolio && git add -A && git commit -m "<message>"
   ```

   Commit message: normal prose, name the app + track + count bump.

9. **Stop-before-push review block.** Print, then HALT and wait:
   - `git diff --stat HEAD~1`
   - the new card object
   - the count-bumped files with before→after
   - full-suite result, confidentiality-gate result, `dist` grep result, built bundle hash

10. **On "push"** (and only then): `git push`, watch the Actions run to `success`
    (`gh run watch <id> --exit-status`), then curl-verify live — new bundle hash served AND the new
    app's identifying string present in the served JS:

    ```bash
    curl -s https://burzhum.github.io/ | grep -oE 'index-[A-Za-z0-9_-]+\.js'
    curl -s https://burzhum.github.io/assets/<hash>.js | grep -oE "<app identifying string>"
    ```

    Report a verification table. **On anything other than "push"** → nothing published; tell the
    user to revert with `git reset --soft HEAD~1` if they want the change gone, and stop.

11. **Sync memory.** Update `project_portfolio.md` with the new app + new total N+1 (and any NEW
    count spot the grep found). Learning law: if the grep surfaced drift or anything non-obvious,
    invoke `extract-approach`.

## Rationalizations — all mean STOP

| Excuse | Reality |
|--------|---------|
| "Count is only in 5 spots, I'll just edit those" | It was six on 2026-07-25. Grep every run; never trust a memorized list. |
| "Client site is public, so crediting them is fine" | A public URL is not consent to be named in your portfolio. Ask Y/N. |
| "Hospital app — I'll just soften the name" | Enterprise track is forced-anonymized. No name, no link, ever. |
| "Tests pass, just push it" | Stop-before-push is the whole point. The human eyeballs the public diff first. |
| "The app deployed, so it's portfolio-ready" | Deploy ≠ cleared to show. If unsure it's cleared, stop and ask. |
| "Gate tripped, I'll exclude that file from the scan" | The gate found a real leak. Fix the copy, never the gate. |

## Common mistakes

- Editing `experience.js` "13 years" or a `13:37` timestamp when bumping the app count — scope the grep.
- Pushing before the human review — Iron Law 2. The local commit is not the publish step.
- Forgetting the `dist/` grep — the source test scans `src/data/*` only; a leak could reach `dist` via another path.
- Putting a client name on the Enterprise track, or a hospital detail on any named card.
````

- [ ] **Step 2: Verify the skill file is discoverable and well-formed.**

Run:
```bash
head -5 "C:/Users/HP/.claude/skills/portfolio-add/SKILL.md"
```
Expected: YAML frontmatter with `name: portfolio-add` and a `description:` line beginning "Use when adding ONE new".

- [ ] **Step 3: Commit to the claude-config repo.**

```bash
cd "C:/Users/HP/.claude" && git add skills/portfolio-add/SKILL.md && git commit -m "feat: add /portfolio-add skill (add-only, stop-before-push)"
```
Expected: one file committed. (If `~/.claude` is not the git root, commit from wherever the claude-config repo root is — check `git -C ~/.claude rev-parse --show-toplevel` first.)

---

### Task 2: Add the `/redeploy` nudge

**Files:**
- Modify: `C:/Users/HP/.claude/skills/redeploy/SKILL.md`

**Interfaces:**
- Consumes: the `portfolio-add` skill name from Task 1 (the nudge text says "run /portfolio-add").
- Produces: nothing downstream.

- [ ] **Step 1: Insert a new step after the live-verify step (step 5) and before commit (step 6).**

In `C:/Users/HP/.claude/skills/redeploy/SKILL.md`, after the existing step 5 ("Verify live with curl…"), insert a new step. Because the existing steps are numbered 5→6→…→10, insert the nudge as step 5.5-style text that renumbers cleanly, OR add it as an explicit lettered note under step 5. Use this exact inserted block:

```markdown
6. **Portfolio nudge (non-destructive, reminder only).** Grep the portfolio repo for the deployed
   app's name:
   `grep -riE "<app name or obvious alias>" C:/Users/HP/Documents/Projects/portfolio/src/data/projects.js`
   If ABSENT, print exactly:
   `↳ new app not on portfolio — run /portfolio-add when cleared to show`
   Do NOT auto-write anything. The app may be internal-only or not yet cleared. This is a reminder.
```

Renumber the subsequent steps (old 6→7, 7→8, 8→9, 9→10, 10→11) so the list stays sequential. (If preserving the exact numbering of downstream steps is fiddly, instead append the nudge as a clearly-labelled sub-bullet at the end of step 5 — the requirement is that the reminder fires after live-verify, not its ordinal.)

- [ ] **Step 2: Verify the nudge text is present.**

Run:
```bash
grep -n "new app not on portfolio" "C:/Users/HP/.claude/skills/redeploy/SKILL.md"
```
Expected: one match with the exact reminder string.

- [ ] **Step 3: Commit to the claude-config repo.**

```bash
cd "C:/Users/HP/.claude" && git add skills/redeploy/SKILL.md && git commit -m "feat: /redeploy nudges /portfolio-add for apps not yet on the portfolio"
```

---

### Task 3: Dry-run validation against the portfolio repo

**Files:**
- Test (scratch, discarded): `C:/Users/HP/Documents/Projects/portfolio` on a throwaway branch.

**Interfaces:**
- Consumes: the `portfolio-add` skill (Task 1) and the `/redeploy` nudge (Task 2).
- Produces: evidence the pipeline works; nothing persisted.

- [ ] **Step 1: Create a scratch branch so nothing real is touched.**

```bash
cd "C:/Users/HP/Documents/Projects/portfolio" && git checkout -b scratch/portfolio-add-dryrun
```
Expected: switched to a new branch.

- [ ] **Step 2: Confirm the count-grep surfaces every real app-count spot.**

With current total N (read from `project_portfolio.md`), run the Step-4 grep from the skill:
```bash
grep -rnE "\b14\b" src/ tests/ | grep -viE "years|[0-9]:14|14vw|2014|[0-9]{3}14"
```
Expected: hits in `boot.js`, `terminal.js`, `incidents.js`, `profile.js`, `Projects.jsx`, and `tests/projects.test.jsx` — the full six-spot set. Record the list. (If N has changed since 2026-07-25, use the current N; the point is that the grep returns the complete count-spot set, whatever it is.)

- [ ] **Step 3: Confirm the confidentiality gate HARD-BLOCKS a planted leak.**

Temporarily add a forbidden string to a data file, then run the gate:
```bash
node -e "const f='src/data/incidents.js';const s=require('fs').readFileSync(f,'utf8');require('fs').writeFileSync(f, s.replace('Uptime 99.90%.', 'Uptime 99.90%. HSGB'))"
npx vitest run tests/confidentiality.test.js
```
Expected: the confidentiality test FAILS on the `hsgb` term. Then revert the plant:
```bash
git checkout src/data/incidents.js
```
Expected: file restored, `git status` clean for that file.

- [ ] **Step 4: Confirm a clean full suite + build still pass on the branch.**

```bash
npm test && npm run build && ls dist/assets/index-*.js
```
Expected: all tests pass, build succeeds, a bundle hash prints. (This proves the skill's Step-7 gate passes on an unmodified tree.)

- [ ] **Step 5: Confirm the `/redeploy` nudge grep behaves for present and absent names.**

```bash
grep -riE "device maintenance" src/data/projects.js && echo "present-ok"
grep -riE "zzz-nonexistent-app" src/data/projects.js || echo "absent-ok (nudge would fire)"
```
Expected: `present-ok` prints for the known card; `absent-ok (nudge would fire)` prints for the fake name.

- [ ] **Step 6: Tear down the scratch branch (no real changes persisted).**

```bash
git checkout main && git branch -D scratch/portfolio-add-dryrun && git status --short
```
Expected: back on `main`, scratch branch deleted, clean tree.

- [ ] **Step 7: Update the portfolio memory with the new skill.**

Add a line to `project_portfolio.md` noting `/portfolio-add` exists (add-only, stop-before-push, self-healing count grep) and that `/redeploy` now nudges it. Add the one-line pointer to `MEMORY.md` if a new memory file is created; otherwise fold into the existing portfolio entry.

- [ ] **Step 8: Final commit of any memory/doc changes** (in whichever repo the memory lives — the claude-config repo for `~/.claude/projects/.../memory/`).

```bash
cd "C:/Users/HP/.claude" && git add -A && git commit -m "docs: record /portfolio-add skill in portfolio memory" || echo "nothing to commit"
```

---

## Self-Review

**Spec coverage:**
- Trigger + read-memory-first → Task 1 Steps 1-2 (Iron Law 1). ✓
- Interactive judgment gate (track + attribution branches + copy approve) → Task 1 Step 2. ✓
- Enterprise forced-anon / client consent / personal public-or-private → Task 1 Step 2 branches. ✓
- Self-healing count bump → Task 1 Step 4 + validated Task 3 Step 2. ✓
- Confidentiality HARD BLOCK (source test + dist grep) → Task 1 Steps 6-7 + validated Task 3 Step 3. ✓
- Stop-before-push → Task 1 Steps 8-10 (Iron Law 2). ✓
- `/redeploy` nudge → Task 2 + validated Task 3 Step 5. ✓
- Rationalizations table with today's lessons → Task 1 Step 1 content. ✓
- Anti-scope (add-only, no auto-fire) → Global Constraints + skill "When NOT to use". ✓

**Placeholder scan:** the `<message>`, `<N>`, `<hash>`, `<app name>`, `<app identifying string>` tokens are runtime values the skill fills at invocation, not plan placeholders — each has an explicit derivation rule in-context. No "TBD"/"handle edge cases"/"write tests for the above". ✓

**Type consistency:** card shapes are consistent across spec and plan — `publicTrack`/`clientTrack` use `{ name, tag, desc, stack, links|private }`; `enterpriseTrack` uses `{ name, problem, solution, impact, stack }`. Track names match `projects.js` verbatim. ✓
