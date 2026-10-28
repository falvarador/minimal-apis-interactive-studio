# Spec Delta

## Purpose

Publicar la aplicación estática del estudio en el sitio de proyecto de GitHub Pages y mantener sus recursos disponibles bajo la ruta del repositorio.

## ADDED Requirements

### Requirement: Repository-aware Pages assets
The production site SHALL be built for the GitHub Pages project path `/minimal-apis-interactive-studio/` so that application entry points and generated assets resolve when served from `https://falvarador.github.io/minimal-apis-interactive-studio/`.

#### Scenario: Load the deployed project site
- **WHEN** a visitor opens `https://falvarador.github.io/minimal-apis-interactive-studio/`
- **THEN** the Preact application loads successfully and its scripts, styles, and other generated assets resolve under the repository path

### Requirement: Automatic deployment from main
The repository SHALL publish a successful production build to GitHub Pages after changes are pushed to `main`. A failed dependency installation or build SHALL NOT replace the currently deployed site.

#### Scenario: Publish a successful main build
- **WHEN** a push to `main` completes dependency installation and the production build successfully
- **THEN** the generated static site is published to the repository's GitHub Pages site

#### Scenario: Do not deploy an unsuccessful build
- **WHEN** dependency installation or the production build fails
- **THEN** the deployment does not run and the workflow reports failure

### Requirement: On-demand deployment
An authorized maintainer SHALL be able to start the same production build and deployment workflow manually from `main` without pushing a new commit. Manual dispatch from another branch SHALL NOT publish to the production Pages site.

#### Scenario: Run deployment manually from main
- **WHEN** an authorized maintainer manually dispatches the workflow for `main`
- **THEN** it builds that revision and publishes the resulting static site only if the build succeeds

#### Scenario: Do not publish a non-main manual dispatch
- **WHEN** an authorized maintainer manually dispatches the workflow for a branch other than `main`
- **THEN** the production Pages site is not changed

### Requirement: Preserve client application behavior
Publishing the static site SHALL NOT introduce a server-side runtime or alter the existing browser application behavior.

#### Scenario: Use the deployed application
- **WHEN** a visitor interacts with the deployed course
- **THEN** the client-side application retains its existing functionality and simulations remain local to the browser
