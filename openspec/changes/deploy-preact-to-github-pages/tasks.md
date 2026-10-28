# Tasks

## 1. Configure the Vite project-site build

- [x] 1.1 Set `base` to `/minimal-apis-interactive-studio/` in `vite.config.ts` and verify `npm run build` succeeds with generated entry and asset URLs under that prefix.

## 2. Add and document the Pages workflow

- [x] 2.1 Create `.github/workflows/deploy.yml` with main-only push/manual deployment, Node 22, `npm ci`, `npm run build`, the `./dist` Pages artifact, dependent build/deploy jobs, least-privilege permissions, the `github-pages` environment, concurrency, and current stable official Actions; verify YAML parsing and each configured trigger, guard, action major, permission, and artifact path.
- [x] 2.2 Document the one-time GitHub Pages **Source: GitHub Actions** setting, published project URL, and branch-aware commit/publish instructions in `README.md`; verify every documented command maps to a real script or the checked-out branch workflow and does not imply a feature-branch push deploys production.

## 3. Verify first publication

- [ ] 3.1 Set the repository Pages source to GitHub Actions, merge the feature branch into `main`, and verify the Actions build and deployment jobs succeed and the published site loads scripts and styles under `/minimal-apis-interactive-studio/`.
- [ ] 3.2 Manually dispatch the workflow from `main` and verify it publishes successfully; dispatch from a non-main ref and verify the production site is not changed.
