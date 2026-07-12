# Portfolio brainstorm-to-live in one session

**Problem:** Ship a public animated portfolio (GitHub Pages) from a partly-inaccurate codex brainstorm doc, with confidential hospital context that must never leak, on a constrained token budget.

**Approach:**
1. Ground first: read CV docx (python-docx) + vault pages; diff codex claims against them — found fabricated timeline/certs/projects before any design work.
2. Confidentiality as a test suite, not a checklist: `tests/confidentiality.test.js` fails the build on forbidden terms (hospital name, IPs, colleague names, phone), and the CI workflow greps `dist/` with the same patterns before deploy. Leak-proof by machinery.
3. Visual companion for style choice only (genuinely visual fork); all text forks via AskUserQuestion. One style direction per screen when user asks "one at a time".
4. Token-efficient plan execution: plan written with literal code per task → execution = parallel Write batches + one `npm test` + granular commits per task in a single Bash call. 15 plan tasks ≈ 8 tool rounds.
5. GitHub Pages user site: `gh repo create user/user.github.io --source . --push` + `gh api -X POST repos/.../pages -f build_type=workflow` + rafgraph 404.html trick (`pathSegmentsToKeep=0`) gives SPA deep links.
6. Verify live, not local: curl status codes, browse text/screenshots both themes, terminal easter egg driven via JS event dispatch, Lighthouse from npx (write output to cwd — `/tmp` path breaks `require` on Windows node).

**Gotchas:** vitest 4 + jsdom 29 lacks working `localStorage` — shim in test setup with in-memory storage. `npm create vite` in non-empty dir prompts interactively — hand-write scaffold files instead. LinkedIn profile pic fetch hits bot-challenge even in logged-in Chrome — don't fight it, ask user to save the image manually.

**Rule:** For any public artifact derived from confidential work, encode the forbidden-terms list as an automated gate at BOTH source (unit test) and artifact (CI grep on build output) layers before writing any content.
