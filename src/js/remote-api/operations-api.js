import simsApi from './operations/sims';
import indicatorApi from './operations/indicator';
import seriesApi from './operations/series';
import operationsApi from './operations/operation';
import { buildApi, generateGenericApiEndpoints } from '../new-architecture/sdk';

const api = {
	...simsApi,
	...indicatorApi,
	...generateGenericApiEndpoints('families', 'family'),
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

export default buildApi('operations', api);
