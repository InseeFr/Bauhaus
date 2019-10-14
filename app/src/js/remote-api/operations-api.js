import buildApi from './build-api';
import simsApi from './operations/sims';
import indicatorApi from './operations/indicator';
import familyApi from './operations/family';
import seriesApi from './operations/series';

const api = {
	...simsApi,
	...indicatorApi,
	...familyApi,
	...seriesApi,
	getOperationsList: () => ['operations'],

	getOperationsSearchList: () => ['operations_search'],

	getMetadataStructureList: () => ['metadataStructureDefinition'],
	getMetadataAttributesList: () => ['metadataAttributes'],
	getOperation: id => [`operation/${id}`],

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
