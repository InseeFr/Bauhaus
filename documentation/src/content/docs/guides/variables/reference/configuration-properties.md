---
title: Configuration Properties
sidebar:
  order: 2
---

Properties of the Variables module, set in the Bauhaus Back-Office Spring Boot configuration. Defaults are declared in `colectica.yml`.

## Module activation

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `fr.insee.rmes.bauhaus.modules[].identifier` | String | — | Add an entry with the identifier `ddi` for the module tile to appear |

## Colectica connection

Prefix: `fr.insee.rmes.bauhaus.colectica.server`

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `baseUrl` | String | — | Root URL of the Colectica server. Also the base of the token endpoint (`<baseUrl>/token/createtoken`) |
| `apiPath` | String | `/api/v1/` | Appended to `baseUrl` to form the API root |
| `defaultAgencyId` | String | `fr.insee` | Agency stamped on items created by Bauhaus; also sent to the frontend as a fallback |
| `authenticationMode` | String | `password` | `password` (Colectica credentials) or `token` (Keycloak bearer token). Any other value behaves as `password` |
| `username` | String | `${COLECTICA_USERNAME:}` | Used by `password` mode. Supply through the environment |
| `password` | String | `${COLECTICA_PASSWORD:}` | Used by `password` mode. Supply through the environment |
| `versionResponsibility` | String | `abcde` | Value written in the `VersionResponsibility` field of created items |
| `itemFormat` | UUID | `DC337820-AF3A-4C0B-82F9-CF02535CDE83` | Format identifier of the XML payload of an item |
| `itemTypes` | Map | see [DDI Item Types](/Bauhaus/guides/variables/reference/ddi-item-types/) | Colectica UUID of each DDI type, keyed by type name |

In `token` mode the credentials come from the Keycloak `colecticarealm` (`fr.insee.rmes.bauhaus.keycloak.colecticarealm.*`), not from this block.

## Languages

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `fr.insee.rmes.bauhaus.colectica.langs` | List&lt;String&gt; | `[fr-FR, en-GB]` | Supported language tags. Must match `xx-XX`; an invalid or empty list stops the application at startup. The first entry is the default locale used by the interface |

## Mutualized code lists

Prefix: `fr.insee.rmes.bauhaus.colectica`

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `mutualized-codes-strategy` | Enum | `package-walk` | `package-walk` (traverse the root package) or `configured-groups` (query the listed groups directly) |
| `mutualized-codes-package.agency-id` | String | — | Agency of the root package. Read only by `package-walk` |
| `mutualized-codes-package.identifier` | UUID | — | Identifier of the root package. Absent ⇒ no mutualized code list |
| `mutualized-codes-package.version` | Integer | — | Version of the root package |
| `mutualized-codes-groups[].agency-id` | String | `defaultAgencyId` | Agency of a code list group. Read only by `configured-groups`; blank falls back to the instance's default agency |
| `mutualized-codes-groups[].identifier` | UUID | — | Identifier of the code list group |
| `mutualized-codes-groups[].version` | Integer | — | Accepted for symmetry; the relationship query is not versioned and ignores it |

## Caching

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `fr.insee.rmes.bauhaus.colectica.mutualized-codes-cache-ttl` | Duration | `24h` | `expireAfterWrite` applied to all three Colectica cache regions. Spring `Duration` format (`24h`, `30m`, `90s`) |
| `fr.insee.rmes.bauhaus.colectica.cache-warmup-enabled` | Boolean | `true` | Pre-load the caches at startup. Non-blocking and fault-tolerant |

## Operations mirror

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `fr.insee.rmes.bauhaus.colectica.operations-mirror.enabled` | Boolean | `false` | Mirror every series and operation saved in the RDF repository onto its `Group` and `StudyUnit`. Synchronous and blocking. See [Operations Mirror Mapping](/Bauhaus/guides/variables/reference/operations-mirror-mapping/) |

## Local development

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `fr.insee.rmes.bauhaus.colectica.init` | Boolean | `false` | Seed the repository from the published series and operations at startup. **Development only**, and not meant to run alongside the operations mirror — see [Seed a Local Colectica Repository](/Bauhaus/guides/variables/how-to/seed-a-local-repository/) |
| `fr.insee.rmes.bauhaus.enable-dev-tools` | Boolean | `false` | Enables the in-page developer tools, including the DDI 4 inspectors |

## Access control

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `rbac.config.<role>.ddi_physicalinstance.<privilege>` | Enum | `NONE` | `ALL`, `STAMP` or `NONE` on `create`, `read`, `update`, `delete`, `publish`. See [Grant Access](/Bauhaus/guides/variables/how-to/grant-access/) |

## Obsolete

| Property | Status |
|----------|--------|
| `fr.insee.rmes.bauhaus.colectica.server.token` | Still present in `colectica.yml`, but never bound. In `token` mode the bearer token comes from Keycloak |
