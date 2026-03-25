---
title: Concepts — RDF Data Model
---

## Graph location

| Graph | IRI |
|-------|-----|
| Concepts & Collections | `concepts/definitions` |
| Concept Scheme | `concepts/definitions/scheme` |

## Namespace prefixes

| Prefix | Namespace |
|--------|-----------|
| `rdf` | `http://www.w3.org/1999/02/22-rdf-syntax-ns#` |
| `skos` | `http://www.w3.org/2004/02/skos/core#` |
| `dc` | `http://purl.org/dc/elements/1.1/` |
| `dcterms` | `http://purl.org/dc/terms/` |
| `insee` | `http://rdf.insee.fr/def/base#` |
| `pav` | `http://purl.org/pav/` |
| `evoc` | `http://eurovoc.europa.eu/schema#` |
| `xkos` | `http://rdf-vocabulary.ddialliance.org/xkos#` |

---

## Concept (`skos:Concept`)

### Identity

| Predicate | Type | Description |
|-----------|------|-------------|
| `rdf:type` | IRI | Always `skos:Concept` |
| `skos:notation` | Literal | Unique identifier of the concept |
| `skos:inScheme` | IRI | Reference to the concept scheme (`concepts/definitions/scheme`) |

### Labels

| Predicate | Type | Description |
|-----------|------|-------------|
| `skos:prefLabel` | Literal (lang) | Preferred label — multilingual (`fr`, `en`) |
| `skos:altLabel` | Literal (lang) | Alternative labels — multilingual |

### Notes

| Predicate | Type | Description |
|-----------|------|-------------|
| `skos:definition` | Literal / blank node | Definition of the concept |
| `skos:scopeNote` | Literal / blank node | Short scope note |
| `skos:editorialNote` | Literal / blank node | Editorial note (internal) |
| `skos:changeNote` | Literal / blank node | Change history note |
| `evoc:noteLiteral` | Literal | Plain-text note (EuroVoc) |
| `xkos:ExplanatoryNote` | Literal | Explanatory note (DDI/XKOS) |

> Notes are stored as blank nodes with `rdf:value` (content) and `dcterms:language` (language tag) and `insee:conceptVersion` (version number).

### Dates & lifecycle

| Predicate | Type | Description |
|-----------|------|-------------|
| `dcterms:created` | xsd:date | Creation date |
| `dcterms:modified` | xsd:date | Last modification date |
| `dcterms:valid` | xsd:date | Validity date |
| `insee:validFrom` | xsd:date | Validity start date |
| `insee:validUntil` | xsd:date | Validity end date |
| `pav:version` | Literal | Version number |

### Ownership & publication

| Predicate | Type | Description |
|-----------|------|-------------|
| `dc:creator` | Literal | Stamp of the creator |
| `dc:contributor` | Literal | Stamp(s) of contributors |
| `insee:isValidated` | xsd:boolean | Whether the concept is validated/published |
| `insee:disseminationStatus` | IRI | Dissemination status |
| `insee:additionalMaterial` | IRI | Link to additional reference materials |

### Relationships

| Predicate | Type | Description |
|-----------|------|-------------|
| `skos:broader` | IRI | Hierarchical broader concept |
| `skos:narrower` | IRI | Hierarchical narrower concept |
| `skos:related` | IRI | Related concept (symmetric association) |
| `skos:closeMatch` | IRI | Close match with an external concept |
| `dcterms:references` | IRI | Reference link to another concept |
| `dcterms:replaces` | IRI | Concept that this one replaces (succession) |
| `dcterms:isReplacedBy` | IRI | Concept that replaces this one (succession) |
| `dcterms:hasPart` | IRI | Compositional part relationship |

---

## Collection (`skos:Collection`)

### Identity

| Predicate | Type | Description |
|-----------|------|-------------|
| `rdf:type` | IRI | Always `skos:Collection` |

### Labels & description

| Predicate | Type | Description |
|-----------|------|-------------|
| `skos:prefLabel` | Literal (lang) | Preferred label — multilingual (`fr`, `en`) |
| `dcterms:title` | Literal (lang) | Title — multilingual |
| `dcterms:description` | Literal (lang) | Description — multilingual |

### Dates & ownership

| Predicate | Type | Description |
|-----------|------|-------------|
| `dcterms:created` | xsd:date | Creation date |
| `dcterms:modified` | xsd:date | Last modification date |
| `dc:creator` | Literal | Stamp of the creator |
| `dc:contributor` | Literal | Stamp(s) of contributors |

### Members

| Predicate | Type | Description |
|-----------|------|-------------|
| `skos:member` | IRI | Reference to a `skos:Concept` belonging to this collection |
