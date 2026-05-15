# Petromaint Project Compass

Sanitized public deployment layer for the Petromaint presentation workstream.

## Purpose

This repository is used as the public GitHub Pages deployment target while the full source repository remains private.

Private source repository retained separately:

`G1-002/presentation-knowledge`

## Published public-safe content

The GitHub Pages site publishes only the `docs/` folder:

- `docs/index.html` — public-safe landing page.
- `docs/deck-b/index.html` — public-safe external Deck B.
- `docs/sanitization-manifest.json` — publication boundary and excluded content classes.
- `docs/404.html` and `docs/.nojekyll` — GitHub Pages support files.

## Excluded from this public deployment

- Raw chat exports.
- Private evidence-control files.
- Internal audit workbooks and trackers.
- ZIP archive packages.
- Working drafts and intermediate files.
- Unsupported financial, HSE, emissions, backlog, pipeline, margin, cash-generation, and forward-looking claims.

## Deployment

GitHub Actions workflow:

`.github/workflows/deploy-github-pages.yml`

Expected public URL after Pages is enabled/published:

`https://sammael-h.github.io/petromaint-project-compass/`

If the deployment does not appear after the workflow run, set repository Pages source to **GitHub Actions** in GitHub repository settings.
