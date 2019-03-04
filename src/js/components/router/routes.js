import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';

import auth from 'js/components/auth/hoc';

import Error from 'js/components/shared/error/error';
import NotFound from 'js/components/shared/not-found/';

import App from 'js/components/app';
import MenuDispatcher from 'js/components/menu/home-container';
import Role from 'js/components/administration/roles/home-container';

import ConceptsRoutes from 'js/components/router/concepts';
import ClassificationsRoutes from 'js/components/router/classifications';
import OperationsRoutes from 'js/components/router/operations';

export default withRouter(
	auth(({ error }) => (
		<React.Fragment>
			<Route path="/" component={MenuDispatcher} />
			<Switch>
				{error && <Route path="/" component={Error} />}
				<Route exact path="/" component={App} />
				<Route path="/administration/roles" component={Role} />
				<Route
					path="/(concept|concepts|collections|collection)"
					component={ConceptsRoutes}
				/>
				<Route path="/classifications" component={ClassificationsRoutes} />
				<Route path="/operations" component={OperationsRoutes} />
				<Route path="*" component={NotFound} />
			</Switch>
		</React.Fragment>
	))
);
