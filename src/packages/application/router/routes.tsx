import { Suspense, useMemo } from 'react';
import {
	createBrowserRouter,
	Navigate,
	Outlet,
	RouterProvider,
} from 'react-router-dom';

import { Loading } from '@components/loading';
import { NotFound, UnderMaintenance } from '@components/not-found';

import { RBACLink } from '.';
import { useOidc } from '../../auth/create-oidc';
import { withAuth } from '../../auth/hoc';
import D from '../../i18n';
import { routes as ClassificationsRoutes } from '../../modules-classifications/routes/index';
import { routes as CodelistsRoutes } from '../../modules-codelists/routes/index';
import { routes as ConceptsRoutes } from '../../modules-concepts/routes/index';
import { routes as DatasetsRoutes } from '../../modules-datasets/routes/index';
import { routes as OperationsRoutes } from '../../modules-operations/routes/index';
import { routes as StructuresRoutes } from '../../modules-structures/routes/index';
import { routes as DDIRoutes } from '../../modules-ddi/routes/index';
import App from '../app';
import { useAppContext } from '../app-context';
import './routes.css';

const HomePage = () => {
	const {
		properties: { modules },
	} = useAppContext();

	const pages = useMemo(() => {
		return modules.reduce((acc: string[], appName: string) => {
			return [...acc, appName.trim()];
		}, []);
	}, [modules]);

	if (!pages) {
		return null;
	}

	const pageNames = Object.keys(pages);

	if (pageNames.length === 1) {
		return <Navigate to={'/' + pageNames[0]} replace />;
	}

	return <App />;
};

const MainLayout = withAuth(() => {
	return (
		<RBACLink>
			<Outlet />
		</RBACLink>
	);
});

export const Logout = () => {
	const { login } = useOidc({
		assertUserLoggedIn: false,
	});
	return (
		<div id="login" className="flex">
			<button
				type="button"
				onClick={() => {
					if (!login) {
						return;
					}
					login({
						doesCurrentHrefRequiresAuth: true,
						redirectUrl: '/',
					});
				}}
				className="btn btn-primary"
			>
				{D.authentication.login}
			</button>
		</div>
	);
};

export default () => {
	const {
		properties: { activeModules, modules },
	} = useAppContext();

	const pages = useMemo(() => {
		return modules.reduce((acc: string[], appName: string) => {
			const app = appName.trim();
			return [...acc, app];
		}, []);
	}, [modules]);

	const getModuleHomePageRouter = (pageName: string) => {
		if (!activeModules.includes(pageName)) {
			return {
				element: <UnderMaintenance />,
			};
		}
		if (!pages.includes(pageName.trim())) {
			return {
				elemement: <NotFound />,
			};
		}

		return {
			lazy: () => import(`../../modules-${pageName}/routes/layout.tsx`),
		};
	};
	const router = createBrowserRouter([
		{
			path: 'logout',
			element: <Logout />,
		},
		{
			path: '',
			element: <MainLayout />,
			children: [
				{ path: '', element: <HomePage /> },
				{
					path: 'concepts',
					...getModuleHomePageRouter('concepts'),
					children: ConceptsRoutes,
				},
				{
					path: 'classifications',
					...getModuleHomePageRouter('classifications'),
					children: ClassificationsRoutes,
				},
				{
					path: 'operations',
					...getModuleHomePageRouter('operations'),
					children: OperationsRoutes,
				},
				{
					path: 'structures',
					...getModuleHomePageRouter('structures'),
					children: StructuresRoutes,
				},
				{
					path: 'datasets',
					...getModuleHomePageRouter('datasets'),
					children: DatasetsRoutes,
				},
				{
					path: 'codelists',
					...getModuleHomePageRouter('codelists'),
					children: CodelistsRoutes,
				},
				{
					path: 'ddi',
					...getModuleHomePageRouter('ddi'),
					children: DDIRoutes,
				},
				{
					path: '*',
					element: <NotFound />,
				},
			],
		},
	]);

	return (
		<Suspense fallback={<Loading />}>
			<RouterProvider router={router}></RouterProvider>
		</Suspense>
	);
};
