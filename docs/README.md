# Petromaint Public-Safe GitHub Pages Deployment

This folder is the sanitized public deployment layer for the Petromaint presentation workstream.

## What is published

- `index.html` — public-safe landing page.
- `deck-b/index.html` — public-safe external Deck B.
- `sanitization-manifest.json` — publication boundary and excluded asset classes.
- `404.html` and `.nojekyll` — GitHub Pages support files.

## What is intentionally excluded

- The private source repository.
- Raw chat exports.
- Internal audit and evidence-control files.
- ZIP archive packages.
- Working drafts and intermediate files.
- Unsupported financial, HSE, emissions, backlog, pipeline, margin, and target claims.

## Deployment

The workflow `.github/workflows/deploy-github-pages.yml` publishes this `docs/` folder using GitHub Pages.

Expected URL after Pages is enabled/published:

`https://sammael-h.github.io/petromaint-project-compass/`
