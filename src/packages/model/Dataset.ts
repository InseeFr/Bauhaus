import { ValidationState } from '@components/status';

export interface PartialDataset {
	id: string;
	label: string;
}
export interface Dataset {
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
}
export interface CatalogRecord {
	created: string;
	updated: string;
	contributor: string | string[];
	creator: string;
	catalogRecord: CatalogRecord;
	validationState: ValidationState;
}
export interface Distribution {
	id?: string;
	validationState: ValidationState;
	descriptionLg1: string;
	descriptionLg2: string;
	created: string;
	updated: string;
	format: string;
	byteSize: string;
	url: string;
}

export interface PartialDistribution {
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
}
