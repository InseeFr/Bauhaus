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
	'@isUniversallyUnique'?: string;
	'@versionDate'?: string;
	URN: string;
	Agency: string;
	ID: string;
	Version: string;
	Citation: Citation;
	DataRelationshipReference: Reference;
}

export interface Citation {
	Title: Title;
}

export interface Title {
	String: LocalizedString;
}

export interface LocalizedString {
	'@xml:lang': string;
	'#text': string;
}

export interface Reference {
	Agency: string;
	ID: string;
	Version: string;
	TypeOfObject: string;
}

export interface DataRelationship {
	'@isUniversallyUnique'?: string;
	'@versionDate'?: string;
	URN: string;
	Agency: string;
	ID: string;
	Version: string;
	DataRelationshipName?: LocalizedContent;
	LogicalRecord: LogicalRecord;
}

export interface LocalizedContent {
	String: LocalizedString;
}

export interface LogicalRecord {
	'@isUniversallyUnique'?: string;
	URN: string;
	Agency: string;
	ID: string;
	Version: string;
	LogicalRecordName?: LocalizedContent;
	VariablesInRecord: VariablesInRecord;
}

export interface VariablesInRecord {
	VariableUsedReference: Reference[];
}

export interface Variable {
	'@isUniversallyUnique'?: string;
	'@versionDate'?: string;
	'@isGeographic'?: string;
	URN: string;
	Agency: string;
	ID: string;
	Version: string;
	VariableName: LocalizedContent;
	Label: LabelContent;
	Description?: LabelContent;
	VariableRepresentation?: VariableRepresentation;
}

export interface LabelContent {
	Content: LocalizedString;
}

export interface VariableRepresentation {
	VariableRole?: string;
	CodeRepresentation?: CodeRepresentation;
	NumericRepresentation?: NumericRepresentation;
}

export interface CodeRepresentation {
	'@blankIsMissingValue': string;
	CodeListReference: Reference;
}

export interface NumericRepresentation {
	NumericTypeCode: string;
	NumberRange?: NumberRange;
}

export interface NumberRange {
	Low: RangeValue;
	High: RangeValue;
}

export interface RangeValue {
	'@isInclusive': string;
	'#text': string;
}

export interface CodeList {
	'@isUniversallyUnique'?: string;
	'@versionDate'?: string;
	URN: string;
	Agency: string;
	ID: string;
	Version: string;
	Label?: LabelContent;
	Code?: Code[];
	BasedOnObject?: BasedOnObject;
}

export interface Code {
	'@isUniversallyUnique'?: string;
	URN: string;
	Agency: string;
	ID: string;
	Version: string;
	CategoryReference: Reference;
	Value: string;
}

export interface Category {
	'@isUniversallyUnique'?: string;
	'@versionDate'?: string;
	URN: string;
	Agency: string;
	ID: string;
	Version: string;
	Label: LabelContent;
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
