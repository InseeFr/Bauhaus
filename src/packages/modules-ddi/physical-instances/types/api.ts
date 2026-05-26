// ────────────────────────────────────────────────────────────────────────────
// Front-end view of the DDI Physical Instance REST contract.
//
// IMPORTANT: these interfaces describe what the back-office currently returns
// over HTTP, NOT the pure DDI 4 schema. The back internally uses the
// DDI Lifecycle 4.0 RC1 model (see `generated/ddi.ts`) but serialises to a
// DDI 3-flavoured JSON via the `additionalProperties` bridge, which preserves
// legacy XML attributes (`@isUniversallyUnique`, `@versionDate`, `#text`, …)
// and the `TypeOfObject` discriminator instead of the `$type` field.
//
// Once the back-office migrates its REST shape to pure DDI 4 JSON, every
// interface marked with `TODO(back-migration)` below can be replaced by a
// direct alias to the corresponding `components["schemas"][…]` entry of
// `generated/ddi.ts`. See `PLAN-DDI-CLEANUP.md` §1.6 for the broader plan.
// ────────────────────────────────────────────────────────────────────────────

import type { LangString } from "../../utils/multilingual";

export type { LangString } from "../../utils/multilingual";

// API wrapper — not a DDI 4 type; bundles the fragments returned by the
// back-office for a single physical instance.
export interface PhysicalInstanceResponse {
  $schema?: string;
  topLevelReference?: TopLevelReference[];
  PhysicalInstance?: PhysicalInstance[];
  DataRelationship?: DataRelationship[];
  Variable?: Variable[];
  CodeList?: CodeList[];
  Category?: Category[];
}

// TODO(back-migration): align with `components["schemas"]["reference"]` once
// the back returns `$type`/`URN` instead of `TypeOfObject`.
export interface TopLevelReference {
  Agency: string;
  ID: string;
  Version: string;
  TypeOfObject: string;
}

// TODO(back-migration): alias to `components["schemas"]["PhysicalInstance"]`
// once DDI 3 XML attributes (`@isUniversallyUnique`, `@versionDate`) are gone
// and `DataRelationshipReference` matches the DDI 4 cardinality.
export interface PhysicalInstance {
  "@isUniversallyUnique"?: string;
  "@versionDate"?: string;
  URN: string;
  Agency: string;
  ID: string;
  Version: string;
  Citation: Citation;
  DataRelationshipReference: Reference;
}

// TODO(back-migration): alias to `components["schemas"]["CitationType"]` once
// DDI 4 contract is in place (Title will become optional).
export interface Citation {
  Title: LangString[];
}

// TODO(back-migration): align with `components["schemas"]["reference"]` once
// the back returns `$type`/`URN` instead of `TypeOfObject`.
export interface Reference {
  Agency: string;
  ID: string;
  Version: string;
  TypeOfObject: string;
}

// TODO(back-migration): alias to `components["schemas"]["DataRelationship"]`.
export interface DataRelationship {
  "@isUniversallyUnique"?: string;
  "@versionDate"?: string;
  URN: string;
  Agency: string;
  ID: string;
  Version: string;
  Label?: LangString[];
  LogicalRecord: LogicalRecord;
}

// TODO(back-migration): alias to `components["schemas"]["LogicalRecordType"]`.
export interface LogicalRecord {
  "@isUniversallyUnique"?: string;
  URN: string;
  Agency: string;
  ID: string;
  Version: string;
  Label?: LangString[];
  VariablesInRecord: VariablesInRecord;
}

export interface VariablesInRecord {
  VariableUsedReference: Reference[];
}

// TODO(back-migration): alias to `components["schemas"]["Variable"]` once
// `@isGeographic`/`@versionDate` are gone.
export interface Variable {
  "@isUniversallyUnique"?: string;
  "@versionDate"?: string;
  "@isGeographic"?: string;
  URN: string;
  Agency: string;
  ID: string;
  Version: string;
  VariableName: LangString[];
  Label: LangString[];
  Description?: LangString[];
  VariableRepresentation?: VariableRepresentation;
}

// Wrapper around DDI 4 *RepresentationBaseType variants. No direct DDI 4
// equivalent: the back flattens the polymorphic union into one optional field
// per representation kind.
export interface VariableRepresentation {
  VariableRole?: string;
  CodeRepresentation?: CodeRepresentation;
  NumericRepresentation?: NumericRepresentation;
  DateTimeRepresentation?: DateTimeRepresentation;
  TextRepresentation?: TextRepresentation;
}

// Distinct from `components["schemas"]["CodeRepresentationBaseType"]`:
// `@blankIsMissingValue` is a DDI 3 XML attribute and `CodeListReference`
// uses the DDI 3-style `Reference` shape.
export interface CodeRepresentation {
  "@blankIsMissingValue": string;
  CodeListReference: Reference;
}

export interface NumericRepresentation {
  NumericTypeCode: string;
  NumberRange?: NumberRange;
}

export interface DateTimeRepresentation {
  DateTypeCode: string;
}

// DDI 3 XML attribute carryovers — no direct DDI 4 equivalent.
export interface TextRepresentation {
  "@minLength"?: string;
  "@maxLength"?: string;
  "@regExp"?: string;
}

export interface NumberRange {
  Low: RangeValue;
  High: RangeValue;
}

// `@isInclusive` + `#text` are pure DDI 3 XML serialisation; the DDI 4
// `RangeValueType` uses typed fields (`isInclusive: boolean`, `value: number`).
export interface RangeValue {
  "@isInclusive": string;
  "#text": string;
}

// TODO(back-migration): alias to `components["schemas"]["CodeList"]`.
export interface CodeList {
  "@isUniversallyUnique"?: string;
  "@versionDate"?: string;
  URN: string;
  Agency: string;
  ID: string;
  Version: string;
  Label?: LangString[];
  Code?: Code[];
  BasedOnObject?: BasedOnObject;
}

// TODO(back-migration): alias to `components["schemas"]["Code"]`.
export interface Code {
  "@isUniversallyUnique"?: string;
  URN: string;
  Agency: string;
  ID: string;
  Version: string;
  CategoryReference: Reference;
  Value: string;
}

// TODO(back-migration): alias to `components["schemas"]["Category"]`.
export interface Category {
  "@isUniversallyUnique"?: string;
  "@versionDate"?: string;
  URN: string;
  Agency: string;
  ID: string;
  Version: string;
  Label: LangString[];
  BasedOnObject?: BasedOnObject;
}

// TODO(back-migration): alias to `components["schemas"]["BasedOnObjectType"]`.
export interface BasedOnObject {
  BasedOnReference: Reference;
  BasedOnRationaleCode: string;
}

// UI-only row model used by the variables table; not a DDI type.
export interface VariableTableData {
  id: string;
  name: string;
  label: string;
  type: string;
  lastModified: string;
}
