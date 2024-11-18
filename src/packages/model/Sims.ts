import { ValidationState } from '@components/status';
export type Rubric = {
	idAttribute: string;
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
