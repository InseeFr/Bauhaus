---
title: Overview — Variables Module
sidebar:
  order: 1
---

## What the module manages

The Variables module describes the **data files produced by INSEE's statistical operations**: what each file contains, variable by variable, and how the values of those variables are to be read.

Its central object is the **physical instance** — the DDI name for a data file. A physical instance carries a list of **variables**; each variable carries a **representation** that says whether its values are free text, numbers, dates, or codes drawn from a **code list**.

Everything else the module exposes exists to place those objects in context or to make them reusable: groups and study units above the physical instance, code lists, categories and sentinel values beside the variables.

## Where it fits in Bauhaus

The module is the bridge between two worlds that Bauhaus otherwise keeps apart.

- Upwards, it is anchored in the **Operations module**: a DDI `Group` points at the IRI of one or more statistical operation *series*, and a DDI `StudyUnit` points at the IRI of an *operation*. Those links are what let Bauhaus decide who owns a data file — see [Access Control](/Bauhaus/guides/variables/explanation/access-control/).
- Downwards, it is the source of the DDI documents served to external consumers, under `/ddi/public/…`.

Unlike Concepts, Classifications or Operations, the Variables module stores **nothing in GraphDB**. Its data lives in Colectica.

## Why Colectica

[Colectica Repository](https://www.colectica.com/) is a repository implementing the DDI Lifecycle standard: it versions items, tracks the relationships between them, and enforces DDI identity (agency, identifier, version). Rebuilding that in Bauhaus would mean re-implementing a standard that already has a reference implementation.

So the split is:

- **Colectica** is the authoritative store. Every physical instance, variable, code list and category the module shows is read from it and written back to it.
- **Bauhaus** is the editing and orchestration layer: the user interface, the business rules about sharing and variants, the access control, and the translation between the shapes Colectica speaks and the shape the interface needs.

The consequence is that the module cannot work offline. There is no local copy of the metadata and no mock mode: a Colectica instance must be reachable for the module to serve anything.

## Why DDI

DDI (Data Documentation Initiative) is the international standard for describing statistical and social-science data. Using it means the metadata produced in Bauhaus can be consumed by other national and international statistical systems without translation.

The module works with two serialisations of the same model:

- **DDI Lifecycle 3.3 XML** — what Colectica stores and returns
- **DDI 4 JSON** — what the Bauhaus API and the user interface work with

The conversion between them happens inside the backend, on every read and every write. See [DDI 3.3 and DDI 4](/Bauhaus/guides/variables/explanation/ddi3-and-ddi4/).

## How the code is laid out

| Where | What |
|-------|------|
| `Bauhaus/src/packages/modules-ddi` | The frontend module: routes, pages, hooks and components for physical instances and variables |
| `Bauhaus-Back-Office/module-ddi` | The domain — DDI 4 models, services, conversion — and the Colectica infrastructure that implements its ports |
| `Bauhaus-Back-Office/colectica-client` | The Colectica SDK: the only HTTP client that talks to Colectica, including token handling |
| `Bauhaus-Back-Office/module-bauhaus-bo` | The REST controllers of the module, its exception handler, and the cache configuration |

## Where to go next

- [DDI Lifecycle Implementation Profile](/Bauhaus/guides/variables/reference/ddi-implementation-profile/) — the subset of DDI implemented, property by property, with cardinalities and application restrictions
- [The DDI Metadata Model](/Bauhaus/guides/variables/explanation/metadata-model/) — the hierarchy of objects and how it is filed in Colectica
- [Code Lists and Categories](/Bauhaus/guides/variables/explanation/code-lists-and-categories/) — reuse, sharing and variants
- [DDI 3.3 and DDI 4](/Bauhaus/guides/variables/explanation/ddi3-and-ddi4/) — the two serialisations and the conversion between them
- [Caching Colectica Reads](/Bauhaus/guides/variables/explanation/caching/) — what is cached, for how long, and how to refresh it
- [Access Control](/Bauhaus/guides/variables/explanation/access-control/) — how ownership of a data file is established
