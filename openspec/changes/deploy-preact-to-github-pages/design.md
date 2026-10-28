# Design

## Context

See `proposal.md` for motivation and `specs/github-pages-deployment/spec.md` for observable requirements. The repository is `falvarador/minimal-apis-interactive-studio`; its Vite configuration currently has only the Preact plugin, its `build` script runs `tsc -b && vite build`, and `package-lock.json` supports `npm ci`. Vite 8.3.5 requires Node `^20.19.0 || >=22.12.0`. There are no existing workflows. The current checkout is `feature/gh`, while production deployment is intended for `main`.

## Goals / Non-Goals

**Goals:**
- Keep the generated app and asset URLs valid beneath the GitHub Pages project-site path.
- Use a reproducible build and GitHub's artifact-based Pages deployment with narrowly scoped job permissions.
- Restrict production publishing to `main`, including manual runs.

**Non-Goals:**
- Add a backend, change app behavior, or introduce build dependencies.
- Deploy preview sites from pull requests or other branches.
- Change branch protection, repository secrets, or GitHub repository settings through an API.

## Decisions

### Vite project-site base

Add `base: '/minimal-apis-interactive-studio/'` to the existing `defineConfig` object in `vite.config.ts`. This is the repository name, not a username-site root; the repository owner and project name resolve to `https://falvarador.github.io/minimal-apis-interactive-studio/`. Keep the value explicit rather than deriving it from the CI environment so local production builds match the published site.

Alternative considered: leave the root base `/`, which works on a local root-mounted preview but requests assets from the wrong path on a GitHub Pages project site.

### Artifact-based Pages workflow

Create one workflow at `.github/workflows/deploy.yml` with a `build` job and a dependent `deploy` job. Trigger on pushes to `main` and `workflow_dispatch`; add a job condition that permits both jobs to run only when `github.ref == 'refs/heads/main'`, so manually selecting another ref cannot publish it. Serialize deployments with a shared Pages concurrency group and do not cancel an in-progress deployment.

The build job checks out the source, configures Node 22, enables npm caching, runs `npm ci` and `npm run build`, and uploads `./dist` with `actions/upload-pages-artifact`. The deploy job configures Pages and deploys the uploaded artifact into the `github-pages` environment, exposing the action's page URL. `needs: build` ensures no deployment occurs after a failed build.

Use the current official stable major action tags checked on 2026-10-27: `actions/checkout@v7`, `actions/setup-node@v7`, `actions/configure-pages@v6`, `actions/upload-pages-artifact@v5`, and `actions/deploy-pages@v5`. The request gave v4 as examples; those majors are no longer the latest. Node 22 satisfies Vite's declared engine range while remaining an explicit LTS line.

Set workflow-wide permissions to none, then grant `contents: read` to build and only `pages: write` plus `id-token: write` to deploy. Do not use a personal access token or repository secret. Configure `actions/configure-pages` in the deployment job so Pages setup runs under the Pages-enabled permission boundary.

Alternative considered: publishing a branch directory or pushing generated files to `gh-pages`. The artifact flow is GitHub Pages' custom workflow model and avoids committing build output or maintaining a deployment branch.

### Repository and contributor setup

Document in `README.md` that the repository's **Settings → Pages → Build and deployment → Source** must be set to **GitHub Actions** once. Include the repository-specific public URL and concise publication commands.

Because this checkout is `feature/gh`, the safe contributor route is to commit and push that branch, then merge it into `main` (normally through a pull request); the workflow deploys after the merge. Do not recommend `git push origin main` from the feature checkout or silently switch branches. If the user later explicitly chooses a direct-main workflow, provide commands for that path when implementing.

### Verification and recovery

Run the existing production build and inspect the generated `dist/index.html` references to ensure assets carry the repository prefix. Validate the workflow YAML and verify the build/deploy dependency, `./dist` artifact path, branch guards, environment and permission scope. Once merged, inspect the Actions run and load the deployed URL. If a deployment regresses, revert the responsible `main` commit or rerun a known-good deployment workflow run.

## Risks / Trade-offs

- [GitHub Pages is disabled or configured to publish from a branch] → Document the one-time **GitHub Actions** source setting and verify the deployment environment on the first run.
- [A base-path typo produces a page with missing assets] → Derive the path from the exact repository name and inspect the built HTML before deployment.
- [An Action major tag moves over time] → Use official stable major tags and review release notes when refreshing them; pin full commit SHAs only if the repository adopts a SHA-pinning policy.
- [A manual run is dispatched from a feature branch] → Guard both jobs to `main`; the non-main run may appear with skipped jobs but cannot publish.
- [The local branch differs from the deployment branch] → Push/merge the feature branch into `main`; do not deploy directly from the current checkout.

## Migration Plan

1. Add the Vite base and Actions workflow; update README deployment setup and publication guidance.
2. Run the production build and validate the generated asset paths and workflow configuration.
3. Commit and push the current feature branch, then merge to `main`; verify the Pages Actions run and public project URL.
4. To roll back, revert the change on `main` and let the workflow publish that revision, or rerun the previous successful Pages deployment.
