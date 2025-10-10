import { ValidationState } from '@components/status';

export interface Family {
	id: string;
	prefLabelLg1?: string;
	prefLabelLg2?: string;
	validationState: ValidationState;
	created: string;
	modified: string;
	abstractLg1: string;
	abstractLg2: string;
	series: unknown[];
}

export interface FamilyHome {
	id: string;
	label: string;
}

export interface FamilyAdvancedSearch {
	id: string;
	prefLabelLg1: string;
}
