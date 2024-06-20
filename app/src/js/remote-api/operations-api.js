import { API } from 'js/utils';
import simsApi from './operations/sims';
import indicatorApi from './operations/indicator';
import seriesApi from './operations/series';
import operationsApi from './operations/operation';

const api = {
	...simsApi,
	...indicatorApi,
	...API.generateGenericApiEndpoints('families', 'family'),
	...seriesApi,
	...operationsApi,

	getMetadataStructureList: () => ['metadataStructureDefinition'],
	getMetadataAttributesList: () => ['metadataAttributes'],

	getVarBookExport: (id, MimeType) => [
		`operation/${id}/variableBook`,
		{
			headers: {
				Accept: MimeType,
				'Content-Type': 'text/plain',
			},
		},
		(res) => res,
	],
};

export default API.buildApi('operations', api);
