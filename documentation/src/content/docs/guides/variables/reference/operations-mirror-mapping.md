---
title: Operations Mirror Mapping
sidebar:
  order: 5
---

What the operations mirror writes into Colectica, from what, and under which identity. Enabled by `fr.insee.rmes.bauhaus.colectica.operations-mirror.enabled` — see [Configuration Properties](/Bauhaus/guides/variables/reference/configuration-properties/).

For the reasoning behind these choices, see [Mirroring Series and Operations](/Bauhaus/guides/variables/explanation/operations-mirror/).

## Objects

| RDF repository | DDI repository |
|----------------|----------------|
| Statistical series | `Group` |
| Statistical operation | `StudyUnit`, its `LogicalProduct`, and that product's `VariableScheme` |

## Identifiers

Every DDI identifier is derived from the **publication** IRI of the RDF resource, through `UUID.nameUUIDFromBytes` (version 3 UUID, MD5 over the UTF-8 bytes).

| DDI object | Seed |
|------------|------|
| `Group` | `<series IRI>` |
| `StudyUnit` | `<operation IRI>` |
| `LogicalProduct` | `<operation IRI>#logicalproduct` |
| `VariableScheme` | `<operation IRI>#variablescheme` |

The agency is `defaultAgencyId`. URNs follow `urn:ddi:<agency>:<id>:<version>`.

The **version is never incremented**: the mirror reads the existing object and rewrites the same version (`RegisterOrReplace`), or writes `1` if it does not exist yet.

## Group fields

| RDF source | DDI 3.3 element |
|------------|-----------------|
| Publication IRI of the series | `r:UserID` with `typeOfUserID="URI"` |
| — (constant) | `TypeOfGroup` = `insee:StatisticalOperationSeries` |
| `skos:prefLabel` lg1, lg2 | `r:Citation/r:Title/r:String`, one per language present |
| `skos:altLabel` lg1, lg2 | `r:Citation/r:AlternateTitle/r:String`, one element per language |

Languages come from `fr.insee.rmes.bauhaus.colectica.langs`, in order: the first maps to lg1, the second to lg2. A language with no label is not written, and a series without a short label produces no `r:AlternateTitle` at all.

**Fields preserved** on rewrite, taken from the object read back: `StudyUnitReference`, `LogicalProductReference`, and the `r:UserID`s of the **other** series the group references — a group may carry several, and the one from the event is merged in, never substituted.

## StudyUnit fields and its satellites

Let `X` be the operation's **short label**: `skos:altLabel` lg1, falling back to lg2, falling back to `skos:prefLabel` lg1.

Let `NORM(X)` be that short label without spaces or diacritics, upper-cased (NFD normalisation, combining marks and whitespace removed, then upper-cased). For example, `Enquête emploi` → `ENQUETEEMPLOI`.

| Object | DDI 3.3 element | Value |
|--------|-----------------|-------|
| `StudyUnit` | `r:UserID` (`typeOfUserID="URI"`) | Publication IRI of the operation |
| `StudyUnit` | `r:Citation/r:Title/r:String` | `skos:prefLabel`, one entry per language present |
| `StudyUnit` | `r:LogicalProductReference` | The `LogicalProduct` below |
| `LogicalProduct` | `r:Label` | `X`, in the first configured language |
| `LogicalProduct` | `ddi:LogicalProductName` | `LP-NORM(X)` |
| `LogicalProduct` | `r:VariableSchemeReference` | The `VariableScheme` below |
| `VariableScheme` | `r:Label` | `Ensemble de variables X`, in the first configured language |
| `VariableScheme` | `ddi:VariableSchemeName` | `VS-NORM(X)` |

`LogicalProductName` and `VariableSchemeName` belong to the `ddi:logicalproduct:3_3` namespace, not to `ddi:reusable:3_3`.

**Field preserved** on the `StudyUnit` when rewritten: `r:PhysicalInstanceReference`.

### Filing under the Group

Once the `StudyUnit` is written, its reference is added to the series' `Group` unless already present. The `Group` is rewritten only in that case.

If the `Group` does not exist, the `StudyUnit` is written but left unfiled, and a `WARN` says so.

### Write order

`VariableScheme` → `LogicalProduct` → `StudyUnit` → `Group`. Colectica creates empty stubs for referenced objects it does not know yet, and those stubs cannot be rewritten at the same version.

## Triggers

| Endpoint | Event published | Effect |
|----------|-----------------|--------|
| `POST /operations/series` | `SeriesSaved` | `Group` created |
| `PUT /operations/series/{id}` | `SeriesSaved` | `Group` rewritten |
| `POST /operations/operation` | `OperationSaved`, with `seriesIri` | `StudyUnit` and satellites, filed under the `Group` |
| `PUT /operations/operation/{id}` | `OperationSaved`; `seriesIri` set only if the body carries `series` | `StudyUnit` and satellites rewritten; filed only when `seriesIri` is known |

Events are published **after** the RDF write, and the listener is synchronous: a DDI repository failure fails the HTTP request.

## Out of scope

The following trigger no DDI write:

- validating or publishing a series or an operation (`PUT .../validate`);
- deleting a series or an operation;
- any other attribute of the series (family, periodicity, publishers, contributors, creators, abstract, history note, `seeAlso` / `replaces` links…);
- indicators, families, metadata reports;
- series and operations that already exist when the flag is turned on — they are picked up only on their next save. There is no backfill.
