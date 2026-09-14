---
title: Seed a Local Colectica Repository
sidebar:
  order: 3
---

A fresh Colectica instance holds no `Group` and no `StudyUnit`, so the creation dialog of the Variables module has nothing to offer and no data file can be created. This guide populates a **development** repository from the series and operations already published in Bauhaus.

:::caution
This runs at every startup and **deprecates** the groups and study units it manages before recreating them. Never enable it against a shared or production Colectica instance.
:::

## Enable the initialisation

```yaml
fr.insee.rmes.bauhaus.colectica:
  init: true
```

Restart the backend. The seeding runs once, at startup, and logs its progress.

## What it does

1. Queries the **publication** GraphDB repository for series and their operations. Only *published* items are picked up, because their IRIs (`http://id.insee.fr/…`) are the ones the module matches against.
2. Deprecates the groups and study units derived from those series and operations — and only those. Every other item in the repository is left untouched.
3. Creates the `StudyUnit`s first. Order matters: if groups were created first, Colectica would auto-create empty study unit stubs at version 1, and `RegisterOrReplace` could not overwrite them.
4. For each group, creates an (initially empty) `CodeListScheme`, `CategoryScheme` and `ManagedRepresentationScheme`, the `LogicalProduct` filing them, then the group itself — with references to its study units — so the whole `Group → LogicalProduct → scheme` chain exists.

Identifiers are **deterministic**, derived from the series or operation IRI, so a second run targets exactly the same objects.

## What you get

Five variants are generated per series and per operation, labelled *Zoulou, Alpha, Mike, Bravo, Yankee* — deliberately not in alphabetical order, so that the alphabetical sorting of the listings has something to reorder. Each study unit variant also gets one physical instance, and each group variant an example of sentinel values (two categories, their codes, a sentinel code list and the `ManagedMissingValuesRepresentation` referencing it).

## Turn it off

```yaml
fr.insee.rmes.bauhaus.colectica:
  init: false
```

Leave it at `false` once your local repository is populated — otherwise every restart deprecates and recreates the seeded items, and any data file you attached to them ends up pointing at a deprecated parent.
