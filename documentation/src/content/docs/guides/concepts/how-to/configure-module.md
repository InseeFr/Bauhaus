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

Remove it from the list. A module that is not declared has no tile on the home page and
its REST controllers are not loaded at all. On the front end its home page answers with
an "under maintenance" message, and none of its other pages is reachable: their routes
are not declared, so a deep link answers "page not found" without ever downloading the
module code.
