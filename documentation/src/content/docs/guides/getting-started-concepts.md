---
title: Getting Started with Concepts
---

## Overview

<!-- TODO: Describe the Concepts module purpose, its role in the statistical metadata lifecycle, and the key business objects (Concept, Collection). -->

## Prerequisites

<!-- TODO: List required tools, versions (Java, Node, pnpm, Docker), and external services (Bauhaus-Back-Office, GraphDB, Keycloak). -->

Override the `fr.insee.rmes.bauhaus.modules` property in your Spring Boot configuration file to control which modules appear on the home page and their availability:

- Each entry in the list adds a tile on the home page.
- `disabled: false` (default) — the module is fully accessible.
- `disabled: true` — the tile is shown but clicking it displays an "under maintenance" message.

To show only the Concepts module on the home page:

```yaml
fr.insee.rmes.bauhaus:
  modules:
    - identifier: concepts
```

To show the Concepts module alongside others but mark some as under maintenance:

```yaml
fr.insee.rmes.bauhaus:
  modules:
    - identifier: concepts
    - identifier: classifications
      disabled: true
```

## Required Roles

See the [Roles & Permissions (RBAC)](./rbac) guide for the full role matrix.

Roles relevant to the Concepts module:

| Role | Access level |
|------|-------------|
| `Administrateur_RMESGNCS` | Full access on concepts and collections |
| `Proprietaire_concept_RMESGNCS` | Full CRUD + publish on concepts and collections |
| `Gestionnaire_concept_RMESGNCS` | Create/update/publish own concepts (STAMP), read all |
| `Gestionnaire_ensemble_concepts_RMESGNCS` | Same as `Gestionnaire_concept_RMESGNCS` |
| `Proprietaire_collection_concepts_RMESGNCS` | Manage collections, read/delete concepts |
| `Utilisateur_RMESGNCS` | Read-only |

## Data Model

<!-- TODO: Describe the RDF data model for Concepts and Collections, the target GraphDB graph (`concepts/definitions`), and the key SPARQL properties. -->

## Sample Data

A sample TriG file containing pre-populated Concepts and Collections is available for download:

**[Download concepts-collections.trig](/Bauhaus/concepts-collections.trig)**

This file can be imported directly into GraphDB to bootstrap a local environment with test data. To do so:

1. Open your GraphDB instance and navigate to **Import → RDF**
2. Upload the downloaded `.trig` file
3. Select the repository and confirm the import

## API Endpoints

<!-- TODO: List the main REST endpoints exposed by the Concepts module with their expected inputs/outputs. Link to the Swagger/OpenAPI spec once available. -->

## Running Locally

<!-- TODO: Describe how to start the full stack locally (GraphDB + Bauhaus-Back-Office + Bauhaus front) for the Concepts module. A docker-compose example would go here. -->

## Running the Tests

<!-- TODO: Explain how to run unit tests and integration tests scoped to the Concepts module, both on the frontend and the backend. -->
