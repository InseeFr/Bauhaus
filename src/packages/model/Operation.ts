import { Series } from './operations/series';
import { ValidationState } from '../components';

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
};

export type SeeAlso = {
	type: string;
};
