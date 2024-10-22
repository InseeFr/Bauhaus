import { ValidationState } from '../components';

export type Dataset = {
	accessRights: string;
	accrualPeriodicity: string;
	confidentialityStatus: string;
	id?: string;
	catalogRecord: CatalogRecord;
	validationState: ValidationState;
	observationNumber: number;
	timeSeriesNumber: number;
	linkedDocuments: string[];
	keywords: {
		lg1: string[];
		lg2: string[];
	};
	temporalCoverageDataType: string;
	temporalCoverageStartDate: string;
	temporalCoverageEndDate: string;
	temporalResolution: string;
	spacialCoverage: string;
	spacialTemporal: string;
	spacialResolutions: string[];
	creators: string[];
	publisher: string;
	wasGeneratedIRIs: string[];
	themes: string[];
	statisticalUnit: string[];
	dataStructure: string;
	issued?: string;
	type: string;
};
export type CatalogRecord = {
	created: string;
	updated: string;
	contributor: string;
	catalogRecord: CatalogRecord;
	validationState: ValidationState;
};
export type Distribution = {
	id?: string;
	validationState: ValidationState;
};
