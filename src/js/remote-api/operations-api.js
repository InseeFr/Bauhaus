import buildApi from './build-api';
import simsApi from './operations/sims';
import indicatorApi from './operations/indicator';

const api = {
	...simsApi,
	...indicatorApi,

	getSeriesList: () => ['series/withSims'],
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
		res => Promise.resolve(family.id),
	],
	postFamily: family => [
		`family`,
		{
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(family),
		},
		res => res.text(),
	],
	putSeries: series => [
		`series/${series.id}`,
		{
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(series),
		},
		res => Promise.resolve(series.id),
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
		res => Promise.resolve(operation.id),
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
