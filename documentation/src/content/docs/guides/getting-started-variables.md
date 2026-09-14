---
title: Getting Started with Variables
---

By the end of this tutorial, you will have the Variables module running against a Colectica Repository, and you will have created your first physical instance (a data file) with one coded variable in it.

## Prerequisites

- A running Bauhaus instance — follow the [Getting Started](/Bauhaus/guides/getting-started/) guide first
- Access to a **Colectica Repository** instance, with a username and a password. The Variables module has no offline mode: every read and write goes to Colectica.
- A user account holding one of the roles that grant access to the module — `Gestionnaire_variables_RMESGNCS`, `Betatest_OeDDIp_RMESGNCS`, or `Administrateur_RMESGNCS`
- At least one **Group** already present in Colectica. Groups mirror the statistical operation series of the Operations module; if your repository is empty, see [Seed a Local Colectica Repository](/Bauhaus/guides/variables/how-to/seed-a-local-repository/).

## 1. Enable the Variables module

The module is identified by `ddi` in the Bauhaus Back-Office configuration:

```yaml
fr.insee.rmes.bauhaus:
  modules:
    - identifier: ddi
```

It is part of the default module list, so this step is only needed if your deployment trimmed that list.

## 2. Point the backend at your Colectica Repository

Set the server address in the Spring Boot configuration:

```yaml
fr.insee.rmes.bauhaus.colectica:
  server:
    baseUrl: https://colectica.example.com/
    defaultAgencyId: fr.insee
```

Then supply the credentials as environment variables, never in a committed file:

```shell
export COLECTICA_USERNAME='your.account@insee.fr'
export COLECTICA_PASSWORD='…'
```

Restart the backend. The **Variables** tile now appears on the Bauhaus home page.

See [Connect to a Colectica Repository](/Bauhaus/guides/variables/how-to/connect-to-colectica/) for the token-based authentication mode and the other server settings.

## 3. Open the module

1. Open [http://localhost:3000](http://localhost:3000) and log in
2. Click the **Variables** tile — you land on `/ddi/physical-instances`, the searchable list of physical instances

Each entry shows the label of the data file and the date of its last version.

## 4. Create a physical instance

1. Click the **create** button in the left-hand menu
2. Fill the dialog:
   - **Label** — the name of your data file, for instance `Household budget survey 2026 — individuals`
   - **Group** — the series the file belongs to
   - **Study Unit** — the statistical operation the file belongs to
3. Click **Create**

Bauhaus writes the physical instance to Colectica together with the objects it needs to exist — a `DataRelationship` and a `LogicalRecord`, both labelled after your physical instance — and opens the editing page for it.

## 5. Add a coded variable

On the editing page:

1. Click **Add variable**
2. In the **Information** tab, fill the variable **name** and **label**
3. Switch to the **Representation** tab and pick the type **Code**
4. Click **Create new list**, give the code list a label, then add a few codes — a **value** and a **label** for each
5. Click **Update** to apply your change to the variable

The variable now appears in the variables table with a marker showing it has unsaved changes.

## 6. Save

Click **Save all**. Bauhaus writes the whole physical instance — the variable, the new code list and its categories — to Colectica in a single atomic batch, and files each new object under the schemes of the parent group and study unit.

A success toast confirms the save, and the variables table drops the unsaved marker.

## 7. Export what you produced

Still on the editing page, open the **Export** menu of the global actions card and choose **DDI4**. A self-contained JSON file is downloaded, code lists included.

Choose **DDI3** instead to get the same content as a DDI Lifecycle 3.3 XML fragment instance.

## Next steps

- [Overview](/Bauhaus/guides/variables/explanation/overview/) — what the module manages and why it delegates storage to Colectica
- [The DDI Metadata Model](/Bauhaus/guides/variables/explanation/metadata-model/) — how groups, study units, physical instances and variables fit together
- [Code Lists and Categories](/Bauhaus/guides/variables/explanation/code-lists-and-categories/) — local, group and mutualized lists, and what happens when you edit a shared one
- [API Endpoints](/Bauhaus/guides/variables/reference/api-endpoints/) — the REST surface of the module
