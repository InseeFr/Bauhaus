import { RouteObject } from 'react-router-dom';

export const routes: RouteObject[] = [
	{
		path: '',
		lazy: () => import('../../modules-concepts/home'),
	},
	{
		path: 'validation',
		lazy: () => import('../../modules-concepts/validation/home-container'),
	},
	{
		path: 'search',
		lazy: () => import('../../modules-concepts/advanced-search/home-container'),
	},
	{
		path: 'export',
		lazy: () => import('../../modules-concepts/export/home-container'),
	},
	{
		path: 'create',
		lazy: () =>
			import('../../modules-concepts/edition-creation/creation-container'),
	},
	{
		path: ':id',
		lazy: () => import('../../modules-concepts/visualization/home-container'),
	},
	{
		path: ':id/compare',
		lazy: () => import('../../modules-concepts/compare/home-container'),
	},
	{
		path: ':id/modify',
		lazy: () =>
			import('../../modules-concepts/edition-creation/edition-container'),
	},
	{
		path: 'administration',
		lazy: () => import('../../modules-concepts/administration/home'),
	},
	{
		path: 'administration/dashboard',
		lazy: () =>
			import(
				'../../modules-concepts/administration/dashboard/concepts/home-container'
			),
	},
	{
		path: 'collections',
		lazy: () => import('../collections/home-container'),
	},
	{
		path: 'collections/create',
		lazy: () => import('../collections/edition-creation/creation-container'),
	},
	{
		path: 'collections/:id',
		lazy: () => import('../collections/visualization/home-container'),
	},
	{
		path: 'collections/:id/modify',
		lazy: () => import('../collections/edition-creation/edition-container'),
	},
	{
		path: 'collections/validation',
		lazy: () => import('../collections/validation/home-container'),
	},
	{
		path: 'collections/export',
		lazy: () => import('../collections/export/home-container'),
	},
];
