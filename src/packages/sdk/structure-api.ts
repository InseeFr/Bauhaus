import { Component } from '../model/structures/Component';
import { Structure } from '../model/structures/Structure';
import { buildApi } from './build-api';

const api = {
	getStructures: () => [''],
	getMutualizedComponents: () => ['components'],
	getMutualizedAttributes: () => ['components/attributes'],
	getStructuresForSearch: () => ['search'],
	getMutualizedComponentsForSearch: () => ['components/search'],
	publishMutualizedComponent: (component: Component) => [
		`components/${component.id}/validate`,
		{
			method: 'PUT',
		},
		() => Promise.resolve(),
	],
	getMutualizedComponent: (id: string) => ['components/' + id],
	deleteMutualizedComponent: (id: string) => [
		'components/' + id,
		{},
		() => Promise.resolve(),
	],
	putMutualizedComponent: (component: Component) => [
		`components/${component.id}`,
		{
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(component),
		},
		() => Promise.resolve(component.id),
	],
	postMutualizedComponent: (component: Component) => [
		`components`,
		{
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(component),
		},
		(res: Response) => res.text(),
	],

	getStructure: (id: string) => [`structure/${id}`],
	deleteStructure: (structureId: string) => [
		`structure/${structureId}`,
		(res: Response) => res.text(),
	],
	publishStructure: (structure: Structure) => [
		`structure/${structure.id}/validate`,
		{
			method: 'PUT',
		},
		() => Promise.resolve(),
	],
	postStructure: (dsd: Structure) => [
		'structure',
		{
			headers: {
				Accept: 'text/plain',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(dsd),
		},
		(res: Response) => res.text(),
	],
	putStructure: (dsd: Structure) => [
		`structure/${dsd.id}`,
		{
			headers: {
				Accept: 'text/plain',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(dsd),
		},
		(res: Response) => res.text(),
	],
};

export const StructureApi = buildApi('structures', api) as any;

export * from './structures/saveComponent';
