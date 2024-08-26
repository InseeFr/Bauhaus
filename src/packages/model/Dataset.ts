export type CatalogRecord = {
	created: string;
	updated: string;
};

export type Dataset = {
	accessRights: string;
	accrualPeriodicity: string;
	confidentialityStatus: string;
	id?: string;
	issued?: string;
	catalogRecord: CatalogRecord;
	creators: string[];
	publisher: string;
	wasGeneratedIRIs: string[];
	themes: string[];
	linkedDocuments: string[];
	keywords: {
		lg1: string[];
		lg2: string[];
	};
	statisticalUnit: string[];
	dataStructure: string;
	temporalCoverageDataType: string;
	temporalCoverageStartDate: string;
	temporalCoverageEndDate: string;
	type: string;
	temporalResolution: string;
	spacialCoverage: string;
	spacialTemporal: string;
	spacialResolutions: string[];
	observationNumber: number;
	timeSeriesNumber: number;
};
export type Distribution = {
	id?: string;
};
