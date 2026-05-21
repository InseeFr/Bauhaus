import type { LangString } from "../../utils/multilingual";

export type { LangString } from "../../utils/multilingual";

export interface PhysicalInstanceResponse {
  $schema?: string;
  topLevelReference?: TopLevelReference[];
  PhysicalInstance?: PhysicalInstance[];
  DataRelationship?: DataRelationship[];
  Variable?: Variable[];
  CodeList?: CodeList[];
  Category?: Category[];
}

export interface TopLevelReference {
  Agency: string;
  ID: string;
  Version: string;
  TypeOfObject: string;
}

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

export interface Citation {
  Title: LangString[];
}

export interface Reference {
  Agency: string;
  ID: string;
  Version: string;
  TypeOfObject: string;
}

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

export interface VariableRepresentation {
  VariableRole?: string;
  CodeRepresentation?: CodeRepresentation;
  NumericRepresentation?: NumericRepresentation;
  DateTimeRepresentation?: DateTimeRepresentation;
  TextRepresentation?: TextRepresentation;
}

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

export interface TextRepresentation {
  "@minLength"?: string;
  "@maxLength"?: string;
  "@regExp"?: string;
}

export interface NumberRange {
  Low: RangeValue;
  High: RangeValue;
}

export interface RangeValue {
  "@isInclusive": string;
  "#text": string;
}

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

export interface Code {
  "@isUniversallyUnique"?: string;
  URN: string;
  Agency: string;
  ID: string;
  Version: string;
  CategoryReference: Reference;
  Value: string;
}

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

export interface BasedOnObject {
  BasedOnReference: Reference;
  BasedOnRationaleCode: string;
}

// Type pour les données transformées affichées dans le tableau
export interface VariableTableData {
  id: string;
  name: string;
  label: string;
  type: string;
  lastModified: string;
}
