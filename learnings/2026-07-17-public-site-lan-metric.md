# Showing a live private-network metric on a public static site

**Problem:** The NOC tile hardcoded an endpoint count that drifts. The real number lives in a database on a private network, unreachable from the public internet or from GitHub Actions CI.

**Why the obvious options fail:**
- Per-visitor fetch → the visitor's browser can't route to the private DB.
- Build-time query in CI → GitHub Actions has no private-network access either.
- Exposing the count on a public endpoint → leaks internal data.

**Approach (manual refreshable snapshot):**
1. Put the metric in one data file `src/data/metrics.js` = `{ endpoints, asOf }`. The component reads `metrics.endpoints` (no more literal in JSX).
2. Add `scripts/refresh-metrics.mjs` + `npm run refresh-metrics`: SSH into the box, run a `COUNT(*)` against the register, rewrite the data file with the new count + today's date.
3. **Secret hygiene for a public repo:** credentials come from env vars ONLY (`*_SSH_HOST` / `*_SSH_PW`). Never hardcode the private host, SSH password, or DB password in the script — the repo is public. The remote command reads the DB password out of the server's own `.env` via `sudo`, so only the SSH password is needed client-side.
4. Verify by actually running the refresh — not just writing the script.

**Rule:** A public static site can't show truly live data from a private-network source — make it an explicit refreshable snapshot (one data file + a refresh script that pulls all secrets from env, never from the repo), state the "as of" date, and never commit the internal host or credentials.
