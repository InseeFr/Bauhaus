---
title: Overview — Variables Module
---

## What is the Variables module?

The Variables module manages **DDI (Data Documentation Initiative) metadata** for statistical surveys at INSEE. It allows users to create, version, and publish metadata objects that describe the structure and content of statistical datasets.

## Integration with Colectica Repository

DDI metadata is stored and managed in **Colectica Repository**, an external platform that implements the DDI Lifecycle standard. The Bauhaus backend communicates with Colectica via its REST API to read and write metadata objects.

Colectica acts as the authoritative store for DDI items. Bauhaus provides the user interface and orchestration layer on top of it.

See [Colectica Integration](../colectica/) for the technical details of the API communication.

## Why DDI?

DDI (Data Documentation Initiative) is an international standard for describing statistical and social science data. Using DDI ensures that metadata produced in Bauhaus is interoperable with other national and international statistical systems.

Key DDI concepts used in this module:

- **Physical Instance** — describes a data file (its structure, variables, categories)
- **Group / Study Unit** — organises physical instances within a survey or programme
- **Agency** — the organisation responsible for a metadata item (e.g. `fr.insee`)

## Development without Colectica

For local development and testing, the Bauhaus Back-Office ships a mock server that simulates the Colectica API. This removes the need to install a full Colectica instance.

See [Configure the Mock Server](../how-to/configure-mock-server/) to enable it.
