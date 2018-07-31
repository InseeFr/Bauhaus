import buildApi from './build-api';

const api = {
	getSeriesList: () => ['series'],
	getOperationsList: () => ['operations'],
	getFamiliesList: () => ['families'],
	getIndicatorsList: () => ['indicators'],
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
};

//TODO change to operations
export default buildApi('operations', api);
