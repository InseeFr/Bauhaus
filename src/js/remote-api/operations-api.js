import buildApi from './build-api';
import simsApi from './operations/sims';
import indicatorApi from './operations/indicator';

const api = {
	...simsApi,
	...indicatorApi,

	getSeriesList: () => ['series'],
	getOperationsList: () => ['operations'],
	getFamiliesList: () => ['families'],

	getMetadataStructureList: () => ['metadataStructureDefinition'],
	getMetadataAttributesList: () => ['metadataAttributes'],
	getFamily: id => [`family/${id}`],
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
	putFamily: family => [
		`family/${family.id}`,
		{
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(family),
		},
		() => {},
	],
	putSeries: series => [
		`series/${series.id}`,
		{
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(series),
		},
		() => {},
	],
	putOperation: operation => [
		`operation/${operation.id}`,
		{
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(operation),
		},
		() => {},
	],
};

//TODO change to operations
export default buildApi('operations', api);
