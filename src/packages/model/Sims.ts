import { ValidationState } from '@components/status';

export interface Rubric {
	idAttribute: string;
	labelLg1: string;
	labelLg2: string;
	documentsLg1?: string[];
	documentsLg2?: string[];
	rangeType: string;
}

export interface Sims {
	id: string;
	creators: string[];
	idIndicator?: string;
	idOperation?: string;
	idSeries?: string;
	validationState: ValidationState;
	parentsWithoutSims: any[];
	rubrics: Rubric[];
}

export interface MetadataStructure {
	idMas: string;
	isPresentational: boolean;
	children: Record<string, MetadataStructure>;
}
