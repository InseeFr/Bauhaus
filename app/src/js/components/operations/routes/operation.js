import React from 'react';
import { Switch, Route } from 'react-router-dom';

import OperationsContainer from 'js/components/operations/operations/';
import OperationVisualizationContainer from 'js/components/operations/operations/visualization/';

import OperationEditionContainer from 'js/components/operations/operations/edition';

export default () => {
	return (
		<Switch>
			<Route exact path="/operations" component={OperationsContainer} />

			<Route
				exact
				path="/operations/operation/create"
				component={OperationEditionContainer}
			/>
			<Route
				exact
				path="/operations/operation/:id"
				component={OperationVisualizationContainer}
			/>
			<Route
				exact
				path="/operations/operation/:id/modify"
				component={OperationEditionContainer}
			/>
		</Switch>
	);
};
