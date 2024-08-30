import { ValidationState } from '../components';

export type Dataset = {
	id?: string;
	catalogRecord: CatalogRecord;
	validationState: ValidationState;
};
export type CatalogRecord = {
	contributor: string;
};
export type Distribution = {
	id?: string;
};
