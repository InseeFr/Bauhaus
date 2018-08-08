import buildApi from './build-api';

const api = {
	getSeriesList: () => ['series'],
	getOperationsList: () => ['operations'],
	getFamiliesList: () => ['families'],
	getIndicatorsList: () => ['indicators'],
	getFamily: id => [`family/${id}`],
	getOperation: id => [`operation/${id}`],
	getSerie: id => [`series/${id}`],
	getIndicator: id => [`indicator/${id}`],
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
	postFamily: family => [
		`family/${family.id}`,
		{
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(family),
		},
		() => {},
	],
	postSeries: series => [
		`series/${series.id}`,
		{
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(series),
		},
		() => {},
	],
	postOperation: operation => [
		`operation/${operation.id}`,
		{
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(operation),
		},
		() => {},
	],
	postIndicator: indicator => [
		`indicator/${indicator.id}`,
		{
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(indicator),
		},
		() => {},
	],
};

//TODO change to operations
export default buildApi('operations', api);
