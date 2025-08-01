---
title: Git Branch Management Strategy
---

In this project, we follow a structured Git branching strategy to manage versions, production stability, and parallel development efficiently.

🔵 `main` is the Production Branch

The `main` branch always reflects what is currently in production.

- It must **never contain the `-RC` (Release Candidate)** suffix in its version number.
- Only stable, production-ready code is merged into `main`.

## One Branch per Version

For each upcoming version, we create a **dedicated branch** named after the version number (e.g., `v1.2.0`), and we **immediately open a draft Pull Request (PR)** for it.  
This allows early visibility on the scope and progress of the release.

## Post-Production Deployment

After deploying the `main` branch to production:

- We deploy the branch of the **next version** (with the `-rc` suffix) to a pre-prod or staging environment.
- This is done **without merging the version branch into `main`**.

This ensures that if any hotfixes are needed in production, they can be made **directly on `main`** and deployed without delay.

## Feature Development

All development work for a given version must be done through **dedicated PRs targeting the version branch** (not `main`).

This keeps version development isolated and avoids affecting production.

## Rebasing After Merges

Once a version branch is merged into `main`:

- Don’t forget to **rebase any ongoing version branches** or feature branches.
- This ensures everything remains in sync with the latest production code.
