import { Switch, Route } from 'react-router-dom';

import OperationsContainer from '../../modules-operations/operations/';
import OperationVisualizationContainer from '../../modules-operations/operations/visualization/';
import OperationEditionContainer from '../../modules-operations/operations/edition';

const Routes = () => {
	return (
		<Switch>
			<Route exact path="/operations/operations"><OperationsContainer /></Route>

			<Route
				exact
				path="/operations/operation/create"
			><OperationEditionContainer /></Route>
			<Route
				exact
				path="/operations/operation/:id"
			><OperationVisualizationContainer /></Route>
			<Route
				exact
				path="/operations/operation/:id/modify"
			><OperationEditionContainer /></Route>
		</Switch>
	);
};

export default Routes;
