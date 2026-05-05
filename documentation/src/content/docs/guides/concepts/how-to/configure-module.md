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

## Mark a module as under maintenance

Set `disabled: true` to keep the tile visible but block access with an "under maintenance" message:

```yaml
fr.insee.rmes.bauhaus:
  modules:
    - identifier: concepts
    - identifier: classifications
      disabled: true
```

`disabled: false` is the default and can be omitted.
