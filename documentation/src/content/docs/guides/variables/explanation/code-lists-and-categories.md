---
title: Code Lists and Categories
sidebar:
  order: 3
---

A variable whose type is **Code** takes its values from a `CodeList`. Each `Code` in that list pairs a value with a `Category`, which carries the human-readable label. That indirection — value in the code, meaning in the category — is what makes both levels independently reusable, and it is the source of most of the module's subtlety.

## Where a code list can come from

When you give a variable a code representation, you either create a new list or reuse an existing one. The reuse selector offers two sections.

| Section | Source | Editable? |
|---------|--------|-----------|
| **Group code lists** | Every list filed under the code list schemes of the parent group's logical products (`GET /ddi/groups/{agency}/{id}/codes-list`) | Yes |
| **Mutualized code lists** | Lists reachable from the configured mutualized codes package (`GET /ddi/mutualized-codes-list`) | No — read-only |

Mutualized lists are the shared institutional vocabularies: they are maintained outside the module, and the interface locks them, marking them with a padlock. Group lists are the module's own, and are meant to be shared *within* a series — which is exactly why editing one needs a decision.

Selecting a group list does not merely record a reference: the list is loaded and **materialised locally** under its shared identifier. Without that, the first edit would be applied to an empty list and the existing codes would be lost.

## Editing something that is shared

Before applying an edit to a code list or a category, the module asks Colectica who else uses it — `GET /ddi/codes-list/{agency}/{id}/users` for a list, `GET /ddi/category/{agency}/{id}/users` for a category — and reacts to four situations:

| Situation | What happens |
|-----------|--------------|
| The list is used by other variables | A dialog opens: **change the shared list**, or **create a variant** |
| The list *and* one of its categories are shared | A dialog opens, offering a variant of both |
| The list belongs to this variable only, but a category it uses is shared with other lists | A dialog opens, offering a variant of the category alone |
| Nothing is shared | The edit is applied silently |

**Creating a variant** forks the object: a copy is written under a fresh identifier, referenced only by the variable being edited, and carrying a `BasedOnObject` pointing back at the original. The other users of the original are left untouched. **Changing the shared object** propagates to everyone using it, which is a legitimate choice when the change is a correction rather than a divergence — the dialog names the variables and lists that will be affected.

A `SharedCodeListNotice` on the form warns about the sharing before the user starts typing, and a usage panel lists the variables or code lists concerned, grouped by study unit and physical instance.

### Pending edits are visible across variables

Edits are held locally until you click **Save all**. Two lookups keep that local state consistent while you move from one variable to another:

- a variable that references a list already edited elsewhere in the page shows the **locally overridden** version, not the stale one from the backend
- a category edited from one list is applied to the freshly loaded categories of any other list that reuses it

Without those, validating a second variable would silently re-inject the stale copy into the save payload and undo the first edit.

## Sentinel values

**Sentinel values** are the codes that mean "no answer", "not applicable", "unknown" — values a variable can take that are not part of its normal domain. In DDI they live in a `ManagedMissingValuesRepresentation` (MMVR), which a variable points at through `MissingValuesReference`, and which itself points at a code list of sentinel codes.

They follow the same reuse logic as ordinary code lists, one level up:

- reusable MMVRs of the parent group are listed by `GET /ddi/groups/{agency}/{id}/missing-values-representations`, and their sentinel code lists by `GET /ddi/groups/{agency}/{id}/missing-codes-list`
- an MMVR's code list is **editable only when the variable you have open is its sole user**; `GET /ddi/missing-values-representations/{agency}/{id}/users` decides that, completed by the count of other unsaved variables of the page that reference the same MMVR
- MMVRs are filed under the `ManagedRepresentationScheme` of the parent group, like code lists and categories

Saving with a sentinel code that has no label is rejected by the backend with a `400` and an explicit message.

## Code lists are not in the physical instance payload

`GET /ddi/physical-instance/{agency}/{id}` deliberately omits code lists and categories: they are often the largest items, and converting them from DDI 3.3 on every page load is expensive. The interface loads a variable's list on demand, when the variable is opened.

The consequence surfaces on export and validation: both re-inject every referenced code list — including the sentinel ones — into the payload before sending it, so that the exported document is self-contained and the validated document matches what the schema expects.
