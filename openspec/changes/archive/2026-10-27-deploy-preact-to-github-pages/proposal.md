# Proposal

## Why

The Preact + Vite app currently builds locally but has no GitHub Pages deployment workflow, so changes pushed to the repository are not published automatically. Add a repository-aware Pages base path and a least-privilege Actions pipeline that builds the existing app and deploys Vite's `dist` artifact from `main`.

## What Changes

- Configure Vite's `base` for this repository's project site at `/minimal-apis-interactive-studio/`.
- Add `.github/workflows/deploy.yml` to install dependencies reproducibly, run the existing production build, upload `./dist`, and deploy it using GitHub Pages' artifact-based workflow.
- Trigger deployment on pushes to `main` and support manual dispatch; configure explicit job permissions, the Pages environment, and deployment concurrency.
- Use currently published stable major versions of the official Actions rather than preserving the older v4 examples.
- Document the one-time GitHub Pages repository setting and the safe path to merge and publish from the current `feature/gh` branch to `main`.

## Capabilities

### New Capabilities

- `github-pages-deployment`: Build and publish the Vite static site to the correct GitHub Pages project URL through GitHub Actions.

### Modified Capabilities

None.

## Impact

- `vite.config.ts` and the new `.github/workflows/deploy.yml`.
- GitHub Actions permissions, artifact transfer, and the `github-pages` deployment environment.
- Repository Pages configuration must use **GitHub Actions** as its publishing source.
- No application dependencies or runtime behavior change. The existing `npm ci` lockfile and `npm run build` script are reused.
- The checkout is currently on `feature/gh`; automatic production deployment is intended to occur only after changes reach `main`.
