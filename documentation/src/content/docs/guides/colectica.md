---
title: Colectica — API Reference
---

This page documents the API calls exchanged between the Bauhaus Back-Office and Colectica Repository for each operation in the Variables module.

See [Overview](./variables/explanation/overview/) for context on why Colectica is used, and [Configure the Mock Server](./variables/how-to/configure-mock-server/) to run without a real Colectica instance.

## Physical Instance Operations

### List all physical instances

**Bauhaus API:**
```http
GET {{API_BASE_URL}}/ddi/physical-instance
```

**Colectica API:**
```http
POST {{COLECTICA_URL}}/api/v1/_query
Content-Type: application/json

{
  "itemTypes": ["a51e85bb-6259-4488-8df2-f08cb43485f8"],
  "searchLatestVersion": true
}
```

- `a51e85bb-6259-4488-8df2-f08cb43485f8` — DDI UUID for the Physical Instance type
- `searchLatestVersion: true` — returns only the latest version of each item

---

### Get a specific physical instance

**Bauhaus API:**
```http
GET {{API_BASE_URL}}/ddi/physical-instance/{agency}/{identifier}
```

**Colectica API:**
```http
GET {{COLECTICA_URL}}/api/v1/ddiset/{agency}/{identifier}
```

---

### Create or update a physical instance

**Bauhaus API:**
```http
POST {{API_BASE_URL}}/ddi/physical-instance
PUT  {{API_BASE_URL}}/ddi/physical-instance
```

**Colectica API:**
```http
POST {{COLECTICA_URL}}/api/v1/item
Content-Type: application/json
```

**Request body:**
```json
{
  "Items": [
    {
      "ItemType": "4bd6eef6-99df-40e6-9b11-5b8f64e5cb23",
      "AgencyId": "fr.insee",
      "Version": 2,
      "Identifier": "586a6306-c67d-4fda-a0ce-7e96564bda58",
      "Item": "<Fragment xmlns:r=\"ddi:reusable:3_3\" xmlns=\"ddi:instance:3_3\">...</Fragment>",
      "VersionDate": "2019-05-13T12:51:36.9134615Z",
      "VersionResponsibility": "acy5r8",
      "IsPublished": false,
      "IsDeprecated": false,
      "IsProvisional": false,
      "ItemFormat": "DC337820-AF3A-4C0B-82F9-CF02535CDE83"
    }
  ],
  "options": {
    "namedOptions": ["RegisterOrReplace"]
  }
}
```

**Field reference:**

| Field | Type | Description |
|-------|------|-------------|
| `ItemType` | UUID | DDI item type (see table below) |
| `AgencyId` | String | Responsible organisation (e.g. `fr.insee`) |
| `Version` | Integer | Version number |
| `Identifier` | UUID | Unique item identifier |
| `Item` | XML String | DDI-compliant XML fragment |
| `VersionDate` | ISO DateTime | Timestamp of this version |
| `VersionResponsibility` | String | User ID of the author |
| `IsPublished` | Boolean | Publication status |
| `IsDeprecated` | Boolean | Deprecation flag |
| `IsProvisional` | Boolean | Provisional status |
| `ItemFormat` | UUID | Format identifier for the XML content |

`RegisterOrReplace`: replaces the item if it already exists, otherwise creates it.

**Example XML fragment:**
```xml
<Fragment xmlns:r="ddi:reusable:3_3" xmlns="ddi:instance:3_3">
  <Group isUniversallyUnique="true" versionDate="2019-05-13T12:51:36.9134615Z" xmlns="ddi:group:3_3">
    <r:URN>urn:ddi:fr.insee:586a6306-c67d-4fda-a0ce-7e96564bda58:1</r:URN>
    <r:Agency>fr.insee</r:Agency>
    <r:ID>586a6306-c67d-4fda-a0ce-7e96564bda58</r:ID>
    <r:Version>1</r:Version>
    <r:Citation>
      <r:Title>
        <r:String xml:lang="en-IE">Household budget survey</r:String>
        <r:String xml:lang="fr-FR">Enquête Budget de famille</r:String>
      </r:Title>
    </r:Citation>
  </Group>
</Fragment>
```

---

## DDI Item Types

| Item Type | UUID |
|-----------|------|
| Physical Instance | `a51e85bb-6259-4488-8df2-f08cb43485f8` |
| Group | `4bd6eef6-99df-40e6-9b11-5b8f64e5cb23` |

## External resources

- [DDI Alliance](https://ddialliance.org/) — DDI standards documentation
- [DDI Lifecycle 3.3 Specification](https://ddialliance.org/Specification/DDI-Lifecycle/3.3/) — XML structure reference
- [Colectica Documentation](https://www.colectica.com/documentation) — Colectica-specific guides
