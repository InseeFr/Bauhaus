import React, { Suspense, lazy, useEffect } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { Loading } from '@inseefr/wilco';

import auth from 'js/applications/auth/hoc';

import NotFound, { UnderMaintenance } from 'js/applications/shared/not-found/';
import { getEnvVar } from 'js/utils/env';

import App from 'js/app';
import { useSelector } from 'react-redux';

const pages = getEnvVar('APPLICATIONS')
	.split(',')
	.reduce((acc, appName) => {
		const app = appName.trim();
		return {
			...acc,
			[app]: lazy(() => import('js/applications/' + app + '/routes')),
		};
	}, {});

const getComponent = (pageName, modules) => {
	if (!modules.includes(pageName)) {
		return UnderMaintenance;
	}
	if (!pages[pageName]) {
		return NotFound;
	}
	const Component = pages[pageName];
	return React.memo(() => {
		useEffect(() => {
			document.getElementById('root-app').classList = [pageName];
		}, []);
		return <Component />;
	});
};

const getHomePage = () => {
	const pageNames = Object.keys(pages);
	return pageNames.length === 1 ? (
		<Redirect to={'/' + pageNames[0]} />
	) : (
		<App />
	);
};
export default auth(() => {
	const modules = useSelector(state => state.app.properties.modules);
	return (
		<React.Fragment>
			<Suspense fallback={<Loading />}>
				<Switch>
					<Route exact path="/" render={() => getHomePage()} />
					<Route
						path="/(concept|concepts|collections|collection)"
						component={getComponent('concepts', modules)}
					/>
					<Route
						path="/classifications"
						component={getComponent('classifications', modules)}
					/>
					<Route
						path="/operations"
						component={getComponent('operations', modules)}
					/>
					<Route
						path="/structures"
						component={getComponent('structures', modules)}
					/>
					<Route
						path="/datasets"
						component={getComponent('datasets', modules)}
					/>
					<Route
						path="/(codelists|codelists-partial)"
						component={getComponent('codelists', modules)}
					/>
					<Route path="*" component={NotFound} />
				</Switch>
			</Suspense>
		</React.Fragment>
	);
});
