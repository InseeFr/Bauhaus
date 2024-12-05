import { ValidationState } from '@components/status';

export type Rubric = {
	idAttribute: string;
	labelLg1: string;
	labelLg2: string;
	documentsLg1?: string[];
	documentsLg2?: string[];
};

export type Sims = {
	id: string;
	creators: string[];
	idIndicator?: string;
	idOperation?: string;
	idSeries?: string;
	validationState: ValidationState;
	parentsWithoutSims: any[];
	rubrics: Rubric[];
};

export type MetadataStructure = {
	idMas: string;
};
