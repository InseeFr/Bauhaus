---
title: Colectica API Reference
sidebar:
  order: 4
---

The calls the Bauhaus Back-Office makes to Colectica Repository. All of them go through `colectica-client`, the SDK that owns the only HTTP client to Colectica and handles authentication — application code never deals with tokens.

Paths below are relative to the API root, `<baseUrl><apiPath>` (by default `https://…/api/v1/`). The token endpoint is the exception: it sits on the server root.

## Authentication

```http
POST {{COLECTICA_URL}}/token/createtoken
Content-Type: application/json

{ "username": "…", "password": "…" }
```

The returned access token is cached in memory and sent as `Authorization: Bearer …` on every call. On a `401` or `403` the client invalidates it, obtains a fresh one, and retries the call **once**.

In `token` authentication mode this endpoint is not used: the bearer token is fetched from Keycloak instead — see [Connect to a Colectica Repository](/Bauhaus/guides/variables/how-to/connect-to-colectica/).

## Searching by type

```http
POST {{COLECTICA_URL}}/api/v1/_query
Content-Type: application/json

{ "itemTypes": ["a51e85bb-6259-4488-8df2-f08cb43485f8"], "searchLatestVersion": true }
```

Returns the latest version of every item of the given types. Used to list groups and study units.

```http
POST {{COLECTICA_URL}}/api/v1/_query/advanced
Content-Type: application/json

{ "itemTypes": ["…"], "searchLatestVersion": true, "resultsIncludeAll": true }
```

Same search, but `resultsIncludeAll` asks Colectica for the rich per-item property bags — notably `DateProperties.versionDate`, which the plain `_query` does not return. Used to list physical instances with their modification date.

## Fetching items

```http
GET {{COLECTICA_URL}}/api/v1/item/{agency}/{id}
GET {{COLECTICA_URL}}/api/v1/item/{agency}/{id}/{version}
```

One item, with its DDI 3.3 XML in the `Item` field. Without a version, the latest is returned.

```http
POST {{COLECTICA_URL}}/api/v1/item/_getList
Content-Type: application/json

{ "identifiers": [ { "agencyId": "fr.insee", "identifier": "586a…", "version": 3 } ] }
```

Batch fetch of full items. This is the second half of every set read.

## Reading a whole object graph

```http
GET {{COLECTICA_URL}}/api/v1/set/{agency}/{id}
GET {{COLECTICA_URL}}/api/v1/set/{agency}/{id}/{version}
```

Returns the **references** of every item reachable from the root — not their content. Bauhaus then feeds those references to `item/_getList`. Reading a physical instance is exactly this two-step: `set/` then `_getList`.

```http
GET {{COLECTICA_URL}}/api/v1/ddiset/{agency}/{id}
```

Returns the complete DDI set as a single document. Used for groups. The response is read as raw bytes and decoded as UTF-8 explicitly, because Colectica omits the charset and the default would be ISO-8859-1.

## Navigating relationships

```http
POST {{COLECTICA_URL}}/api/v1/_query/relationship/bysubject/descriptions
POST {{COLECTICA_URL}}/api/v1/_query/relationship/byobject/descriptions
Content-Type: application/json

{
  "itemTypes": ["8b108ef8-b642-4484-9c49-f88e4bf7cf1d"],
  "targetItem": { "agencyId": "fr.insee", "identifier": "6755…" }
}
```

| Direction | Meaning | Used for |
|-----------|---------|----------|
| `bysubject` | Items the target references — its children | Walking down `Group → LogicalProduct → scheme → item` |
| `byobject` | Items that reference the target — its parents | Answering "who uses this code list / category / sentinel representation?" |

`itemTypes` filters **server-side**, so the response carries only the references that matter. This is the cheap alternative to downloading a whole `set/` just to read each item's type. The response also carries the items' `ItemName` and `Label` dictionaries, which spares a separate label query.

## Writing

```http
POST {{COLECTICA_URL}}/api/v1/item
Content-Type: application/json

{
  "Items": [
    {
      "ItemType": "a51e85bb-6259-4488-8df2-f08cb43485f8",
      "AgencyId": "fr.insee",
      "Version": 2,
      "Identifier": "586a6306-c67d-4fda-a0ce-7e96564bda58",
      "Item": "<Fragment xmlns:r=\"ddi:reusable:3_3\" xmlns=\"ddi:instance:3_3\">…</Fragment>",
      "VersionDate": "2026-05-13T12:51:36.9134615Z",
      "VersionResponsibility": "abcde",
      "IsPublished": false,
      "IsDeprecated": false,
      "IsProvisional": false,
      "ItemFormat": "DC337820-AF3A-4C0B-82F9-CF02535CDE83"
    }
  ],
  "options": { "namedOptions": ["RegisterOrReplace"] }
}
```

| Field | Type | Description |
|-------|------|-------------|
| `ItemType` | UUID | DDI type — see [DDI Item Types](/Bauhaus/guides/variables/reference/ddi-item-types/) |
| `AgencyId` | String | Responsible organisation, `fr.insee` by default |
| `Version` | Integer | Version number |
| `Identifier` | UUID | Item identifier |
| `Item` | XML String | The DDI 3.3 fragment |
| `VersionDate` | ISO DateTime | Stamped by Bauhaus — Colectica does not fill it in |
| `VersionResponsibility` | String | From `server.versionResponsibility` |
| `IsPublished` / `IsDeprecated` / `IsProvisional` | Boolean | Item state flags |
| `ItemFormat` | UUID | Format of the `Item` payload |

`RegisterOrReplace` replaces the item when it already exists and creates it otherwise. **A save sends one request** carrying every item it touches — the physical instance, its variables, the code lists and categories, the schemes that had to be provisioned — so the write is atomic.

```http
POST {{COLECTICA_URL}}/api/v1/item/_updateState
Content-Type: application/json

{
  "ids": [ { "agencyId": "fr.insee", "identifier": "…", "version": 1 } ],
  "state": true,
  "applyToAllVersions": true
}
```

Sets an item's state — used to deprecate the groups and study units of a local seeding run.

## An example fragment

```xml
<Fragment xmlns:r="ddi:reusable:3_3" xmlns="ddi:instance:3_3">
  <Group isUniversallyUnique="true" versionDate="2026-05-13T12:51:36.9134615Z" xmlns="ddi:group:3_3">
    <r:URN>urn:ddi:fr.insee:586a6306-c67d-4fda-a0ce-7e96564bda58:1</r:URN>
    <r:Agency>fr.insee</r:Agency>
    <r:ID>586a6306-c67d-4fda-a0ce-7e96564bda58</r:ID>
    <r:Version>1</r:Version>
    <r:Citation>
      <r:Title>
        <r:String xml:lang="en-GB">Household budget survey</r:String>
        <r:String xml:lang="fr-FR">Enquête Budget de famille</r:String>
      </r:Title>
    </r:Citation>
  </Group>
</Fragment>
```

## External resources

- [DDI Alliance](https://ddialliance.org/) — the standards
- [DDI Lifecycle 3.3 Specification](https://ddialliance.org/Specification/DDI-Lifecycle/3.3/) — the XML structure
- [Colectica Documentation](https://www.colectica.com/documentation) — Colectica-specific guides
