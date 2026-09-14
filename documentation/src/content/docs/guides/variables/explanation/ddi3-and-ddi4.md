---
title: DDI 3.3 and DDI 4
sidebar:
  order: 4
---

The module works with two serialisations of the same DDI model, and converts between them on every read and every write.

- **DDI Lifecycle 3.3 XML** — the only thing Colectica stores and returns. Each item is an XML `<Fragment>`.
- **DDI 4 JSON** — what the Bauhaus REST API exposes and what the user interface manipulates.

The conversion is not a detail of the storage layer: it is the reason the frontend never sees XML, and the reason the module can validate its own output against a machine-readable schema.

## The DDI 4 envelope

Every DDI 4 payload the API returns or accepts has exactly two properties at the root:

```json
{
  "topLevelReferences": [
    { "$type": "PhysicalInstance", "Agency": "fr.insee", "ID": "586a…", "Version": "3" }
  ],
  "items": [
    { "$type": "PhysicalInstance", "…": "…" },
    { "$type": "DataRelationship", "…": "…" },
    { "$type": "Variable", "…": "…" }
  ]
}
```

- `topLevelReferences` names the entry points of the document
- `items` is a **flat** array of every object, each discriminated by its `$type`

This is the envelope declared by `ddi-schema.json`, which sets `additionalProperties: false` at the root. Anything else — a `$schema` marker, or the per-type keys of Colectica's own JSON serialisation — invalidates the payload.

Two consequences follow, and both are easy to trip over:

- **No `null` values.** The schema types no property as nullable, so every DDI 4 record serialised by the backend must carry `@JsonInclude(NON_NULL)`.
- **Consumers navigate by `$type`.** There is no typed sub-object to reach for; the frontend filters `items` by `$type`, and the backend rebuilds its internal typed lists by dispatching on the same discriminator.

## Conversion

| Direction | When it runs | Exposed as |
|-----------|--------------|------------|
| DDI 3.3 → DDI 4 | Every read from Colectica | `POST /ddi/convert/ddi3-to-ddi4` |
| DDI 4 → DDI 3.3 | Every write to Colectica; DDI3 export | `POST /ddi/convert/ddi4-to-ddi3` |

The two conversion endpoints exist so a client can perform the translation on documents it holds — that is how the **DDI3 export** of a physical instance is produced: the frontend enriches the payload with the code lists that the read had omitted, then posts it to `convert/ddi4-to-ddi3` and downloads the resulting XML fragment instance.

## Schema validation

`GET /ddi/schema` serves the JSON schema (DDI Lifecycle 4.0 RC1) that describes the envelope; `POST /ddi/validate` checks a document against it.

The validator distinguishes two failures, and the distinction matters when reading logs:

| Outcome | Status | Body |
|---------|--------|------|
| Valid | `200` | `{ "valid": true }` |
| Schema violations | `400` | `{ "valid": false, "errors": [...] }` |
| Malformed JSON | `400` | `{ "valid": false, "errors": ["Invalid JSON: …"] }` |
| Schema could not be loaded | `500` | — |

A failure to load the schema is deliberately *not* reported as a bad request: an infrastructure problem must not disguise itself as a user input error.

In the interface, validation is a development aid — the button is only rendered locally — and requires the `PUBLISH` privilege.

## Version dates

Colectica does not populate `VersionDate` by itself: an item written without one comes back dated `0001-01-01`. The module therefore stamps the value at write time, and reads it back from the item envelope rather than from the query response, which is not reliable.

On a full save (`PUT`), the dates are **reconciled** against the stored state rather than blindly refreshed:

- an item whose content did not change keeps its stored date
- an item that changed, or that is new, is stamped with the current time
- a change to a child propagates to its parents, following the references actually present in the payload

The result is that the "last modified" date shown in the lists means something: it changes when the object changed, not merely when someone pressed Save.
