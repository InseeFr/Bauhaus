import { ValidationState } from '../../components';

export type Family = {
	id: string;
	prefLabelLg1?: string;
	prefLabelLg2?: string;
	validationState: ValidationState;
};

export type FamilyHome = {};

export type FamilyAdvancedSearch = {
	id: string;
	prefLabelLg1: string;
};
