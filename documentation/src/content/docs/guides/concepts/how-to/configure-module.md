---
title: Configure Module Visibility
---

The `fr.insee.rmes.bauhaus.modules` property in your Spring Boot configuration controls which module tiles appear on the Bauhaus home page.

## Show only the Concepts module

```yaml
fr.insee.rmes.bauhaus:
  modules:
    - identifier: concepts
```

## Show multiple modules

```yaml
fr.insee.rmes.bauhaus:
  modules:
    - identifier: concepts
    - identifier: classifications
    - identifier: operations
```

## Hide a module

Remove it from the list. A module that is not declared has no tile on the home page,
its routes answer with an "under maintenance" message, and its REST controllers are
not loaded at all.
