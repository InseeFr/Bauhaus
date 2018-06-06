import buildApi from './build-api';

const api = {
	getSeriesList: () => ['series'],
	getOperationsList: () => ['operations'],
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
