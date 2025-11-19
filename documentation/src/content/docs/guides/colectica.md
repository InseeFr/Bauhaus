---
title: Colectica Integration
---

## Overview

The DDI module in Bauhaus interacts with **Colectica Repository**, a platform for managing DDI (Data Documentation Initiative) metadata. Colectica Repository provides comprehensive metadata management capabilities for survey and statistical data.

## Colectica Repository

Colectica Repository is an external system that stores and manages DDI metadata. The Bauhaus DDI module communicates with Colectica Repository via its REST API to:

- Create and manage physical instances
- Store DDI-compliant metadata
- Query and retrieve metadata objects
- Maintain versioning and provenance information

For more information about Colectica Repository, visit [Colectica's official documentation](https://www.colectica.com/).

## Development Mode: Mock Server

To facilitate development and testing without requiring a full Colectica Repository installation, Bauhaus provides a mock server that simulates the Colectica API.

### Enabling Mock Server

The mock server can be enabled via the Bauhaus Back-Office configuration properties:

```properties
# Enable Colectica mock server
fr.insee.rmes.bauhaus.colectica.mock-server-enabled=true

# Mock server base URI
fr.insee.rmes.bauhaus.colectica.baseURI=http://localhost:8080/api/colectica
```

### Configuration Properties

| Property | Description | Example Value |
|----------|-------------|---------------|
| `fr.insee.rmes.bauhaus.colectica.mock-server-enabled` | Enable/disable the mock server | `true` or `false` |
| `fr.insee.rmes.bauhaus.colectica.baseURI` | Base URI for Colectica API endpoints | `http://localhost:8080/api/colectica` |

### Development Workflow

When the mock server is enabled:

1. **No External Dependencies**: You don't need to install or configure a Colectica Repository instance
2. **API Simulation**: The Bauhaus Back-Office will respond to Colectica API calls with simulated data
3. **Rapid Development**: Developers can work on the DDI module features without external system dependencies
4. **Testing**: Automated tests can run against the mock server for consistent, reproducible results

### Production Configuration

For production environments, disable the mock server and configure the actual Colectica Repository endpoint:

```properties
# Disable mock server for production
fr.insee.rmes.bauhaus.colectica.mock-server-enabled=false

# Production Colectica Repository URI
fr.insee.rmes.bauhaus.colectica.baseURI=https://colectica.production.example.com/api
```

## API Communications

This section documents the API calls between Bauhaus and Colectica Repository for common operations.

### Physical Instance Operations

#### List All Physical Instances

Retrieving all physical instances from Bauhaus triggers a query to Colectica Repository.

**Bauhaus API Call:**
```http
GET {{API_BASE_URL}}/ddi/physical-instance
```

**Colectica API Call:**
```http
POST {{COLECTICA_URL}}/api/v1/_query
Content-Type: application/json
```

**Request Body:**
```json
{
    "itemTypes": ["a51e85bb-6259-4488-8df2-f08cb43485f8"],
    "searchLatestVersion": true
}
```

**Notes:**
- The `itemTypes` UUID `a51e85bb-6259-4488-8df2-f08cb43485f8` represents the Physical Instance type in DDI
- `searchLatestVersion: true` ensures only the latest version of each item is returned

---

#### Get Specific Physical Instance

Retrieving a specific physical instance by agency and identifier.

**Bauhaus API Call:**
```http
GET {{API_BASE_URL}}/ddi/physical-instance/{agency}/{identifier}
```

**Example:**
```http
GET {{API_BASE_URL}}/ddi/physical-instance/fr.inserm/00265728-02d5-478e-88db-55594a4bd260
```

**Colectica API Call:**
```http
GET {{COLECTICA_URL}}/api/v1/ddiset/{agency}/{identifier}
```

**Example:**
```http
GET {{COLECTICA_URL}}/api/v1/ddiset/fr.inserm/2514afe4-7b08-4500-be25-7a852a10fd8c
```

**Notes:**
- Colectica uses the DDI Set endpoint to retrieve complete metadata packages

---

#### Create or Update Physical Instance

Creating or updating a physical instance in Bauhaus persists the data to Colectica Repository.

**Bauhaus API Calls:**
```http
POST {{API_BASE_URL}}/ddi/physical-instance
PUT {{API_BASE_URL}}/ddi/physical-instance
```

**Colectica API Call:**
```http
POST {{COLECTICA_URL}}/api/v1/item
Content-Type: application/json
```

**Request Body Structure:**
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
    "namedOptions": [
      "RegisterOrReplace"
    ]
  }
}
```

**Field Descriptions:**

| Field | Type | Description |
|-------|------|-------------|
| `ItemType` | UUID | DDI item type identifier (e.g., Group, StudyUnit, PhysicalInstance) |
| `AgencyId` | String | Agency identifier (e.g., `fr.insee`) |
| `Version` | Integer | Version number of the metadata item |
| `Identifier` | UUID | Unique identifier for the item |
| `Item` | XML String | DDI-compliant XML fragment containing the metadata |
| `VersionDate` | ISO DateTime | Timestamp of this version |
| `VersionResponsibility` | String | User ID responsible for this version |
| `IsPublished` | Boolean | Publication status |
| `IsDeprecated` | Boolean | Deprecation flag |
| `IsProvisional` | Boolean | Provisional status |
| `ItemFormat` | UUID | Format identifier for the XML content |

**Options:**
- `RegisterOrReplace`: If the item already exists, it will be replaced; otherwise, it will be created

**Example XML Fragment:**
```xml
<Fragment xmlns:r="ddi:reusable:3_3" xmlns="ddi:instance:3_3">
  <Group isUniversallyUnique="true" versionDate="2019-05-13T12:51:36.9134615Z" xmlns="ddi:group:3_3">
    <r:URN>urn:ddi:fr.insee:586a6306-c67d-4fda-a0ce-7e96564bda58:1</r:URN>
    <r:Agency>fr.insee</r:Agency>
    <r:ID>586a6306-c67d-4fda-a0ce-7e96564bda58</r:ID>
    <r:Version>1</r:Version>
    <r:UserID typeOfUserID="colectica:sourceId">INSEE-BDF-SGRP</r:UserID>
    <r:Citation>
      <r:Title>
        <r:String xml:lang="en-IE">Household budget survey</r:String>
        <r:String xml:lang="fr-FR">Enquête Budget de famille</r:String>
      </r:Title>
      <r:AlternateTitle>
        <r:String xml:lang="en-IE">BDF</r:String>
        <r:String xml:lang="fr-FR">BDF</r:String>
      </r:AlternateTitle>
    </r:Citation>
    <r:StudyUnitReference>
      <r:Agency>fr.insee</r:Agency>
      <r:ID>62a0a1ec-0fc3-4aaf-bc55-e26fd80347c9</r:ID>
      <r:Version>1</r:Version>
      <r:TypeOfObject>StudyUnit</r:TypeOfObject>
    </r:StudyUnitReference>
  </Group>
</Fragment>
```

---

### DDI Item Types

Common DDI item type UUIDs used in Colectica API calls:

| Item Type | UUID |
|-----------|------|
| Physical Instance | `a51e85bb-6259-4488-8df2-f08cb43485f8` |
| Group | `4bd6eef6-99df-40e6-9b11-5b8f64e5cb23` |
| Study Unit | (varies by implementation) |


## Additional Resources

- [DDI Alliance](https://ddialliance.org/) - Official DDI standards documentation
- [Colectica Documentation](https://www.colectica.com/documentation) - Colectica-specific guides
- [DDI Lifecycle 3.3 Specification](https://ddialliance.org/Specification/DDI-Lifecycle/3.3/) - Technical specification for DDI XML structure
- [Colectica REST API](https://www.colectica.com/) - Colectica API documentation