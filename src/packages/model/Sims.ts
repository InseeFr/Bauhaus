import { ValidationState } from '../components';

export type Rubric = {
	idAttribute: string;
};

export type Sims = {
	id: string;
	creators: string[];
	idIndicator?: string;
	idSeries?: string;
	validationState: ValidationState;
};
