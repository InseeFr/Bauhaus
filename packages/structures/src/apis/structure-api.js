import { API } from 'bauhaus-utilities';

const api = {
	getStructures: () => [''],
	getMutualizedComponents: () => ['components'],
	getMutualizedAttributes: () => ['attributes'],
	getStructuresForSearch: () => ['search'],
	getMutualizedComponentsForSearch: () => ['components/search'],
	publishMutualizedComponent: (component) => [
		`components/${component.id}/publish`,
		{
			method: 'PUT',
		},
		() => Promise.resolve(),
	],
	getMutualizedComponent: (id) => ['components/' + id],
	deleteMutualizedComponent: (id) => [
		'components/' + id,
		{},
		() => Promise.resolve(),
	],
	putMutualizedComponent: (component) => [
		`components/${component.id}`,
		{
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(component),
		},
		() => Promise.resolve(component.id),
	],
	postMutualizedComponent: (component) => [
		`components`,
		{
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(component),
		},
		(res) => res.text(),
	],

	getStructure: (id) => [`structure/${id}`],
	deleteStructure: (structureId) => [
		`structure/${structureId}`,
		(res) => res.text(),
	],
	publishStructure: (structure) => [
		`structure/${structure.id}/publish`,
		{
			method: 'PUT',
		},
		() => Promise.resolve(),
	],
	postStructure: (dsd) => [
		'structure',
		{
			headers: {
				Accept: 'text/plain',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(dsd),
		},
		(res) => res.text(),
	],
	putStructure: (dsd) => [
		`structure/${dsd.id}`,
		{
			headers: {
				Accept: 'text/plain',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(dsd),
		},
		(res) => res.text(),
	],
};

export default API.buildApi('structures', api);
