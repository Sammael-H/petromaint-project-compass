# Petromaint Project Compass

Sanitized public deployment layer for the Petromaint presentation workstream.

## Purpose

This repository is used as the public-safe deployment target while the full source repository remains private.

Private source repository retained separately:

`G1-002/presentation-knowledge`

## Published public-safe content

The public deployments publish only the `docs/` folder:

- `docs/index.html` — public-safe landing page.
- `docs/deck-b/index.html` — public-safe external Deck B.
- `docs/sanitization-manifest.json` — publication boundary and excluded content classes.
- `docs/deployment-verification.json` — deployment verification handoff record.
- `docs/404.html` and `docs/.nojekyll` — GitHub Pages support files.

## Excluded from this public deployment

- Raw chat exports.
- Private evidence-control files.
- Internal audit workbooks and trackers.
- ZIP archive packages.
- Working drafts and intermediate files.
- Unsupported financial, HSE, emissions, backlog, pipeline, margin, cash-generation, and forward-looking claims.

## Deployment routes

### Primary fallback route — GitHub Pages

GitHub Actions workflow:

`.github/workflows/deploy-github-pages.yml`

Primary public URL:

`https://sammael-h.github.io/petromaint-project-compass/`

### Secondary polished route — Vercel

Vercel deployment status:

- Project: `petromaint-project-compass`
- Team: `petro`
- Commit: `878467aafe2ab183bbca2a999374e1e7921d21aa`
- State: `READY`
- Target: `production`
- Production alias: `https://petromaint-project-compass-petro-e579dac4.vercel.app/`
- Branch alias: `https://petromaint-project-compass-git-main-petro-e579dac4.vercel.app/`
- Deployment URL: `https://petromaint-project-compass-85z1kb2zz-petro-e579dac4.vercel.app/`

Vercel static deployment configuration:

`vercel.json`

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "installCommand": "",
  "buildCommand": "",
  "outputDirectory": "docs"
}
```

This configuration directs Vercel to deploy the sanitized static `docs/` folder rather than attempting to build the previous Vite/Lovable app.
