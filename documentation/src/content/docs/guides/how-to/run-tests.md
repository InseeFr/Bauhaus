---
title: How to Run Tests
---

## Run unit tests in watch mode

```shell
pnpm test
```

Runs the test watcher interactively. By default, only tests related to files changed since the last commit are executed.

## Generate a coverage report

```shell
pnpm test:coverage
```

Produces a full local HTML report at `Bauhaus/coverage/lcov-report/index.html`.

## CI

Unit tests run automatically on every `git push` via a pre-push hook.

## End-to-end tests

The Playwright suite needs a running stack (GraphDB, minio, Back-Office) and is
launched separately — see [How to run end-to-end tests](../run-e2e-tests/).

```shell
pnpm e2e:stack   # bring the stack up and load the fixtures
pnpm e2e         # run the suite
```
