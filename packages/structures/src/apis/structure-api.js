import { API } from 'bauhaus-utilities';

const api = {
	getStructures: () => [''],
	getMutualizedComponents: () => ['components'],
	getStructuresForSearch: () => ['search'],
	getMutualizedComponentsForSearch: () => ['components/search'],
	getMutualizedComponent: id => ['components/' + id],
	putMutualizedComponent: component => [
		`components/${component.id}`,
		{
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(component),
		},
		() => Promise.resolve(component.id),
	],
	postMutualizedComponent: component => [
		`components`,
		{
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(component),
		},
		res => res.text(),
	],

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
