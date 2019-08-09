import React, { Suspense, lazy } from 'react';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import Loading from 'js/components/shared/loading';

import auth from 'js/components/auth/hoc';

import Error from 'js/components/shared/error/error';
import NotFound from 'js/components/shared/not-found/';

import App from 'js/components/app';
import MenuDispatcher from 'js/components/menu/home-container';
import Role from 'js/components/administration/roles/home-container';

const pages = process.env.REACT_APP_APPLICATIONS.split(',').reduce(
	(acc, appName) => {
		const app = appName.trim();
		return {
			...acc,
			[app]: lazy(() => import('js/components/router/' + app)),
		};
	},
	{}
);

const getComponent = pageName => {
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
	auth(({ error }) => (
		<React.Fragment>
			<Route path="/" component={MenuDispatcher} />
			<Suspense fallback={<Loading />}>
				<Switch>
					{error && <Route path="/" component={Error} />}
					<Route exact path="/" render={() => getHomePage()} />
					<Route path="/administration/roles" component={Role} />
					<Route
						path="/(concept|concepts|collections|collection)"
						component={getComponent('concepts')}
					/>
					<Route
						path="/classifications"
						component={getComponent('classifications')}
					/>
					<Route path="/operations" component={getComponent('operations')} />
					<Route path="*" component={NotFound} />
				</Switch>
			</Suspense>
		</React.Fragment>
	))
);
