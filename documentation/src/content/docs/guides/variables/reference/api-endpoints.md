---
title: API Endpoints
sidebar:
  order: 1
---

REST surface of the Variables module, exposed by the Bauhaus Back-Office. All paths are relative to the servlet context path, `/api`.

Unless stated otherwise, an endpoint requires authentication and the privilege given in the **Access** column on the module `DDI_PHYSICALINSTANCE`. Endpoints marked **public** require no authentication.

## Physical instances

| Method | Path | Access | Description |
|--------|------|--------|-------------|
| `GET` | `/ddi/physical-instance` | `READ` | All physical instances, alphabetically by label. HAL, with a `self` link per entry. Filtered by stamp under the `STAMP` strategy. |
| `GET` | `/ddi/physical-instance/search` | `READ` | Advanced-search rows: each physical instance joined to its study unit and group, labels resolved. Parent fields are `null` for an orphan instance. Filtered by stamp under `STAMP`. |
| `GET` | `/ddi/physical-instance/{agency}/{id}` | `READ` | The physical instance as a DDI 4 document. **Code lists and categories are omitted** — fetch them separately. |
| `GET` | `/ddi/physical-instance/{agency}/{id}/parents` | `READ` | Parent study unit and group (agency, id, label) plus the resolved owner stamps. |
| `GET` | `/ddi/physical-instance/{agency}/{id}/codeslists` | `READ` | Summaries of the code lists referenced by this instance's variables. |
| `POST` | `/ddi/physical-instance` | `CREATE` on the target group | Creates a physical instance with its data relationship and logical record. Body: `physicalInstanceLabel`, `dataRelationshipLabel`, `logicalRecordLabel`, `groupAgency`, `groupId`, `studyUnitAgency`, `studyUnitId`. |
| `PATCH` | `/ddi/physical-instance/{agency}/{id}` | `UPDATE` | Updates the labels and the parents of an existing instance. Same body as the creation. |
| `PUT` | `/ddi/physical-instance/{agency}/{id}` | `UPDATE` | Replaces the whole instance with the DDI 4 document in the body: variables, code lists, categories, sentinel values. |

`POST` checks the privilege against the group identified as `groupAgency|groupId`, since the instance does not exist yet.

## Groups

| Method | Path | Access | Description |
|--------|------|--------|-------------|
| `GET` | `/ddi/group` | `READ` | Groups as HAL, with a `self` link per entry. Filtered by stamp under `STAMP`. |
| `GET` | `/ddi/group/{agency}/{id}` | `READ` | One group as a DDI 4 document. |
| `GET` | `/ddi/groups` | authenticated | Plain list of all groups. No RBAC check. |
| `POST` | `/ddi/groups` | authenticated | Creates or updates a group from a DDI 4 `Group`. Returns `201`. No RBAC check. |
| `GET` | `/ddi/groups/{agency}/{id}/logical-products` | `READ` | Logical products of the group. |
| `GET` | `/ddi/groups/{agency}/{id}/codes-list` | `READ` | Every code list of the group, across all its logical products and code list schemes. |
| `GET` | `/ddi/groups/{agency}/{id}/missing-codes-list` | `READ` | The group's sentinel-value code lists. |
| `GET` | `/ddi/groups/{agency}/{id}/missing-values-representations` | `READ` | The group's reusable `ManagedMissingValuesRepresentation`s, with a preview of their codes. |
| `GET` | `/ddi/groups/{ga}/{gid}/logical-products/{la}/{lid}/code-list-scheme` | `READ` | Code list schemes of one logical product. |
| `GET` | `/ddi/groups/{ga}/{gid}/logical-products/{la}/{lid}/code-list-scheme/{ca}/{cid}/codes-list` | `READ` | Code lists of one code list scheme. |

## Study units, logical products, schemes

| Method | Path | Access | Description |
|--------|------|--------|-------------|
| `GET` | `/ddi/study-units` | `READ` | All study units. |
| `POST` | `/ddi/study-units` | `CREATE` | Creates or updates a study unit from a DDI 4 `StudyUnit`. Returns `201`. |
| `GET` | `/ddi/logical-product` | `READ` | All logical products, as HAL. |
| `GET` | `/ddi/code-list-scheme` | `READ` | All code list schemes, as HAL. |

## Code lists and usages

| Method | Path | Access | Description |
|--------|------|--------|-------------|
| `GET` | `/ddi/mutualized-codes-list` | `READ` | Summaries of the mutualized code lists. Send `Cache-Control: no-cache` to force a refresh. |
| `GET` | `/ddi/mutualized-codes-list/{agency}/{id}` | `READ` | One code list and its categories, as a DDI 4 document. Despite its name the endpoint is generic — it resolves any code list. Returns `200` with an empty body when the list does not exist. |
| `GET` | `/ddi/codes-list/{agency}/{id}/users` | `READ` | Variables using this code list, with their physical instance and study unit. |
| `GET` | `/ddi/category/{agency}/{id}/users` | `READ` | Code lists whose codes reference this category. |
| `GET` | `/ddi/missing-values-representations/{agency}/{id}/users` | `READ` | Variables referencing this sentinel-values representation. |

## Conversion and validation

| Method | Path | Access | Description |
|--------|------|--------|-------------|
| `POST` | `/ddi/convert/ddi4-to-ddi3` | `READ` | DDI 4 JSON in, DDI 3.3 XML out (`application/xml`). |
| `POST` | `/ddi/convert/ddi3-to-ddi4` | `READ` | DDI 3.3 fragments in, DDI 4 JSON out. |
| `GET` | `/ddi/schema` | `READ` | The DDI 4 JSON schema used for validation. |
| `POST` | `/ddi/validate` | `PUBLISH` | Validates a DDI 4 document. `200 {valid:true}`, or `400 {valid:false, errors:[…]}`. |

## Public endpoints

No authentication. Every one of them negotiates its format through the `Accept` header: `application/xml` yields DDI 3.3 (a multi-fragment `<FragmentInstance>`), `application/json` yields DDI 4.

The `/ddi/` prefix is required by the API gateway, which routes to Bauhaus only the paths beginning with it.

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/ddi/public/item/{agency}/{id}` | One DDI item, latest version. |
| `GET` | `/ddi/public/item/{agency}/{id}/{version}` | One DDI item, at that version. |
| `GET` | `/ddi/public/codelist/{agency}/{id}` | A code list with the categories its codes reference. |
| `GET` | `/ddi/public/codelist/{agency}/{id}/{version}` | Same, at that version. |
| `GET` | `/ddi/public/fichier/{agency}/{id}` | A physical instance and everything that composes it — its data relationships, and therefore its variables. |
| `GET` | `/ddi/public/fichier/{agency}/{id}/{version}` | Same, at that version. |
| `GET` | `/ddi/public/operation/{id}/fichiers` | The study unit documenting the Bauhaus operation `{id}`, together with the physical instances it references. |

`/ddi/public/operation/{id}/fichiers` resolves the operation IRI in the **publication** repository, so only published operations can be matched.

## Error responses

| Status | When |
|--------|------|
| `400` | Sentinel values saved without their mandatory labels; malformed or schema-invalid DDI 4 on `/ddi/validate` |
| `403` | RBAC refusal |
| `404` | Study unit not found; unknown item, code list or physical instance on a public endpoint |
| `500` | Colectica unreachable or returning an unexpected response |

`400` and `404` bodies carry `{ "message": "…" }`.
