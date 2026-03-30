---
title: Import Sample Data
---

A sample TriG file containing pre-populated Concepts and Collections is available for bootstrapping a local environment.

**[Download concepts-collections.trig](/Bauhaus/concepts-collections.trig)**

## Import into GraphDB

1. Open your GraphDB instance (default: [http://localhost:7200](http://localhost:7200))
2. Navigate to **Import → RDF**
3. Upload the downloaded `.trig` file
4. Select your repository and confirm the import

## Verify the import

After import, run the following SPARQL query in GraphDB to check that data landed in the correct graph:

```sparql
SELECT (COUNT(*) AS ?count)
WHERE {
  GRAPH <concepts/definitions> {
    ?s ?p ?o
  }
}
```

A non-zero result confirms that Concepts and Collections were imported successfully.
