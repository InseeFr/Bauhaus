---
title: DDI Lifecycle Implementation Profile
sidebar:
  order: 0
---

## What does the application do?

The application is used to document the variables of a statistical data file and to manage the metadata associated with them.
It allows users to create and modify variables, define their name, label, description and representation, and organize them within a physical instance.
The application also supports the reuse of code lists, helping to ensure metadata consistency and to improve the discoverability and dissemination of statistical data.
Metadata is managed according to the DDI Lifecycle standard and stored in the Colectica repository. The application supports the export of metadata in both DDI 3.3 (XML) and DDI 4.0/JSON serializations.

## Purpose

This document describes the subset of the DDI Lifecycle model implemented by the application.

The application uses [DDI Lifecycle 4.0](https://docs.ddialliance.org/DDI-Lifecycle/dev/model/) as its internal metadata model. It does not implement the complete DDI Lifecycle model. Instead, its implementation focuses on the [PhysicalInstance](https://docs.ddialliance.org/DDI-Lifecycle/dev/model/item-types/PhysicalInstance/) object and the variable-related structures associated with it.

The purpose of this document is to describe, as precisely as possible, the DDI objects, properties, and cardinalities implemented by the application, including application-specific restrictions.

The [implementation matrix](#implementation-matrix) provides the detailed description of the implementation profile.

## High-level implementation profile

The main concepts implemented by the application are:

```text
PhysicalInstance
└─► DataRelationship
    └── LogicalRecord
        └─► Variable
            └── VariableRepresentation
                ├── TextRepresentation
                ├── NumericRepresentation
                ├── DateTimeRepresentation
                │
                ├── CodeRepresentation
                │   └──► CodeList
                │        ├── Code
                │        │    └─► Category
                │        └── ...
                │
                └── MissingValuesReference
                    └─► ManagedMissingValuesRepresentation
                        └─► CodeList
                            ├── Code
                            │    └─► Category
                            └── ...
```

Only DDI Lifecycle objects that are at least identifiable within the supported scope are shown in this high-level profile (except `VariableRepresentation`).
`──►` indicates a DDI reference to another object.

They are documented in more detail in the [implementation matrix](#implementation-matrix).

## Prerequisite DDI metadata

The application requires a set of DDI metadata to be available in the repository before variable documentation can be performed.

In particular, they define the relationship between the `PhysicalInstance` managed by the application and its parent `StudyUnit`, and provide the schemes used to organize variables, code lists, categories and missing value representations.

The placement of these schemes reflects their intended reuse scope. The `VariableScheme` is attached to the `StudyUnit` level, as variables instantiated within a study can be reused across the different `PhysicalInstance` of that study. In contrast, categories, code lists, and missing value representations can be shared across `StudyUnit` and are therefore organized at the `Group` level. This organization provides the structure required for the application's metadata reuse functionality.

The following DDI objects and schemes are required:

- [`Group`](https://docs.ddialliance.org/DDI-Lifecycle/3.3/model/item-types/Group/)
- [`StudyUnit`](https://docs.ddialliance.org/DDI-Lifecycle/3.3/model/item-types/StudyUnit/)
- [`LogicalProduct`](https://docs.ddialliance.org/DDI-Lifecycle/3.3/model/item-types/LogicalProduct/)
- [`VariableScheme`](https://docs.ddialliance.org/DDI-Lifecycle/3.3/model/item-types/VariableScheme/)
- [`CodeListScheme`](https://docs.ddialliance.org/DDI-Lifecycle/3.3/model/item-types/CodeListScheme/)
- [`CategoryScheme`](https://docs.ddialliance.org/DDI-Lifecycle/3.3/model/item-types/CategoryScheme/)
- [`ManagedRepresentationScheme`](https://docs.ddialliance.org/DDI-Lifecycle/3.3/model/item-types/ManagedRepresentationScheme/)

Their relationship to the metadata managed by the application is illustrated below:

```text
Group
├── StudyUnit
│   ├── LogicalProduct
│   │   └── VariableScheme (only one)
│   │
│   └── PhysicalInstance (managed by the application)
│
└── LogicalProduct
    ├── ManagedRepresentationScheme (only one)
    ├── CategoryScheme (only one)
    └── CodeListScheme (only one)
```

In addition, the application can use pre-existing `CodeListGroup` definitions to present collections of reusable `CodeList` to all application users. This provides a way to promote the sharing and reuse of code lists with a high reuse potential, such as official, geographic and statistical classifications (e.g. NACE).

## CodeList and Category reuse and derivation

CodeLists can be reused through two mechanisms.

A `CodeListGroup` can be configured in the repository to provide a set of centrally managed CodeLists with high reuse potential, such as official, geographic and statistical classifications (e.g. NACE). These CodeLists are referenced directly and are available to all application users in read-only mode. They cannot be modified by application users.

User-created CodeLists are stored in the `CodeListScheme` at `Group` level and can be reused by variables belonging to the same or different `PhysicalInstance` and `StudyUnit`. A CodeList becomes shared when it is referenced by more than one variable.

Because `CodeList` and `Category` are [versionable DDI objects](https://docs.ddialliance.org/DDI-Lifecycle/3.3/model/item-types/Versionable/), modifications of shared objects require a distinction between updating the shared object and creating a derived variant. If a shared CodeList is modified, the application can either update the existing object, affecting all variables that reference it, or create a new CodeList as a variant of the original one using `BasedOnObject`. The new `CodeList` remains in the same `CodeListScheme` and can subsequently be reused. The application does not use DDI versioning for these objects.

A derived `CodeList` initially reuses the `Category` objects of the original `CodeList`. Consequently, a `Category` may remain shared even when the `CodeList` using it has been derived. If a shared `Category` is modified, the application can similarly either update the shared Category or create a derived `Category` using `BasedOnObject`. When the modification is initiated from a shared `CodeList`, the application can derive both the `CodeList` and the `Category` so that the change applies only to the current variable.

These derived objects represent a new application-level variant, typically corresponding to a business evolution of the metadata. They are not treated as DDI versions; updating the existing shared object is instead used when the intention is to correct the shared metadata.

## Implementation matrix

### Identity and technical metadata

DDI identification and technical metadata are not considered user-editable fields. Some values may be managed by the application.

Typical examples for the creation of an item include:

| Property | Origin |
|---|---|
| `ID` | Generated |
| `URN` | Generated |
| `Agency` | Defined in the configuration |
| `Version` | Set to `1`; DDI versioning is not supported by the application |
| `versionDate` | Generated |
| `isUniversallyUnique` | Set to `true` |

These properties apply to all identifiable objects: `PhysicalInstance`, `DataRelationship`, `LogicalRecord`, `Variable`, `ManagedMissingValuesRepresentation`, `CodeList`, `Code` and `Category`.

### Objects and properties

| DDI path | Mode | Cardinality | Application restriction | Comment |
|---|---|---:|---|---|
| `PhysicalInstance` | Container | - | 1 | |
| `PhysicalInstance/Citation/Title` | Editable | 0..1 | 1 | |
| `PhysicalInstance/DataRelationshipReference` | Reference | 0..n | 1 | |
| `DataRelationship` | Container | - | - | |
| `DataRelationship/Label` | Inferred | - | - | Inferred as `Structure: ` + `PhysicalInstance/Label` |
| `DataRelationship/LogicalRecord` | Generated | 0..n | 1 | |
| `LogicalRecord/Label` | Inferred | 0..n | 1 | Inferred as `LogicalRecord: ` + `PhysicalInstance/Label` |
| `LogicalRecord/VariablesInRecord` | Generated | 0..1 | 0..1 | |
| `VariablesInRecord/VariableUsedReference` | Reference | 0..n | 0..n | |
| `Variable` | Container | - | - | |
| `Variable/VariableName` | Editable | 0..n | 1 | 1 supported language defined in the configuration |
| `Variable/Label` | Editable | 0..n | 1 | 1 supported language defined in the configuration |
| `Variable/Description` | Editable | 0..n | 0..1 | Markdown supported |
| `Variable/VariableRepresentation` | Editable | 0..1 | 1 | |
| `VariableRepresentation/TextRepresentation` | Editable | 0..1 | 0..1 | |
| `TextRepresentation/minLength` | Editable | 0..1 | 0..1 | |
| `TextRepresentation/maxLength` | Editable | 0..1 | 0..1 | |
| `TextRepresentation/regExp` | Editable | 0..1 | 0..1 | |
| `VariableRepresentation/NumericRepresentation` | Editable | 0..1 | 0..1 | |
| `NumericRepresentation/NumericTypeCode` | Editable | 0..1 | 1 | [Enumerated values](https://rdf-vocabulary.ddialliance.org/ddi-cv/NumericType/1.0.0/NumericType.html) |
| `NumericRepresentation/NumberRange` | Container | 0..1 | 0..1 | |
| `NumberRange/Low` | Editable | 0..1 | 0..1 | `isInclusive` set to `true` |
| `NumberRange/High` | Editable | 0..1 | 0..1 | `isInclusive` set to `true` |
| `VariableRepresentation/DateTimeRepresentation` | Editable | 0..1 | 0..1 | |
| `DateTimeRepresentation/DateTypeCode` | Editable | 0..1 | 1 | [Enumerated values](https://rdf-vocabulary.ddialliance.org/ddi-cv/DateType/1.1.2/DateType.html) |
| `VariableRepresentation/CodeRepresentation` | Editable | 0..1 | 0..1 | |
| `CodeRepresentation/CodeListReference` | Reference | 0..1 | 0..1 | |
| `CodeList` | Container | - | - | |
| `CodeList/BasedOnObject` | Reference | 0..1 | 0..1 | References the original `CodeList` for a derived variant |
| `CodeList/Label` | Editable | 0..1 | 0..1 | 1 supported language defined in the configuration |
| `CodeList/Code` | Editable | 0..n | 0..n | |
| `Code/Value` | Editable | 0..n | 0..n | |
| `Code/CategoryReference` | Reference | 0..1 | 0..1 | |
| `Category` | Container | - | - | |
| `Category/BasedOnObject` | Reference | 0..1 | 0..1 | References the original `Category` for a derived variant |
| `Category/Label` | Editable | 0..n | 0..1 | |
| `VariableRepresentation/MissingValuesReference` | Reference | 0..1 | 0..1 | |
| `ManagedMissingValuesRepresentation` | Container | - | - | |
| `ManagedMissingValuesRepresentation/Label` | Inferred | 0..1 | 0..1 | 1 supported language defined in the configuration. Same label as the `CodeList` |
| `ManagedMissingValuesRepresentation/MissingCodeRepresentation` | Editable | 0..n | 0..1 | Only `MissingCodeRepresentation` supported |
| `MissingCodeRepresentation/CodeListReference` | Reference | 0..1 | 0..1 | Same restrictions as `CodeRepresentation/CodeListReference` |
