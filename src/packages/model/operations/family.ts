import { ValidationState } from '@components/status';
export type Family = {
	id: string;
	prefLabelLg1?: string;
	prefLabelLg2?: string;
	validationState: ValidationState;
	created: string;
	modified: string;
	themeLg1: string;
	themeLg2: string;
	abstractLg1: string;
	abstractLg2: string;
	series: unknown[];
};

export type FamilyHome = {
	id: string;
	label: string;
};

export type FamilyAdvancedSearch = {
	id: string;
	prefLabelLg1: string;
};
