import { Suspense, lazy, useEffect, useMemo, memo } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import auth from '../../auth/hoc';

import App from '../app';
import { Loading, NotFound, UnderMaintenance } from '../../components';
import { useAppContext } from '../app-context';

const getComponent = (
	pageName: string,
	pages: Record<string, any>,
	activeModules: string[]
) => {
	if (!activeModules.includes(pageName)) {
		return UnderMaintenance;
	}
	if (!pages[pageName]) {
		return NotFound;
	}
	const Component = pages[pageName];
	return memo(() => {
		useEffect(() => {
			// @ts-ignore
			document.getElementById('root-app').removeAttribute('class');
			// @ts-ignore
			document.getElementById('root-app').classList.add(pageName);
		}, []);
		return <Component />;
	});
};

const getHomePage = (pages: Record<string, string>) => {
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
	const {
		properties: { activeModules },
	} = useAppContext();
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

	const homePage = getHomePage(pages);

	if (!homePage) {
		return null;
	}

	return (
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
	);
});
