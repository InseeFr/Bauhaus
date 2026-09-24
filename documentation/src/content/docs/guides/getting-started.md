---
title: Getting Started
---

By the end of this tutorial, you will have a fully working Bauhaus instance running locally, with a pre-configured admin user ready to use.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and Docker Compose (v2.24 or later)
- [Git](https://git-scm.com/)
- Ports `3000`, `7200`, `8080`, `8180`, `9000` and `9001` available on your machine

## 1. Clone the repositories

Clone both repositories into the same parent directory: the Back-Office image is
built from the neighbouring clone.

```shell
git clone https://github.com/InseeFr/Bauhaus.git
git clone https://github.com/InseeFr/Bauhaus-Back-Office.git
cd Bauhaus
```

## 2. Start the stack

The stack is described in `docker-compose.yml`, at the root of `Bauhaus`. It
starts in two stages, because the Back-Office refuses to start until its GraphDB
repositories exist.

First the infrastructure — GraphDB, MinIO (with a few test files) and Keycloak:

```shell
docker compose up -d graphdb minio minio-init keycloak
```

Then create the GraphDB repositories and load the sample data:

```shell
(cd e2e && ./playwright/db/init.sh)
```

The script ends with `Dépôt bauhaus : 79316 triplets chargés.` It is destructive:
it deletes and recreates the `bauhaus` and `publication` repositories.

Finally, build and start the Back-Office and the frontend:

```shell
docker compose up -d --build api front
```

The first run builds both images, which takes a few minutes.

## 3. Verify the application is running

Open [http://localhost:3000](http://localhost:3000) in your browser. You should see the Bauhaus login page.

Log in with the default admin account created automatically by Keycloak:

| Field    | Value                     |
| -------- | ------------------------- |
| Username | `admin`                   |
| Password | `admin123`                |
| Email    | `admin@bauhaus.fr`        |
| Role     | `Administrateur_RMESGNCS` |

Once logged in, the home page should display the available modules.

## Next steps

- [How to run the stack with Docker](../how-to/run-the-stack-with-docker/) — services, ports, the no-Keycloak mode, resetting the data and troubleshooting
- [Getting Started with Concepts](../getting-started-concepts/) — load sample data and explore the Concepts module
- [Architecture](../architecture/) — understand how the stack is structured
- [Roles & Permissions (RBAC)](../rbac/) — manage user access
- [How to run tests](../how-to/run-tests/)
- [How to build](../how-to/build/)
