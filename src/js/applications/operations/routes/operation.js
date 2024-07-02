import { Switch, Route } from 'react-router-dom';

import OperationsContainer from 'js/applications/operations/operations/';
import OperationVisualizationContainer from 'js/applications/operations/operations/visualization/';

import OperationEditionContainer from 'js/applications/operations/operations/edition';

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
