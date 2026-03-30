---
title: Configuration Properties — Concepts & Collections
---

All properties are set in the Bauhaus Back-Office Spring Boot configuration and follow the `fr.insee.rmes.bauhaus` namespace.
Default values are defined in `bauhaus-core.properties`.

## Concepts

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `fr.insee.rmes.bauhaus.concepts.graph` | String | `concepts/definitions` | Named graph in GraphDB where concepts are stored |
| `fr.insee.rmes.bauhaus.concepts.scheme` | String | `concepts/definitions/scheme` | IRI of the SKOS Concept Scheme |
| `fr.insee.rmes.bauhaus.concepts.baseURI` | String | `concepts/definition` | Base URI used to mint concept IRIs |
| `fr.insee.rmes.bauhaus.concepts.defaultContributor` | String | `http://bauhaus/organisations/insee/HIE2001203` | Default contributor IRI assigned to new concepts |
| `fr.insee.rmes.bauhaus.concepts.defaultMailSender` | String | `dg75-administration-rmes@insee.fr` | Sender address for concept notification emails |
| `fr.insee.rmes.bauhaus.concepts.maxLengthScopeNote` | Integer | `350` | Maximum number of characters allowed in a scope note |

## Collections

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `fr.insee.rmes.bauhaus.collections.graph` | String | `${fr.insee.rmes.bauhaus.baseGraph}${fr.insee.rmes.bauhaus.concepts.graph}` | Named graph in GraphDB where collections are stored |
| `fr.insee.rmes.bauhaus.collections.baseURI` | String | `${fr.insee.rmes.bauhaus.sesame.gestion.baseURI}/concepts/definitions` | Base URI used to mint collection IRIs |

Both defaults are computed from shared properties — override them explicitly if your GraphDB topology differs from the standard layout.

## Themes

Themes are concept schemes used to classify concepts by statistical domain.

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `fr.insee.rmes.bauhaus.theme.graph` | String | `concepts` | Named graph where theme/domain concept schemes are stored |
| `fr.insee.rmes.bauhaus.theme.conceptSchemeFilter` | String | `classificationOfStatisticalDomain,inseeTheme` | Comma-separated list of concept scheme identifiers used to populate the domain selector |

## Documentation concepts

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `fr.insee.rmes.bauhaus.documentations.concepts.graph` | String | `concepts/qualite` | Named graph used for quality documentation attached to concepts |
