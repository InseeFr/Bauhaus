import buildApi from './build-api';

const api = {
	getSeriesList: () => ['series.json'], //TODO Change to series
	getOperationsList: () => ['operations.json'], //TODO Change to operations
	getFamiliesList: () => ['families.json'], //TODO Change to families
	getIndicatorsList: () => ['indicators.json'], //TODO Change to indicators
	getFamily: id => ['family.json'], //TODO Change to family/:id
	getOperation: id => ['operation.json'], //TODO Change to operation/:id
	getSerie: id => ['serie.json'], //TODO Change to series/:id
	getCodesList: notation => [
		notation === 'CL_FREQ' ? 'frequencies.json' : 'categories.json',
	], //TODO Change to codeList/:notation
	getCode: (notation, code) => [
		notation === 'CL_FREQ' ? 'frequency.json' : 'category.json',
	], //TODO Change to codeList/:notation/code/:code
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
export default buildApi('fake-data', api);
