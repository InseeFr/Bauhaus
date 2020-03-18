import { API } from 'bauhaus-utilities';

const api = {
	getStructures: () => [''],
	getStructure: id => [`dsd/${id}`],
	getComponents: id => [`dsd/${id}/components`],
	getStructureDetailedComponents: dsdId => [`dsd/${dsdId}/detailed-components`],
	getStructureComponent: (dsdId, componentId) => [
		`dsd/${dsdId}/component/${componentId}`,
	],
	postStructure: dsd => [
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
	putStructure: dsd => [
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

export default API.buildApi('dsds', api);
