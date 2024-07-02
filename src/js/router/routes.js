import { Suspense, lazy, useEffect, useMemo, memo } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { Loading } from '@inseefr/wilco';

import auth from 'js/applications/auth/hoc';

import NotFound, { UnderMaintenance } from 'js/applications/shared/not-found/';

import App from 'js/app';
import { useSelector } from 'react-redux';

const getComponent = (pageName, pages, activeModules) => {
	if (!activeModules.includes(pageName)) {
		return UnderMaintenance;
	}
	if (!pages[pageName]) {
		return NotFound;
	}
	const Component = pages[pageName];
	return memo(() => {
		useEffect(() => {
			document.getElementById('root-app').classList = [pageName];
		}, []);
		return <Component />;
	});
};

const getHomePage = (pages) => {
	if (!pages) {
		return null;
	}

	const pageNames = Object.keys(pages);
	return pageNames.length === 1 ? (
		<Redirect to={'/' + pageNames[0]} />
	) : (
		<App />
	);
};
export default auth(() => {
	const activeModules = useSelector(
		(state) => state.app.properties.activeModules
	);
	const modules = useSelector((state) => state.app.properties.modules);
	const pages = useMemo(() => {
		return modules.reduce((acc, appName) => {
			const app = appName.trim();
			return {
				...acc,
				[app]: lazy(() => import('js/applications/' + app + '/routes')),
			};
		}, []);
	}, [modules]);

	const homePage = getHomePage(pages);

	if (!homePage) {
		return null;
	}

	return (
		<>
			<Suspense fallback={<Loading />}>
				<Switch>
					<Route exact path="/" render={() => homePage} />
					<Route
						path="/(concept|concepts|collections|collection)"
						component={getComponent('concepts', pages, activeModules)}
					/>
					<Route
						path="/classifications"
						component={getComponent('classifications', pages, activeModules)}
					/>
					<Route
						path="/operations"
						component={getComponent('operations', pages, activeModules)}
					/>
					<Route
						path="/structures"
						component={getComponent('structures', pages, activeModules)}
					/>
					<Route
						path="/datasets"
						component={getComponent('datasets', pages, activeModules)}
					/>
					<Route
						path="/(codelists|codelists-partial)"
						component={getComponent('codelists', pages, activeModules)}
					/>
					<Route path="*" component={NotFound} />
				</Switch>
			</Suspense>
		</>
	);
});
