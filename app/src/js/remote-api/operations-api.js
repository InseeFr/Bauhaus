import buildApi from './build-api';
import simsApi from './operations/sims';
import indicatorApi from './operations/indicator';
import familyApi from './operations/family';

const api = {
	...simsApi,
	...indicatorApi,
	...familyApi,

	getSeriesList: () => ['series/withSims'],
	getOperationsList: () => ['operations'],

	getSeriesSearchList: () => ['series_search'],
	getOperationsSearchList: () => ['operations_search'],

	getMetadataStructureList: () => ['metadataStructureDefinition'],
	getMetadataAttributesList: () => ['metadataAttributes'],
	getOperation: id => [`operation/${id}`],
	getSerie: id => [`series/${id}`],
	getVarBookExport: (id, MimeType) => [
		`operation/${id}/variableBook`,
		{
			headers: {
				Accept: MimeType,
				'Content-Type': 'text/plain',
			},
		},
		res => res,
	],

	putSeries: series => [
		`series/${series.id}`,
		{
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(series),
		},
		() => Promise.resolve(series.id),
	],
	postSeries: series => [
		`series`,
		{
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(series),
		},
		res => res.text(),
	],
	putOperation: operation => [
		`operation/${operation.id}`,
		{
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(operation),
		},
		() => Promise.resolve(operation.id),
	],
	postOperation: operation => [
		`operation`,
		{
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(operation),
		},
		res => res.text(),
	],
	getOperationsWithoutReport: idSerie => [
		`series/${idSerie}/operationsWithoutReport`,
	],
};

export default buildApi('operations', api);
