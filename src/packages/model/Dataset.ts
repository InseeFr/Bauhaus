import { ValidationState } from '../components';

export type PartialDataset = {
	id: string;
	label: string;
};
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
	contributor: string | string[];
	creator: string;
	catalogRecord: CatalogRecord;
	validationState: ValidationState;
};
export type Distribution = {
	id?: string;
	validationState: ValidationState;
	descriptionLg1: string;
	descriptionLg2: string;
	created: string;
	updated: string;
	format: string;
	byteSize: string;
	url: string;
};

export type PartialDistribution = {
	id: string;
	idDataset: string;
	labelLg1: string;
	labelLg2: string;
	descriptionLg1: string;
	descriptionLg2: string;
	created: string;
	updated: string;
	format: string;
	byteSize: string;
	url: string;
};
