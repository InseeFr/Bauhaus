import { RouteObject } from 'react-router-dom';

export const routes: RouteObject[] = [
	{
		path: 'families',
		lazy: () => import('../../modules-classifications/families/home-container'),
	},
	{
		path: 'family/:id',
		lazy: () =>
			import(
				'../../modules-classifications/families/visualization/home-container'
			),
	},
	{
		path: 'series',
		lazy: () => import('../../modules-classifications/series/home-container'),
	},
	{
		path: 'series/:id',
		lazy: () =>
			import(
				'../../modules-classifications/series/visualization/home-container'
			),
	},
	{
		path: '',
		lazy: () => import('../../modules-classifications/home-container'),
	},
	{
		path: 'classification/:id',
		lazy: () =>
			import('../../modules-classifications/visualization/home-container'),
	},
	{
		path: 'classification/:id/modify',
		lazy: () => import('../edition'),
	},
	{
		path: 'classification/:id/items',
		lazy: () =>
			import(
				'../../modules-classifications/visualization/items/home-container'
			),
	},
	{
		path: 'classification/:id/tree',
		lazy: () =>
			import('../../modules-classifications/visualization/tree/home-container'),
	},
	{
		path: 'classification/:classificationId/level/:levelId',
		lazy: () => import('../../modules-classifications/level/home-container'),
	},
	{
		path: 'classification/:classificationId/item/:itemId',
		lazy: () => import('../../modules-classifications/item/home-container'),
	},
	{
		path: 'classification/:classificationId/item/:itemId/modify',
		lazy: () => import('../../modules-classifications/item/edition'),
	},
	{
		path: 'classification/:classificationId/item/:itemId/compare',
		lazy: () =>
			import('../../modules-classifications/item/compare/home-container'),
	},
	{
		path: 'correspondences',
		lazy: () =>
			import('../../modules-classifications/correspondences/home-container'),
	},
	{
		path: 'correspondence/:id',
		lazy: () =>
			import(
				'../../modules-classifications/correspondences/visualization/home-container'
			),
	},
	{
		path: 'correspondence/:correspondenceId/association/:associationId',
		lazy: () =>
			import(
				'../../modules-classifications/correspondences/association/home-container'
			),
	},
];
