import { linkTypes } from '../../modules-concepts/utils/links';

export type ConceptGeneral = {
	prefLabelLg1: string;
	prefLabelLg2: string;
	conceptVersion: string;
	creator: string;
	disseminationStatus: string;
};

export type ConceptNotes = {
	scopeNoteLg1?: string;
	scopeNoteLg2?: string;
	definitionLg1: string;
	definitionLg2?: string;
	changeNoteLg1?: string;
	changeNoteLg2?: string;
	editorialNoteLg1?: string;
	editorialNoteLg2?: string;
};

export type Concept = ConceptGeneral & ConceptNotes;

export type Link = {
	id: string;
	typeOfLink: keyof typeof linkTypes;
	prefLabelLg1: string;
	prefLabelLg2: string;
};
