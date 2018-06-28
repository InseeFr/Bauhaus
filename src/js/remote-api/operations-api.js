import buildApi from './build-api';

const api = {
	getSeriesList: () => ['series.json'],
	getOperationsList: () => ['operations.json'],
	getFamiliesList: () => ['families.json'],
	getFamily: id => ['family.json'],
	getOperation: id => ['operation.json'],
	getSerie: id => ['serie.json'],
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

export default buildApi('fake-data', api);
