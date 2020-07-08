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

	getStructure: id => [`structure/${id}`],
	deleteStructure: structureId => [
		`structure/${structureId}`,
		res => res.text(),
	],
	postStructure: dsd => [
		'structure',
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
		`structure/${dsd.id}`,
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

export default API.buildApi('structures', api);
