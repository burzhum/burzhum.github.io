# Anonymized cards break name greps (and a gate that cried wolf)

## Problem
`/redeploy` reported "new app not on portfolio" for KnowledgeKu, which had been on the
portfolio for weeks, and the `/portfolio-add` dist gate then reported a confidentiality
leak on a clean build.

## Approach
1. Before adding anything, listed the existing card names per track out of
   `src/data/projects.js`. KnowledgeKu was already there as **"IT Knowledge Base +
   Asset Register"** — enterprise cards are anonymized by design, so the app's real name
   appears nowhere in the file. The nudge's grep (`grep -riE "<app name>" projects.js`)
   can therefore never match for ANY hospital app. Ruled out "missing card"; the defect
   was in the check, not the data.
2. Fixed by giving the nudge an app→card map (PPM → Device Maintenance Platform,
   OpenWA → Ops Monitoring + WhatsApp Alerting, …) and grepping the CARD name. Resolved
   each of the 13 rows against `projects.js` before trusting the map — two enterprise
   cards ("Ops Monitoring + WhatsApp Alerting" vs "Uptime Sentinel") are easy to swap by
   guesswork, so they were disambiguated by reading the card bodies (`whatsapp-web.js` in
   the stack = OpenWA).
3. Separately, `/portfolio-add`'s step-7 dist grep aborted on a build with no leak.
   Instead of accepting the combined result, ran the 11 forbidden terms one at a time
   against `dist/`: only `password` matched, twice.
4. Read the matches with context: both were React DOM's input-type table
   (`datetime-local:!0,email:!0,…password:!0,…`) — vendor code, not portfolio data.
5. Checked the authority rather than "fixing" the symptom: `.github/workflows/deploy.yml`
   greps dist for NINE terms and deliberately omits `password` and `+60-12`, which the
   source test covers against `src/data/*` where they are meaningful. The SKILL.md copy
   had drifted to 11 terms and would have aborted every run forever. Aligned SKILL.md to
   the workflow and wrote down why the two lists differ, so nobody "helpfully" re-merges
   them.

## Reusable rule
When a guard fires on something you believe is fine, split the pattern and identify the
exact term that matched before touching either the guard or the data — then reconcile
against whichever copy of the rule actually blocks a publish (the CI workflow), never
against a prose copy in a skill file.
