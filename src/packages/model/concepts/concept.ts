export type ConceptGeneral = {
	prefLabelLg1: string;
	creator: string;
	disseminationStatus: string;
};

export type ConceptNotes = {
	scopeNoteLg1?: string;
	scopeNoteLg2?: string;
	definitionLg1: string;
	definitionLg2?: string;
};

export type Concept = ConceptGeneral & ConceptNotes;
