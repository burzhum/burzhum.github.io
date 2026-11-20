# Public repo: the confidentiality gate must cover every file and run before the push

## Problem
Handing this public repo to another AI agent exposed that the confidentiality gate only scanned `src/data/*` and the built `dist/`, so a forbidden term in a component, doc, README or commit message would be pushed without any check failing.

## Approach
1. List every tracked text file (`git ls-files`, minus binaries) and grep it with the CI term list from `.github/workflows/deploy.yml`. Hits fell into one class: files that *define* the gate (the test, the workflow, two plans, one learnings note). No real content leaks.
2. Grep the full commit history: `git log --format=%B`. 0 hits.
3. Add two tests to `tests/confidentiality.test.js`: (a) every tracked text file except an explicit `GATE_FILES` allowlist, using the CI list (the source list's `password` / `[redacted]` match ordinary code and would always fail); (b) all commit messages.
4. Prove it: append a forbidden term to `knowledge.md`, `git add -N` it, run `npx vitest run tests/confidentiality.test.js` and confirm it FAILS naming the file. Revert, confirm it passes. Then run the full suite and `npm run build`.
5. Pivot: CI runs `npm test` only *after* the push, and on a public repo the commit is world-readable the moment it lands, on any branch. Branch protection can't help. So add a local `.git/hooks/pre-push` that runs the gate and exits 1 on failure.
6. The hook is not versioned and only exists in this clone. A cloud agent working on its own copy skips it. So the rule in `knowledge.md`: work in Local mode on the owner's clone only; agents commit, the owner pushes.

## Reusable rule
For a public repo, a leak gate that runs in CI is too late: scan every tracked file and commit message, block it in a local pre-push hook, and only let agents work in the clone that has the hook.
