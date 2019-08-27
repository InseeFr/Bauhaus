import buildApi from '../build-api';

const api = {
	getDSDs: () => [''],
	getDSD: id => [`dsd/${id}`],
	getComponents: id => [`dsd/${id}/components`],
	getDSDDetailedComponents: dsdId => [`dsd/${dsdId}/detailed-components`],
	getDSDComponent: (dsdId, componentId) => [
		`dsd/${dsdId}/component/${componentId}`,
	],
	postDSD: dsd => [
		'dsd',
		{
			headers: {
				Accept: 'text/plain',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(dsd),
		},
		res => res.text(),
	],
	putDSD: dsd => [
		`dsd/${dsd.id}`,
		{
			headers: {
				Accept: 'text/plain',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(dsd),
		},
		res => res.text(),
	],
};

export default buildApi('dsds', api);
