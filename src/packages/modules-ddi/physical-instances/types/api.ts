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

// DataRelationship: override LogicalRecord since the back sends a single
// object where the schema declares LogicalRecord[] (array).
export type DataRelationship = Omit<
  components["schemas"]["DataRelationship"],
  "LogicalRecord"
> & {
  LogicalRecord?: LogicalRecord;
};
export type LogicalRecord = components["schemas"]["LogicalRecordType"];
export type VariablesInRecord = components["schemas"]["VariablesInRecordType"];
export type Category = components["schemas"]["Category"];

// Variable: override VariableRepresentation since the back flattens the
// schema's polymorphic ValueRepresentation into one field per kind.
export type Variable = Omit<
  components["schemas"]["Variable"],
  "VariableRepresentation"
> & {
  VariableRepresentation?: VariableRepresentation;
};

export interface VariableRepresentation {
  VariableRole?: string;
  CodeRepresentation?: CodeRepresentation;
  NumericRepresentation?: NumericRepresentation;
  DateTimeRepresentation?: DateTimeRepresentation;
  TextRepresentation?: TextRepresentation;
}

export type CodeRepresentation =
  components["schemas"]["CodeRepresentationBaseType"];
export type TextRepresentation =
  components["schemas"]["TextRepresentationBaseType"];

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

// CodeList/Code: the schema's CodeType.Value is a ValueType object; the back
// emits a plain string. Kept local until the back closes that gap.
export type CodeList = Omit<components["schemas"]["CodeList"], "Code"> & {
  Code?: Code[];
};

export interface Code {
  $type?: "CodeType";
  URN?: string;
  Agency?: string;
  ID?: string;
  Version?: string;
  CategoryReference?: Reference;
  Value?: string;
}

// UI-only row model used by the variables table; not a DDI type.
export interface VariableTableData {
  id: string;
  name: string;
  label: string;
  type: string;
  lastModified: string;
}
