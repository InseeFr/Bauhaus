---
title: Getting Started with Concepts
---

By the end of this tutorial, you will have the Concepts module running with sample data, and you will have browsed your first Concept and Collection in Bauhaus.

## Prerequisites

- A running Bauhaus instance — follow the [Getting Started](../getting-started/) guide first
- The admin credentials (`admin` / `admin123`) or a user with the `Administrateur_RMESGNCS` role

## 1. Enable the Concepts module

In your Bauhaus Back-Office Spring Boot configuration file, add the Concepts module to the `fr.insee.rmes.bauhaus.modules` list:

```yaml
fr.insee.rmes.bauhaus:
  modules:
    - identifier: concepts
```

Restart the backend. The Concepts tile should now appear on the Bauhaus home page.

See [Configure Module Visibility](./concepts/how-to/configure-module/) for options such as showing multiple modules or marking some as under maintenance.

## 2. Import sample data

Download the sample TriG file and import it into GraphDB:

**[Download concepts-collections.trig](/Bauhaus/concepts-collections.trig)**

1. Open your GraphDB instance and navigate to **Import → RDF**
2. Upload the `.trig` file
3. Select the repository and confirm the import

See [Import Sample Data](./concepts/how-to/import-sample-data/) for details on what the file contains and how to verify the import.

## 3. Browse Concepts and Collections

1. Open [http://localhost:3000](http://localhost:3000) and log in
2. Click the **Concepts** tile on the home page
3. Browse the list of Concepts — you should see the pre-populated entries from the sample file
4. Open a Concept to inspect its labels, definition, and relationships
5. Navigate to **Collections** and open one to see its member Concepts

## Next steps

- [Overview](./concepts/explanation/overview/) — understand what Concepts and Collections represent
- [RDF Data Model](../concepts-rdf-predicates/) — full reference of SKOS/RDF predicates used
- [Roles & Permissions (RBAC)](../rbac/) — configure user access for the Concepts module
