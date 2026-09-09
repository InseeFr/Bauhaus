---
title: Grant Access to the Variables Module
sidebar:
  order: 4
---

Access to the module is granted per role in `rbac.yml`, under the module key `ddi_physicalinstance`. This guide covers the usual cases; see [Roles & Permissions](/Bauhaus/guides/rbac/) for the general semantics of `ALL`, `STAMP` and omitted privileges.

## Grant full access to a role

```yaml
rbac:
  config:
    Administrateur_RMESGNCS:
      ddi_physicalinstance:
        create: ALL
        read: ALL
        update: ALL
        delete: ALL
        publish: ALL
```

`ALL` still requires the user's token to carry a stamp for write actions.

## Grant access limited to the user's own series

```yaml
rbac:
  config:
    Gestionnaire_variables_RMESGNCS:
      ddi_physicalinstance:
        create: STAMP
        read: STAMP
        update: STAMP
        delete: STAMP
        publish: STAMP
```

Under `STAMP`, a user sees and edits only the data files whose parent group points at a series they created. Concretely:

- `GET /ddi/physical-instance`, `GET /ddi/physical-instance/search` and `GET /ddi/group` return filtered lists
- `POST /ddi/physical-instance` is checked against the group named in the request body

See [Access Control](/Bauhaus/guides/variables/explanation/access-control/) for how that ownership is resolved.

## Grant read-only access

Omit every privilege you do not want to grant — anything not listed is denied:

```yaml
rbac:
  config:
    Lecteur_RMESGNCS:
      ddi_physicalinstance:
        read: ALL
```

The interface adapts on its own: the create button disappears when the `CREATE` strategy is `NONE`.

## Check what a user actually has

The frontend reads the current user's privileges from the API; the quickest check is to log in and look at the module. To inspect the configuration itself, look for the role name in `rbac.yml` — a role with no `ddi_physicalinstance` block has no access to the module at all, and the **Variables** tile stays out of reach.

## Roles shipped by default

| Role | Strategy on every privilege |
|------|------------------------------|
| `Gestionnaire_variables_RMESGNCS` | `STAMP` |
| `Betatest_OeDDIp_RMESGNCS` | `ALL` |
| `Administrateur_RMESGNCS` | `ALL` |
