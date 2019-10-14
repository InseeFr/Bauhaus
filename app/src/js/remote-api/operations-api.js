import buildApi from './build-api';
import simsApi from './operations/sims';
import indicatorApi from './operations/indicator';
import familyApi from './operations/family';
import seriesApi from './operations/series';
import operationsApi from './operations/operation';

const api = {
	...simsApi,
	...indicatorApi,
	...familyApi,
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
		res => res,
	],
};

export default buildApi('operations', api);
