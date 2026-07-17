#!/usr/bin/env node
// Refresh src/data/metrics.js from the live PPM asset register.
//
// The PPM database lives on a private LAN and is never reachable from this
// public repo or from CI, so this is a manual, on-demand snapshot: it SSHes
// in, counts active assets, and rewrites the data file with today's date.
//
// Credentials are read from the environment ONLY — nothing sensitive is ever
// committed. Run it like:
//
//   PPM_SSH_HOST=user@host PPM_SSH_PW=secret npm run refresh-metrics
//
// (PuTTY's `plink` must be on PATH; the host key must already be pinned.)

import { execFileSync } from 'node:child_process'
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const HOST = process.env.PPM_SSH_HOST
const PW = process.env.PPM_SSH_PW
if (!HOST || !PW) {
  console.error('Missing PPM_SSH_HOST and/or PPM_SSH_PW in the environment.')
  console.error('Usage: PPM_SSH_HOST=user@host PPM_SSH_PW=secret npm run refresh-metrics')
  process.exit(1)
}

// One remote command: read the DB password out of the app's .env (via sudo),
// then count active assets. No credential ever touches this repo.
const remote = [
  `DB=$(echo '${PW}' | sudo -S grep DATABASE_URL /var/www/ppm-app/backend/.env)`,
  `PGPW=$(echo "$DB" | sed -E 's#.*ppm_user:([^@]+)@.*#\\1#')`,
  `PGPASSWORD="$PGPW" psql -h 127.0.0.1 -U ppm_user -d ppm_db -tAc ` +
    `"SELECT COUNT(*) FROM assets WHERE status != 'disposal'"`,
].join('; ')

let out
try {
  out = execFileSync('plink', ['-pw', PW, '-batch', HOST, remote], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  })
} catch (e) {
  console.error('Remote query failed:', e.stderr || e.message)
  process.exit(1)
}

const endpoints = parseInt((out.match(/\d+/g) || []).pop(), 10)
if (!Number.isInteger(endpoints) || endpoints <= 0) {
  console.error('Could not parse an asset count from remote output:\n', out)
  process.exit(1)
}

const asOf = new Date().toISOString().slice(0, 10)
const file = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'data', 'metrics.js')
const body = `// Auto-generated snapshot of live production metrics.
// Refresh from the real PPM asset register with:  npm run refresh-metrics
// (see scripts/refresh-metrics.mjs — needs PPM_SSH_HOST + PPM_SSH_PW in env)
export const metrics = {
  endpoints: ${endpoints}, // active (non-disposal) assets in the PPM register
  asOf: '${asOf}',
}
`
writeFileSync(file, body)
console.log(`metrics.js updated: endpoints=${endpoints} asOf=${asOf}`)
