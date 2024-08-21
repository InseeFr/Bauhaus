import { Switch, Route } from 'react-router-dom';

import OperationsContainer from '../../modules-operations/operations/';
import OperationVisualizationContainer from '../../modules-operations/operations/visualization/';
import OperationEditionContainer from '../../modules-operations/operations/edition';

const Routes = () => {
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

export default Routes;
