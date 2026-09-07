---
title: How to Run End-to-End Tests
---

The Playwright suite in `e2e/` drives the real UI against a real Back-Office and a
real GraphDB. It covers business journeys; anything testable with Testing Library
stays in `src/**/*.spec.tsx` (see [How to run tests](../run-tests/)).

## Prerequisites

- Docker and Docker Compose
- Ports `3000`, `7200`, `8080`, `9000` free
- The **Bauhaus-Back-Office** repository cloned next to `Bauhaus`:

  ```shell
  git clone https://github.com/InseeFr/Bauhaus.git
  git clone https://github.com/InseeFr/Bauhaus-Back-Office.git
  ```

  The suite depends on that neighbouring checkout twice over: the Back-Office
  image is *built* from it, and the RDF fixtures are *read* from it. Point
  `BACK_OFFICE_HOME` elsewhere if your clone is not a sibling directory.

- Front-end dependencies installed (`pnpm install`) and Playwright dependencies
  installed in `e2e/`:

  ```shell
  pnpm install
  cd e2e && npm ci && npx playwright install --with-deps chromium
  ```

## 1. Bring up the stack

From the root of `Bauhaus`:

```shell
pnpm e2e:stack
```

The script (`scripts/e2e-stack.sh`) chains the three steps the suite needs, and
fails loudly on any of them:

1. `docker compose -f $BACK_OFFICE_HOME/module-bauhaus-bo/compose.yaml up -d` —
   GraphDB, minio and the Back-Office, the latter built from the neighbouring
   repository;
2. waits for GraphDB, then runs `e2e/playwright/db/init.sh` to load the test
   fixtures;
3. waits for `GET /api/healthcheck` to answer 200.

Steps 2 and 3 are in that order on purpose: the healthcheck answers 500 until
`init.sh` has created the `bauhaus` and `publication` repositories, so a freshly
composed stack is *not* healthy before the fixtures are loaded.

:::caution
`init.sh` is destructive: it deletes and recreates the `bauhaus` and
`publication` repositories. Everything it does before those deletions is a
check — it refuses to destroy anything it could not reload afterwards.
:::

### Environment variables

| Variable           | Default                   | Purpose                                       |
| ------------------ | ------------------------- | --------------------------------------------- |
| `BACK_OFFICE_HOME` | `../Bauhaus-Back-Office`  | Root of the Back-Office checkout               |
| `GRAPHDB_URL`      | `http://localhost:7200`   | GraphDB REST endpoint                          |
| `API_URL`          | `http://localhost:8080/api` | Back-Office API base URL                     |
| `STACK_TIMEOUT`    | `600`                     | Seconds to wait per service                    |

`BACK_OFFICE_HOME` is resolved to an absolute path before being handed to
`init.sh`, which is itself run from `e2e/` and uses `../../Bauhaus-Back-Office`
as its own default.

### How long it takes

Measured on a developer workstation on 2026-09-06:

| Phase                        | Cold (containers removed) | Warm (stack already up) |
| ---------------------------- | ------------------------- | ----------------------- |
| `docker compose up -d`       | 1 s                       | 0 s                     |
| GraphDB reachable            | 10 s                      | 0 s                     |
| Loading the fixtures         | 4 s                       | 3 s                     |
| Back-Office reachable        | 1 s                       | 0 s                     |
| **Total**                    | **16 s**                  | **3 s**                 |

Both figures assume the Back-Office image is already built. The very first run
also builds it — a full Maven reactor build inside Docker, around **2 min 20**.

Loading the fixtures is cheap despite their size (13 MB over 8 `.trig` files,
`sims-all.trig` alone accounting for 11 MB). If a run feels slow, the cost is in
the image build or in GraphDB starting up, not in the data.

## 2. Run the tests

```shell
pnpm --dir e2e test          # or: pnpm e2e
pnpm --dir e2e test smoke    # one directory only
```

Playwright starts the UI itself (`pnpm start`, via the `webServer` entry of
`playwright.config.ts`), so there is nothing to launch by hand. Useful options:

```shell
pnpm --dir e2e test --ui
pnpm --dir e2e test --headed
pnpm --dir e2e test --debug
pnpm --dir e2e report        # open the last HTML report
```

## Where the fixtures live

The RDF fixtures are **not** in this repository. They are the Back-Office
testcontainers fixtures, at
`$BACK_OFFICE_HOME/module-bauhaus-bo/src/test/resources/testcontainers/`, and
`init.sh` loads eight of them by name into the `bauhaus` repository.

Two consequences:

- **Renaming a `.trig` in the Back-Office breaks this suite.** `init.sh` checks
  all eight files (plus its own two `.ttl` repository configurations) *before*
  deleting anything, and stops with the list of missing files.
- **The content of the fixtures is pinned by a triple count.** `init.sh` compares
  the loaded size against `EXPECTED_TRIPLES` (79 287) and fails if it differs, so
  a truncated or replaced fixture cannot silently produce a partial dataset. After
  an intentional fixture change, regenerate the value with:

  ```shell
  curl -sf "http://localhost:7200/repositories/bauhaus/size"
  ```

## Continuous integration

`.github/workflows/playwright.yml` runs the same sequence on every pull request:
it checks the Back-Office out into `./bauhaus-back-office`, brings up the same
compose file, sets `BACK_OFFICE_HOME` and calls `init.sh`, then runs Playwright.
The HTML report is uploaded as a `playwright-report` artifact.

The workflow pins the Back-Office to the `4.21.0` branch. That pin is still
required: on the default branch, `compose/bauhaus-back.yaml` declares
`build: ../Dockerfile.bauhaus`, and the short form of `build` expects a build
*context*, not a Dockerfile — the compose step fails with "unable to prepare
context". Remove the `ref:` once the fix (`context: ../..` plus
`dockerfile: Dockerfile.bauhaus`) reaches the default branch.

## Conventions and known limitations

Both are documented next to the tests, in
[`e2e/README.md`](https://github.com/InseeFr/Bauhaus/blob/main/e2e/README.md):
which journeys are covered, the selector and test-data conventions to follow when
writing a new spec, and the product defects the suite currently works around.
