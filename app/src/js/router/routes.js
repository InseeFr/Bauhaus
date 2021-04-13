import React, { Suspense, lazy } from 'react';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import { Loading, Error } from '@inseefr/wilco';

import auth from 'js/applications/auth/hoc';

import NotFound, { UnderMaintenance } from 'js/applications/shared/not-found/';

import App from 'js/app';
import Habilitation from 'js/applications/habilitation';
import { useSelector } from 'react-redux';

const pages = process.env.REACT_APP_APPLICATIONS.split(',').reduce(
	(acc, appName) => {
		const app = appName.trim();
		return {
			...acc,
			[app]: lazy(() => import('js/applications/' + app + '/routes')),
		};
	},
	{}
);

const getComponent = (pageName, modules) => {
	if(!modules.includes(pageName)){
		return UnderMaintenance
	}
	return pages[pageName] || NotFound;
};

const getHomePage = () => {
	const pageNames = Object.keys(pages);
	return pageNames.length === 1 ? (
		<Redirect to={'/' + pageNames[0]} />
	) : (
		<App />
	);
};
export default withRouter(
	auth(({ error }) => {
		const modules = useSelector(state => state.app.properties.modules);
		return (
			<React.Fragment>
				<Suspense fallback={<Loading />}>
					<Switch>
						{error && <Route path="/" component={Error} />}
						<Route exact path="/" render={() => getHomePage()} />
						<Route path="/habilitation" component={Habilitation} />
						<Route
							path="/(concept|concepts|collections|collection)"
							component={getComponent('concepts', modules)}
						/>
						<Route
							path="/classifications"
							component={getComponent('classifications', modules)}
						/>
						<Route path="/operations" component={getComponent('operations', modules)} />
						<Route path="/structures" component={getComponent('structures', modules)} />
						<Route path="/codelists" component={getComponent('codelists', modules)} />
						<Route path="*" component={NotFound} />
					</Switch>
				</Suspense>
			</React.Fragment>
		)
	})
);
