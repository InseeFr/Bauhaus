---
title: Getting Started
---

By the end of this tutorial, you will have a fully working Bauhaus instance running locally, with a pre-configured admin user ready to use.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and Docker Compose installed
- Ports `3000`, `8080`, `8081` available on your machine
- [Git](https://git-scm.com/)

## 1. Clone the repositories

Clone both repositories into the same parent directory:

```shell
git clone https://github.com/InseeFr/Bauhaus.git
git clone https://github.com/InseeFr/Bauhaus-Back-Office.git
```

## 2. Start the stack

From the `Bauhaus` directory, run:

```shell
docker compose up
```

This starts GraphDB, Bauhaus-Back-Office, Keycloak, and the Bauhaus frontend together.

## 3. Verify the application is running

Open [http://localhost:3000](http://localhost:3000) in your browser. You should see the Bauhaus login page.

Log in with the default admin account created automatically by Keycloak:

| Field    | Value                     |
|----------|---------------------------|
| Username | `admin`                   |
| Password | `admin123`                |
| Email    | `admin@bauhaus.fr`        |
| Role     | `Administrateur_RMESGNCS` |

Once logged in, the home page should display the available modules.

## Next steps

- [Getting Started with Concepts](../getting-started-concepts/) — load sample data and explore the Concepts module
- [Architecture](../architecture/) — understand how the stack is structured
- [Roles & Permissions (RBAC)](../rbac/) — manage user access
- [How to run tests](../how-to/run-tests/)
- [How to build](../how-to/build/)
