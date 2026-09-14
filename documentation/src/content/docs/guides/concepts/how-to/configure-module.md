---
title: Configure Module Visibility
---

The `fr.insee.rmes.bauhaus.modules` property in your Spring Boot configuration controls which
modules the application serves, and how each of them shows up. Modules are declared **by
identifier**, so every setting is addressable on its own — including from a single environment
variable in production.

```yaml
fr.insee.rmes.bauhaus:
  modules:
    concepts: {}
    classifications: {}
    operations: {}
    structures: {}
    codelists: {}
    datasets: {}
    ddi: {}
```

## Three flags per module

| Flag             | Default | Effect when false                                            |
| ---------------- | ------- | ------------------------------------------------------------ |
| `enabled`        | `true`  | The module does not exist: no REST controller, no route, no tile. |
| `show`           | see below | No tile on the home page.                                  |
| `direct-access`  | see below | The module pages cannot be reached.                        |

`show` and `direct-access` are both optional, and **the one you leave out is deduced from the
one you write**, so a minimal declaration already says everything:

| Declared               | show    | direct-access | Result                                  |
| ---------------------- | ------- | ------------- | --------------------------------------- |
| nothing                | `true`  | `true`        | fully open module                       |
| `show: true`           | `true`  | `true`        | same                                    |
| `show: false`          | `false` | `false`       | closed module, REST API still served    |
| `direct-access: false` | `true`  | `false`       | tile shown, pages under maintenance     |
| `direct-access: true`  | `false` | `true`        | module hidden, still reachable by link  |
| `enabled: false`       | `false` | `false`       | module absent, REST API included        |

Access follows the tile, and writing `direct-access` on its own is only worth it for the
setting the tile does not already give — hence the opposite value.

A closed module answers with an "under maintenance" message on its home page, and none of its
other pages is reachable: their routes are not declared, so a deep link answers "page not
found" without ever downloading the module code.

```yaml
fr.insee.rmes.bauhaus:
  modules:
    concepts: {} # visible and open
    classifications:
      show: false # no tile, no page, REST API still served
    operations:
      direct-access: false # tile shown, pages under maintenance
    structures:
      direct-access: true # no tile, pages still reachable by link
    ddi:
      enabled: false # nothing at all, REST API included
```

## Overriding in production

Each flag has its own key, so a deployment overrides exactly what it needs — no index, and
nothing to restate:

```sh
FR_INSEE_RMES_BAUHAUS_MODULES_CLASSIFICATIONS_SHOW=false
FR_INSEE_RMES_BAUHAUS_MODULES_OPERATIONS_DIRECT_ACCESS=false
FR_INSEE_RMES_BAUHAUS_MODULES_DDI_ENABLED=false
```

Two consequences of this shape are worth knowing:

- **Turn a module off with `enabled: false`, do not delete it from the list.** Maps are merged
  across property sources, so an environment variable can never remove a key declared in
  `bauhaus.yml` — only override its flags.
- **Tiles appear in declaration order**, the order of `bauhaus.yml`. Declaring a module from an
  environment variable alone appends it in an unspecified position.
