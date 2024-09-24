import { Suspense, lazy, useMemo } from 'react';
import { createBrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import auth from '../../auth/hoc';

import { Loading, NotFound } from '../../components';
import App from '../app';
import { useAppContext } from '../app-context';
import { ModuleHomePage } from './module-home-page';

const HomePage = () => {
	const {
		properties: { modules },
	} = useAppContext();

	const pages = useMemo(() => {
		return modules.reduce((acc: Record<string, any>, appName: string) => {
			const app = appName.trim();
			return {
				...acc,
				[app]: lazy(() => import(`../../modules-${app}/routes/index.tsx`)),
			};
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
/*
const router = createBrowserRouter([
	{
		path: '/',
		element: <HomePage />,
	},
	{
		path: 'concepts/*',

	}
]);*/
export default auth(() => {
	const {
		properties: { activeModules, modules },
	} = useAppContext();

	const pages = useMemo(() => {
		return modules.reduce((acc: Record<string, any>, appName: string) => {
			const app = appName.trim();
			return {
				...acc,
				[app]: lazy(() => import(`../../modules-${app}/routes/index.tsx`)),
			};
		}, []);
	}, [modules]);

	return (
		<Suspense fallback={<Loading />}>
			<Routes>
				<Route path="/" element={<HomePage pages={pages} />} />

				<Route
					path="concepts/*"
					element={
						<ModuleHomePage
							pageName="concepts"
							pages={pages}
							activeModules={activeModules}
						/>
					}
				/>

				<Route
					path="/classifications/*"
					element={
						<ModuleHomePage
							pageName="classifications"
							pages={pages}
							activeModules={activeModules}
						/>
					}
				/>
				<Route
					path="/operations/*"
					element={
						<ModuleHomePage
							pageName="operations"
							pages={pages}
							activeModules={activeModules}
						/>
					}
				/>
				<Route
					path="/structures/*"
					element={
						<ModuleHomePage
							pageName="structures"
							pages={pages}
							activeModules={activeModules}
						/>
					}
				/>

				<Route
					path="/datasets/*"
					element={
						<ModuleHomePage
							pageName="datasets"
							pages={pages}
							activeModules={activeModules}
						/>
					}
				/>
				<Route
					path="/codelists/*"
					element={
						<ModuleHomePage
							pageName="codelists"
							pages={pages}
							activeModules={activeModules}
						/>
					}
				/>

				<Route path="*" element={<NotFound />} />
			</Routes>
		</Suspense>
	);
});
