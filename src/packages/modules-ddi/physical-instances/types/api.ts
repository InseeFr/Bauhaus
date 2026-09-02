// Front-end view of the DDI 4 Physical Instance REST contract.
//
// Most interfaces alias the generated `components["schemas"][...]` type from
// `generated/ddi.ts`. A handful stay local because the back diverges from the
// schema on purpose — see comments by each local declaration.

import type { components } from "./generated/ddi";
import type { LangString } from "../../utils/multilingual";

// Enveloppe de fil, telle que la définit le `ddi-schema.json` : exactement
// `topLevelReferences` et `items`, ce dernier étant le tableau à plat de tous les objets,
// discriminés par leur `$type`. Le schéma déclare ces deux seules propriétés à la racine avec
// `additionalProperties: false` — d'où l'absence de `$schema` et des clés groupées par type.
// Utiliser les accesseurs de `./ddi4Items` plutôt que de filtrer `items` à la main.
export interface PhysicalInstanceResponse {
  topLevelReferences?: Reference[];
  items?: Ddi4Item[];
}

// Union discriminée par `$type` de tout ce qui peut apparaître dans `items`.
export type Ddi4Item =
  | PhysicalInstance
  | DataRelationship
  | Variable
  | CodeList
  | Category
  | ManagedMissingValuesRepresentation;

export type Reference = components["schemas"]["reference"];

export type PhysicalInstance = components["schemas"]["PhysicalInstance"];
export type DataRelationship = components["schemas"]["DataRelationship"];
export type LogicalRecord = components["schemas"]["LogicalRecordType"];
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
  // Valeurs sentinelles (#1566) : référence vers une ManagedMissingValuesRepresentation,
  // commune aux quatre types de représentation.
  MissingValuesReference?: Reference;
}

// ManagedMissingValuesRepresentation (valeurs sentinelles, #1566) : forme aplatie du back —
// l'identité (URN/Agency/ID/Version) est portée par l'item, contrairement au schéma où elle
// vient du ManagedRepresentation de base. Périmètre V1 : Label + MissingCodeRepresentation.
export interface ManagedMissingValuesRepresentation {
  // Requis (et non optionnel comme les autres champs) : c'est le discriminant de `Ddi4Item`.
  $type: "ManagedMissingValuesRepresentation";
  VersionDate?: { DateTime?: string };
  URN?: string;
  Agency?: string;
  ID: string;
  Version?: string;
  Label?: LangString[];
  MissingCodeRepresentation?: CodeRepresentation[];
}

// Ligne renvoyée par `GET /ddi/groups/{agency}/{id}/missing-values-representations` : une MMVR
// réutilisable du groupe, avec libellé et aperçu des valeurs de codes de sa CodeList de
// sentinelles. Alimente le sélecteur de réutilisation.
export interface PartialMissingValuesRepresentation {
  id: string;
  agency: string;
  version: string;
  label: string | null;
  codeListId: string | null;
  codeValues: string[];
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

// Un item DDI cité dans une réponse d'usage : son identité et son libellé déjà résolu par le back.
export interface UsageItem {
  agencyId: string;
  id: string;
  label: string | null;
}

// Flat usage row returned by `GET /ddi/category/{agency}/{id}/users`: a CodeList whose codes
// reference the category, joined to one Variable using this code list and to its
// PhysicalInstance / StudyUnit / Group parents (one row per CodeList × Variable). The UI groups
// these rows into a Group / StudyUnit / Variable / CodeList tree.
export interface CategoryUsage {
  // Les niveaux parents sont absents quand aucune variable n'utilise la liste, ou quand le back
  // n'a pas su les résoudre. Seule `codeList` est toujours présente.
  group: UsageItem | null;
  studyUnit: UsageItem | null;
  physicalInstance: UsageItem | null;
  variable: UsageItem | null;
  codeList: UsageItem;
}

// Flat usage row returned by `GET /ddi/codes-list/{agency}/{id}/users`: a Variable that
// references the code list, the PhysicalInstance it belongs to, and the StudyUnit that owns the
// PhysicalInstance. Each item carries its resolved label. StudyUnit fields may be null when no
// owning StudyUnit can be resolved. The UI groups these rows into a StudyUnit / PI / Variable tree.
export interface CodeListUsage {
  studyUnitAgencyId: string | null;
  studyUnitId: string | null;
  studyUnitLabel: string | null;
  physicalInstanceAgencyId: string;
  physicalInstanceId: string;
  physicalInstanceLabel: string | null;
  variableAgencyId: string;
  variableId: string;
  variableLabel: string | null;
}

// UI-only row model used by the variables table; not a DDI type.
export interface VariableTableData {
  id: string;
  name: string;
  label: string;
  type: string;
  lastModified: string;
}
