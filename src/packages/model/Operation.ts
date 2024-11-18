import { ValidationState } from '@components/status';

import { Series } from './operations/series';

/**
 * Type used when fetching all Series
 */
export type Operation = {
	id: string;
	label: string;
	altLabel: string;
	iri: string;
	seriesIri: string;
	idSims?: string;
	series: Series;
	validationState: ValidationState;
	prefLabelLg1?: string;
};

export type SeeAlso = {
	type: string;
};
