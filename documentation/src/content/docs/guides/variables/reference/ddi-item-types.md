---
title: DDI Item Types
sidebar:
  order: 3
---

Colectica identifies each DDI type by a UUID. The module reads them from configuration (`fr.insee.rmes.bauhaus.colectica.server.itemTypes`) rather than hard-coding them, so an instance using different identifiers can be accommodated without a code change.

## Configured types

| Type | Configuration key | UUID |
|------|-------------------|------|
| Physical Instance | `PhysicalInstance` | `a51e85bb-6259-4488-8df2-f08cb43485f8` |
| Logical Product | `LogicalProduct` | `965c8d28-7d48-4950-bea7-04b27e52bb9b` |
| Data Relationship | `DataRelationship` | `f39ff278-8500-45fe-a850-3906da2d242b` |
| Variable | `Variable` | `683889c6-f74b-4d5e-92ed-908c0a42bb2d` |
| Variable Scheme | `VariableScheme` | `50907716-b67a-4dcd-8f9f-8a283cb5fee0` |
| Code List | `CodeList` | `8b108ef8-b642-4484-9c49-f88e4bf7cf1d` |
| Code List Scheme | `CodeListScheme` | `4193d389-b5ae-4368-b399-cd5a7ee3653c` |
| Code List Group | `CodeListGroup` | `394b9ff3-7248-4ede-b945-9bebdbf56bed` |
| Category | `Category` | `7e47c269-bcab-40f7-a778-af7bbc4e3d00` |
| Category Scheme | `CategoryScheme` | `1c11de94-a36d-4d80-95dc-950c6f37f624` |
| Managed Representation Scheme | `ManagedRepresentationScheme` | `16d4d829-41e1-4677-aa17-81190b6a0e66` |
| Managed Missing Values Representation | `ManagedMissingValuesRepresentation` | `c29c3125-2a53-4179-8fa6-aa3beb2bb5ed` |
| Study Unit | `StudyUnit` | `30ea0200-7121-4f01-8d21-a931a182b86d` |

## Types not in the configuration

Two UUIDs are held in code rather than in configuration, because the map does not declare them:

| Type | UUID | Note |
|------|------|------|
| Group | `4bd6eef6-99df-40e6-9b11-5b8f64e5cb23` | **Absent from `itemTypes`.** Reading it through `itemTypes().get("Group")` returns `null` in production; the constant `GROUP_UUID` must be used instead |
| Study Unit | `30ea0200-7121-4f01-8d21-a931a182b86d` | Duplicated in code as `STUDY_UNIT_UUID` |

## Item format

| Name | UUID |
|------|------|
| DDI 3.3 XML fragment | `DC337820-AF3A-4C0B-82F9-CF02535CDE83` |

This is the value written in the `ItemFormat` field of every item Bauhaus registers, and it is configurable through `fr.insee.rmes.bauhaus.colectica.server.itemFormat`.
