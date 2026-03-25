---
title: Roles & Permissions (RBAC)
---

## Overview

Bauhaus uses a Role-Based Access Control (RBAC) system configured in `rbac.yml` on the back-office.
Each role grants a set of permissions on resources. Permissions are evaluated at the API level.

## Permission Values

| Value | Meaning |
|-------|---------|
| `ALL` | Action allowed on all objects regardless of ownership |
| `STAMP` | Action allowed only on objects owned by the authenticated user (stamped) |

## Resources

Resources follow the pattern `{domain}_{object}`. The Concepts module exposes two resources:

| Resource | Description |
|----------|-------------|
| `concept_concept` | Individual concepts |
| `concept_collection` | Collections of concepts |

## Roles

### `Administrateur_RMESGNCS`

Full access (`ALL`) on every resource and every action across all modules.

### `Utilisateur_RMESGNCS`

Read-only (`read: ALL`) on all resources. No write access anywhere.

### Concepts roles

| Role | `concept_concept` | `concept_collection` |
|------|-------------------|----------------------|
| `Proprietaire_concept_RMESGNCS` | create, read, update, delete, publish — ALL | create, read, update, delete, publish — ALL |
| `Gestionnaire_concept_RMESGNCS` | create/update/publish — STAMP, read — ALL | read — ALL |
| `Gestionnaire_ensemble_concepts_RMESGNCS` | create/update/publish — STAMP, read — ALL | read — ALL |
| `Proprietaire_collection_concepts_RMESGNCS` | read/delete — ALL | read/update/delete — ALL |

> `administration` on `concept_concept` is only granted to `Administrateur_RMESGNCS`.

### Other module roles (read-only on Concepts)

The following roles have `read: ALL` on both `concept_concept` and `concept_collection` but no write access:

- `Gestionnaire_structures_RMESGNCS`
- `Gestionnaire_serie_RMESGNCS`
- `Gestionnaire_liste_codes_RMESGNCS`
- `Gestionnaire_indicateur_RMESGNCS`
- `Gestionnaire_jeu_donnees_RMESGNCS`

## Actions per resource

### `concept_concept`

| Action | Description |
|--------|-------------|
| `create` | Create a new concept |
| `read` | Read concept data |
| `update` | Modify an existing concept |
| `delete` | Delete a concept |
| `publish` | Publish a concept (makes it visible externally) |
| `administration` | Access administration features (restricted to `Administrateur_RMESGNCS`) |

### `concept_collection`

| Action | Description |
|--------|-------------|
| `create` | Create a new collection |
| `read` | Read collection data |
| `update` | Modify an existing collection |
| `delete` | Delete a collection |
| `publish` | Publish a collection |

## Role assignment

Roles are assigned to users via the identity provider (Keycloak). The role names declared in `rbac.yml` must match the roles configured in Keycloak for the application client.

---

## Modifying the configuration

### File location

```
Bauhaus-Back-Office/module-bauhaus-bo/src/main/resources/rbac.yml
```

The file is loaded at startup via `spring.config.import` in `application.properties`. **A restart is required** for any change to take effect.

### Adding a new role

Add a new key under `rbac.config`. The key must exactly match the role name configured in Keycloak.

```yaml
rbac:
  config:
    Mon_Nouveau_Role:
      concept_concept:
        read: ALL
        create: STAMP
        update: STAMP
        publish: STAMP
      concept_collection:
        read: ALL
```

### Adding a new permission to an existing role

Locate the role and add the missing action under the relevant resource:

```yaml
Gestionnaire_concept_RMESGNCS:
  concept_collection:
    read: ALL
    create: STAMP   # added
    update: STAMP   # added
```

### Changing a strategy

Replace `ALL` with `STAMP` (or vice versa) for the targeted action:

```yaml
Proprietaire_concept_RMESGNCS:
  concept_concept:
    delete: STAMP   # was ALL, now restricted to owned objects
```

### Available modules and actions

The valid module keys and action names are defined as Java enums in the back-office source:

- **Modules** (`RBAC.Module`): `concept_concept`, `concept_collection`, `structure_structure`, `structure_component`, `operation_family`, `operation_series`, `operation_operation`, `operation_indicator`, `operation_sims`, `operation_document`, `classification_classification`, `classification_family`, `classification_series`, `dataset_dataset`, `dataset_distribution`, `codeslist_codeslist`, `codeslist_partialcodeslist`, `geography`, `ddi_physicalinstance`
- **Actions** (`RBAC.Privilege`): `create`, `read`, `update`, `delete`, `publish`, `administration`
- **Strategies** (`RBAC.Strategy`): `ALL`, `STAMP`

> Using an unknown module key or action will cause a binding error at application startup.

### Multi-role behaviour

When a user has multiple Keycloak roles, the **most restrictive strategy wins**:
`ALL` < `STAMP` < *(no permission)*

For example, if a user has both `Proprietaire_concept_RMESGNCS` (`delete: ALL`) and a hypothetical role with `delete: STAMP` on `concept_concept`, the effective strategy will be `STAMP`.

### Overriding for a specific environment

To use a different `rbac.yml` in a specific environment without modifying the packaged file, provide an external configuration location at startup:

```shell
java -jar bauhaus-back-office.jar \
  --spring.config.additional-location=file:/etc/bauhaus/rbac.yml
```

The external file takes precedence over the one bundled in the JAR.

### Testing changes

A dedicated test configuration is available at:

```
Bauhaus-Back-Office/module-bauhaus-bo/src/test/resources/testing-rbac.yml
```

Update it alongside `rbac.yml` to keep integration tests aligned with the production configuration.
