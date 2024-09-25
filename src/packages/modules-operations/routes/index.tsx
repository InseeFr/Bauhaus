import { Navigate, RouteObject } from 'react-router-dom';

import {
	Component,
	CREATE,
	DUPLICATE,
	UPDATE,
	VIEW,
} from '../../modules-operations/msd/';

export const routes: RouteObject[] = [
	{
		path: '',
		element: <Navigate to="/operations/series" replace />,
	},
	{
		path: 'families',
		lazy: () => import('../../modules-operations/families/'),
	},
	{
		path: 'families/search',
		lazy: () => import('../../modules-operations/families/search'),
	},
	{
		path: 'families/create',
		lazy: () => import('../../modules-operations/families/edition'),
	},
	{
		path: 'family/:id',
		lazy: () => import('../../modules-operations/families/visualization/'),
	},
	{
		path: 'family/:id/modify',
		lazy: () => import('../../modules-operations/families/edition'),
	},
	{
		path: 'series',
		lazy: () => import('../../modules-operations/series/'),
	},
	{
		path: 'series/search',
		lazy: () => import('../../modules-operations/series/search'),
	},
	{
		path: 'series/create',
		lazy: () => import('../../modules-operations/series/edition'),
	},
	{
		path: 'series/:id',
		lazy: () => import('../../modules-operations/series/visualization/'),
	},
	{
		path: 'series/:id/modify',
		lazy: () => import('../../modules-operations/series/edition'),
	},
	{
		path: 'operations',
		lazy: () => import('../../modules-operations/operations/'),
	},
	{
		path: 'operation/create',
		lazy: () => import('../../modules-operations/operations/edition'),
	},
	{
		path: 'operation/:id',
		lazy: () => import('../../modules-operations/operations/visualization/'),
	},
	{
		path: 'operation/:id/modify',
		lazy: () => import('../../modules-operations/operations/edition'),
	},
	{
		path: 'indicators',
		lazy: () => import('../../modules-operations/indicators/'),
	},
	{
		path: 'indicator/create',
		lazy: () => import('../../modules-operations/indicators/edition'),
	},
	{
		path: 'indicator/:id',
		lazy: () => import('../../modules-operations/indicators/visualization/'),
	},
	{
		path: 'indicator/:id/modify',
		lazy: () => import('../../modules-operations/indicators/edition'),
	},
	{
		path: 'documents',
		lazy: () => import('../../modules-operations/document/'),
	},
	{
		path: 'link/create',
		lazy: () => import('../../modules-operations/document/edition'),
	},
	{
		path: 'document/create',
		lazy: () => import('../../modules-operations/document/edition'),
	},
	{
		path: 'link/:id',
		lazy: () => import('../../modules-operations/document/visualization'),
	},
	{
		path: 'document/:id',
		lazy: () => import('../../modules-operations/document/visualization'),
	},
	{
		path: 'link/:id/modify',
		lazy: () => import('../../modules-operations/document/edition'),
	},
	{
		path: 'document/:id/modify',
		lazy: () => import('../../modules-operations/document/edition'),
	},
	{
		path: 'msd',
		lazy: () => import('../../modules-operations/msd/'),
	},
	{
		path: 'help/:idSection',
		lazy: () => import('../../modules-operations/msd/'),
	},
	{
		path: 'operation/:idParent/sims/create',
		element: (
			<Component mode={CREATE} disableSectionAnchor parentType="operation" />
		),
	},
	{
		path: 'series/:idParent/sims/create',
		element: (
			<Component mode={CREATE} disableSectionAnchor parentType="series" />
		),
	},
	{
		path: 'indicator/:idParent/sims/create',
		element: (
			<Component mode={CREATE} disableSectionAnchor parentType="indicator" />
		),
	},
	{
		path: 'sims/:id',
		element: <Component mode={VIEW} />,
	},
	{
		path: 'sims/:id/modify',
		element: <Component mode={UPDATE} disableSectionAnchor />,
	},
	{
		path: 'sims/:id/duplicate',
		element: <Component mode={DUPLICATE} disableSectionAnchor />,
	},
	{
		path: 'sims/:id/section/:idSection',
		element: <Component mode={VIEW} />,
	},
	{
		path: 'tree',
		lazy: () => import('../tree'),
	},
];
