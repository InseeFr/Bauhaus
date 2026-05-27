// Front-end view of the DDI 4 Physical Instance REST contract.
//
// Most interfaces alias the generated `components["schemas"][...]` type from
// `generated/ddi.ts`. A handful stay local because the back diverges from the
// schema on purpose — see comments by each local declaration.

import type { components } from "./generated/ddi";

export type { LangString } from "../../utils/multilingual";

// Wire envelope; not a DDI 4 type.
export interface PhysicalInstanceResponse {
  $schema?: string;
  TopLevelReference?: Reference[];
  PhysicalInstance?: PhysicalInstance[];
  DataRelationship?: DataRelationship[];
  Variable?: Variable[];
  CodeList?: CodeList[];
  Category?: Category[];
}

export type Reference = components["schemas"]["reference"];
export type Citation = components["schemas"]["CitationType"];
export type BasedOnObject = components["schemas"]["BasedOnObjectType"];

export type PhysicalInstance = components["schemas"]["PhysicalInstance"];
export type DataRelationship = components["schemas"]["DataRelationship"];
export type LogicalRecord = components["schemas"]["LogicalRecordType"];
export type VariablesInRecord = components["schemas"]["VariablesInRecordType"];
export type Category = components["schemas"]["Category"];

// Variable: override VariableRepresentation since the back flattens the
// schema's polymorphic ValueRepresentation into one field per kind.
export type Variable = Omit<components["schemas"]["Variable"], "VariableRepresentation"> & {
  VariableRepresentation?: VariableRepresentation;
};

export interface VariableRepresentation {
  VariableRole?: string;
  CodeRepresentation?: CodeRepresentation;
  NumericRepresentation?: NumericRepresentation;
  DateTimeRepresentation?: DateTimeRepresentation;
  TextRepresentation?: TextRepresentation;
}

export type CodeRepresentation = components["schemas"]["CodeRepresentationBaseType"];
export type TextRepresentation = components["schemas"]["TextRepresentationBaseType"];

// NumericRepresentation/DateTimeRepresentation diverge from the schema:
//   - schema's NumericTypeCode / DateTypeCode are CodeValueType objects; the
//     back sends plain strings.
//   - schema's NumberRange is an array; the back sends a single object.
// Kept local until the back closes that gap.
export interface NumericRepresentation {
  $type?: "NumericRepresentationBaseType";
  NumericTypeCode?: string;
  NumberRange?: NumberRange;
  BlankIsMissingValue?: boolean;
}

export interface DateTimeRepresentation {
  $type?: "DateTimeRepresentationBaseType";
  DateTypeCode?: string;
  DateFieldFormat?: string;
}

export interface NumberRange {
  Low?: RangeValue;
  High?: RangeValue;
}

// Schema spells the numeric value `DecimalValue`; the back currently emits
// `value`. Kept local until the back closes that gap.
export interface RangeValue {
  IsInclusive?: boolean;
  value?: number;
}

export type CodeList = components["schemas"]["CodeList"];
export type Code = components["schemas"]["CodeType"];

// UI-only row model used by the variables table; not a DDI type.
export interface VariableTableData {
  id: string;
  name: string;
  label: string;
  type: string;
  lastModified: string;
}
