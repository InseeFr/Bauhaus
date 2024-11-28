import { Navigate, RouteObject } from 'react-router-dom';

import { OperationsApi } from '@sdk/operations-api';

import { CREATE, DUPLICATE, UPDATE, VIEW } from '../msd/constant';

export const routes: RouteObject[] = [
	{
		path: '',
		element: <Navigate to="/operations/series" replace />,
	},
	{
		path: 'families',
		lazy: () => import('../families/'),
		loader: () => OperationsApi.getAllFamilies(),
		shouldRevalidate: ({ currentUrl, nextUrl }) => {
			return currentUrl.pathname !== nextUrl.pathname;
		},
	},
	{
		path: 'families/search',
		lazy: () => import('../families/search'),
		loader: () => OperationsApi.getAllFamiliesForAdvancedSearch(),
		shouldRevalidate: ({ currentUrl, nextUrl }) => {
			return currentUrl.pathname !== nextUrl.pathname;
		},
	},
	{
		path: 'families/create',
		lazy: () => import('../families/edition'),
	},
	{
		path: 'family/:id',
		lazy: () => import('../families/visualization/'),
	},
	{
		path: 'family/:id/modify',
		lazy: () => import('../families/edition'),
	},
	{
		path: 'series',
		lazy: () => import('../series/'),
	},
	{
		path: 'series/search',
		lazy: () => import('../series/search'),
	},
	{
		path: 'series/create',
		lazy: () => import('../series/edition'),
	},
	{
		path: 'series/:id',
		lazy: () => import('../series/visualization/'),
	},
	{
		path: 'series/:id/modify',
		lazy: () => import('../series/edition'),
	},
	{
		path: 'operations',
		lazy: () => import('../operations/'),
	},
	{
		path: 'operation/create',
		lazy: () => import('../operations/edition'),
	},
	{
		path: 'operation/:id',
		lazy: () => import('../operations/visualization/'),
	},
	{
		path: 'operation/:id/modify',
		lazy: () => import('../operations/edition'),
	},
	{
		path: 'indicators',
		lazy: () => import('../indicators/'),
	},
	{
		path: 'indicator/create',
		lazy: () => import('../indicators/edition'),
	},
	{
		path: 'indicator/:id',
		lazy: () => import('../indicators/visualization/'),
	},
	{
		path: 'indicator/:id/modify',
		lazy: () => import('../indicators/edition'),
	},
	{
		path: 'documents',
		lazy: () => import('../document/'),
	},
	{
		path: 'link/create',
		lazy: () => import('../document/edition'),
	},
	{
		path: 'document/create',
		lazy: () => import('../document/edition'),
	},
	{
		path: 'link/:id',
		lazy: () => import('../document/visualization'),
	},
	{
		path: 'document/:id',
		lazy: () => import('../document/visualization'),
	},
	{
		path: 'link/:id/modify',
		lazy: () => import('../document/edition'),
	},
	{
		path: 'document/:id/modify',
		lazy: () => import('../document/edition'),
	},
	{
		path: 'msd',
		lazy: () => import('../msd/'),
	},
	{
		path: 'help/:idSection',
		lazy: () => import('../msd/'),
	},
	{
		path: 'operation/:idParent/sims/create',
		loader: ({ params }) => {
			return {
				mode: CREATE,
				disableSectionAnchor: true,
				parentType: 'operation',
				baseUrl: `/operations/operation/${params.idParent}/sims/create`,
			};
		},
		lazy: () => import('../msd/'),
	},
	{
		path: 'series/:idParent/sims/create',
		loader: ({ params }) => {
			return {
				mode: CREATE,
				disableSectionAnchor: true,
				parentType: 'series',
				baseUrl: `/operations/series/${params.idParent}/sims/create`,
			};
		},
		lazy: () => import('../msd/'),
	},
	{
		path: 'indicator/:idParent/sims/create',
		loader: ({ params }) => {
			return {
				mode: CREATE,
				disableSectionAnchor: true,
				parentType: 'indicator',
				baseUrl: `/operations/indicator/${params.idParent}/sims/create`,
			};
		},
		lazy: () => import('../msd/'),
	},
	{
		path: 'sims/:id',
		loader: ({ params }) => {
			return {
				mode: VIEW,
				baseUrl: `/operations/sims/${params.id}/section/`,
			};
		},
		lazy: () => import('../msd/'),
	},
	{
		path: 'sims/:id/modify',
		loader: ({ params }) => {
			return {
				mode: UPDATE,
				disableSectionAnchor: true,
				baseUrl: `/operations/sims/${params.id}/modify`,
			};
		},
		lazy: () => import('../msd/'),
	},
	{
		path: 'sims/:id/duplicate',
		loader: ({ params }) => {
			return {
				mode: DUPLICATE,
				disableSectionAnchor: true,
				baseUrl: `/operations/sims/${params.id}/duplicate`,
			};
		},
		lazy: () => import('../msd/'),
	},
	{
		path: 'sims/:id/section/:idSection',
		loader: ({ params }) => {
			return {
				mode: VIEW,
				baseUrl: `/operations/sims/${params.id}/section/`,
			};
		},
		lazy: () => import('../msd/'),
	},
	{
		path: 'tree',
		lazy: () => import('../tree'),
	},
];
