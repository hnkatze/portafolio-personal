
L20. P0 INCIDENT: production rendered a blank page (React #418 at <html>) on
`/`, `/es` and `/cv-print` while serving correct HTML. Bisect with real deploys:
full revert (d6dab54) rendered; a11y+/es (dbc8923) rendered at 10m35s but was
blank earlier; a11y-only (0a701ce) was blank at first probe and rendered 3/3
minutes later. Served HTML size for the same route varied across fetches
(557,410 / 556,473 / 532,798) and matched no local build of the same commit
(553,798). Never a failed request; always renders with JS disabled. Conclusion:
transient hydration failure tied to what the edge serves, NOT a deterministic
bug in the commits. Root cause not proven.

L21. Current production state: HEAD 0a701ce = a11y fix only (three AA tokens +
header label-in-name). The /es work, the toggle-as-navigation refactor and the
attribute removal are REVERTED (revert commits ccbe f21 / d6dab54 / 0a701ce) and
remain in history for clean re-application. `/es` returns 404.

L22. Deploy protocol from now on (added after this incident): after pushing,
(a) purge the Cloudflare cache, (b) wait for a build marker specific to the new
commit, (c) run the Playwright probe THREE times against the deployed URL, and
(d) hard-reload in a real browser before declaring the deploy healthy. Local
`next start` alone is not evidence.
