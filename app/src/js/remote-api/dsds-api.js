import buildApi from './build-api';

const api = {
	getDSDs: () => [''],
	getDSD: id => [`dsd/${id}`],
	getComponents: id => [`dsd/${id}/components`],
	// postConcept: concept => [
	// 	'concept',
	// 	{
	// 		headers: {
	// 			Accept: 'text/plain',
	// 			'Content-Type': 'application/json',
	// 		},
	// 		body: JSON.stringify(concept),
	// 	},
	// 	res =>
	// 		res.text(id => ({
	// 			id,
	// 			concept,
	// 		})),
	// ],
};

export default buildApi('dsds', api);
