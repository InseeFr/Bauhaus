---
title: Overview — Concepts Module
---

## What is the Concepts module?

The Concepts module manages **statistical concepts** and **collections of concepts** used across INSEE's statistical production process. It provides a controlled vocabulary that ensures consistent terminology across surveys, classifications, and publications.

## Key business objects

### Concept (`skos:Concept`)

A Concept represents a statistical notion — a definition that can be referenced by other metadata objects. Each Concept carries:

- **Labels** — a preferred label and optional alternative labels in French and English
- **Notes** — definition, scope note, editorial note, change history
- **Lifecycle metadata** — creation date, modification date, validity period, version
- **Ownership** — creator stamp, contributor stamps, dissemination status
- **Relationships** — broader/narrower hierarchy, related concepts, matches to external vocabularies, succession links

A Concept can be in two states: **draft** (being edited) or **validated/published** (visible to all users).

### Collection (`skos:Collection`)

A Collection groups related Concepts under a common theme or scope. It carries its own labels, description, and ownership metadata. Collections are used to organise and navigate large sets of concepts.

## Role in the statistical metadata lifecycle

Concepts are a foundational layer: they are referenced by operations, series, variables, and classifications. Defining and maintaining a shared concept catalogue reduces duplication and improves consistency across the statistical production chain.

## Data storage

Concepts and Collections are stored as RDF triples in GraphDB, in the `concepts/definitions` named graph, using the SKOS vocabulary augmented with Dublin Core, INSEE-specific predicates, and XKOS.

See the [RDF Data Model](../../concepts-rdf-predicates/) for the full predicate reference.
