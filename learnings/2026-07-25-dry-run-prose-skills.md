# Dry-run a prose skill's own commands before trusting them

## Problem
A new `/portfolio-add` skill (a prose procedure that greps, gates, and commits) read as correct in
static review, but its embedded automation commands carried latent defects that only surfaced when
actually run against the real repo.

## Approach
1. Built the skill via brainstorm → spec → plan → subagent-driven-development. Task 1 authored the
   `SKILL.md`; a reviewer subagent read only the committed file + spec.
2. The static review caught two things a careful read *can* catch: the `dist/` confidentiality grep
   had no prose hard-stop (only an inline `echo "LEAK — ABORT"` that an agent could run past into the
   commit step), and it hardcoded a *subset* of the FORBIDDEN list — omitting `password` and
   `+60-12` that live in `tests/confidentiality.test.js`. Fixed both: added a prose STOP, widened the
   grep to mirror the canonical list.
3. The defect static review MISSED was found by executing Task 3 (the dry-run) on a throwaway branch:
   ran the skill's own count-bump command `grep -rnE "\b14\b" src/ tests/ | grep -viE "years|..."`.
   Its *negative* filter let through `1.14` (framer scale), `14%` (color-mix), `FONT=14`, `mt-14`,
   `[14,-14]` — six false positives buried among the six real app-count spots. A weaker model
   following the skill would have to eyeball-reject each, exactly the error the "self-healing grep"
   was meant to remove.
4. Pivot: replaced the negative filter with a *positive* context filter —
   `grep -iE "apps|in production|value: N|toBe\(N\)|toHaveLength\(N\)"` — and re-ran it. Returned
   exactly the real spots, zero false positives. Committed the fix to the skill.
5. Also exercised the gate for real: planted `HSGB` into `src/data/incidents.js`, ran
   `npx vitest run tests/confidentiality.test.js`, confirmed it FAILED on the term (`× data never
   contains hsgb`), then reverted. Proof the block fires, not just an assumption it would.

## Reusable rule
When a deliverable is a procedure that contains commands (a skill, runbook, or script-in-prose),
validate it by RUNNING its commands against a real target on a scratch branch — do not sign off from
reading alone. Prefer positive/allow-list filters over negative/deny-list ones in any
extraction grep, and prove every safety gate by planting the thing it must catch.
