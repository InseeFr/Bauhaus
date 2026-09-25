---
title: How to Run the Stack with Docker
---

The whole Bauhaus stack — GraphDB, MinIO, Keycloak, the Back-Office and the
frontend — is described once, in `docker-compose.yml` at the root of `Bauhaus`.
The Back-Office repository has no compose file of its own: its image is built
from the neighbouring clone.

For a first run, follow the [Getting Started](../../getting-started/) tutorial.
This page is the reference behind it.

## Prerequisites

- Docker and Docker Compose **v2.24 or later** (the e2e override uses the
  `!reset` tag)
- `Bauhaus` and `Bauhaus-Back-Office` cloned side by side, or `BACK_OFFICE_HOME`
  set (see [Variables](#variables))

## Services

| Service      | Port(s)        | Role                                                                                |
| ------------ | -------------- | ----------------------------------------------------------------------------------- |
| `graphdb`    | `7200`         | RDF triplestore, repositories `bauhaus` (management) and `publication`              |
| `minio`      | `9000`, `9001` | Document storage (S3 API on `9000`, console on `9001`, `minioadmin` / `minioadmin`) |
| `minio-init` | —              | One-shot: creates the `bauhaus` bucket and uploads the test files, then exits       |
| `keycloak`   | `8180`         | OIDC provider, realm `bauhaus`, user `admin` / `admin123`                           |
| `api`        | `8080`         | Bauhaus-Back-Office, built from `BACK_OFFICE_HOME`, served under `/api`             |
| `front`      | `3000`         | The Bauhaus UI, built from this repository                                          |

Definitions live in `containers/*.yml`, included by `docker-compose.yml`.

## Start the full stack

From the root of `Bauhaus`:

```shell
docker compose up -d graphdb minio minio-init keycloak
(cd e2e && ./playwright/db/init.sh)
docker compose up -d --build api front
```

The order matters. The Back-Office runs start-up checks against GraphDB and
exits when its repositories are missing, and nothing in the compose file creates
them: `e2e/playwright/db/init.sh` does, and loads the test data at the same
time. A plain `docker compose up` on an empty GraphDB therefore leaves `api`
stopped.

Then open [http://localhost:3000](http://localhost:3000) and log in as `admin` /
`admin123`.

:::caution
`init.sh` is destructive: it deletes and recreates the `bauhaus` and
`publication` repositories. It refuses to delete anything if one of its data
files is missing.
:::

## Run without Keycloak

The Playwright suite, and day-to-day frontend work, use the Back-Office in its
`NoAuth` mode: no token is required and every request runs as a fake ADMIN user.
The override `e2e/compose.e2e.yaml` switches `api` to that mode and stops it
from waiting for Keycloak.

One command brings that stack up, in the right order:

```shell
pnpm e2e:stack
```

It starts `graphdb`, `minio` and `minio-init`, runs `init.sh`, rebuilds and
starts `api`, then waits for `GET /api/healthcheck` to answer 200. Keycloak and
the `front` container are not started: run the UI with `pnpm start`, or the
tests with `pnpm e2e`. See [How to run end-to-end tests](../run-e2e-tests/).

To run the same stack by hand:

```shell
docker compose -f docker-compose.yml -f e2e/compose.e2e.yaml up -d graphdb minio minio-init
(cd e2e && ./playwright/db/init.sh)
docker compose -f docker-compose.yml -f e2e/compose.e2e.yaml up -d --build api
```

## Run the Back-Office from your IDE

Start only its dependencies, and load the data:

```shell
docker compose up -d graphdb minio minio-init
(cd e2e && ./playwright/db/init.sh)
```

Then run the Back-Office from `Bauhaus-Back-Office/module-bauhaus-bo`, as its
README explains. It reads `config/bauhaus-local-dev.properties`, which points to
`localhost:7200` and `localhost:9000`.

## Variables

| Variable           | Default                                  | Purpose                          |
| ------------------ | ---------------------------------------- | -------------------------------- |
| `BACK_OFFICE_HOME` | `Bauhaus-Back-Office`, next to `Bauhaus` | Root of the Back-Office checkout |

Set `BACK_OFFICE_HOME` to an **absolute** path when the Back-Office is not cloned
next to `Bauhaus`: each compose file reads a relative path from its own
directory, and `init.sh` from `e2e/`.

```shell
export BACK_OFFICE_HOME=/path/to/Bauhaus-Back-Office
```

The `api` container mounts
`$BACK_OFFICE_HOME/module-bauhaus-bo/config/bauhaus-local-dev.properties`, and
`containers/api.yml` overrides the values that must differ inside Docker (service
host names, storage paths, authentication).

## Test documents

`minio-init` uploads the files of `containers/minio-seed/` into the `bauhaus`
bucket. They match three documents of the test data:

| Document | File                            |
| -------- | ------------------------------- |
| 66       | `Notaires_m3_2p_juin2019.pdf`   |
| 593      | `Methodologie_DADS_2012.pdf`    |
| 1070     | `Doc_Estimations_emploi_fr.pdf` |

They can be downloaded from the UI, or with
`GET /api/documents/document/{id}/file`. The other documents of the test data
have no file in MinIO.

`minio-init` can be run again at any time (`docker compose up minio-init`): the
bucket is only created when missing, and the files are overwritten.

## Pick up Back-Office changes

`docker compose up` reuses an image that already exists: without `--build`, the
stack keeps running an old Back-Office. After pulling or switching branches in
`Bauhaus-Back-Office`:

```shell
docker compose up -d --build api
```

The rebuild is a full Maven build inside Docker (around 2 minutes 20) when the
Back-Office sources changed, and near-instant otherwise. `pnpm e2e:stack` always
passes `--build`.

## Stop and reset

```shell
docker compose stop      # stop, keep the containers and the data
docker compose down      # remove the containers, keep the volumes
docker compose down -v   # also remove the GraphDB and MinIO volumes
```

After `down -v`, start again from [Start the full stack](#start-the-full-stack):
the repositories and the bucket are recreated.

## Troubleshooting

**`minio` exits with `Unknown xl meta version 3`.** The `minio-data` volume was
created by an older version of this file, which used `minio/minio:latest`, a
newer MinIO than the pinned one. Remove the volume; `minio-init` refills it:

```shell
docker compose rm -sf minio
docker volume rm bauhaus_minio-data
```

**`api` exits right after starting.** Read its logs with
`docker compose logs api`. On an empty GraphDB, the start-up checks fail: run
`init.sh`, then `docker compose up -d api`.

**`/api/healthcheck` answers 500.** The GraphDB repositories do not exist yet:
run `init.sh`.

**A new endpoint answers 404.** The Back-Office image is older than the code:
rebuild it with `docker compose up -d --build api`.

**Docker warns about orphan containers** (`bauhaus-bauhaus-back-1`). They come
from the compose file the Back-Office used to have. Remove them with
`docker compose up -d --remove-orphans`, unless you run other containers under
the `bauhaus` project name yourself.
