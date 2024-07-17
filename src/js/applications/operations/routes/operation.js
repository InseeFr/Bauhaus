import { Switch, Route } from 'react-router-dom';

import OperationsContainer from '../../../applications/operations/operations/';
import OperationVisualizationContainer from '../../../applications/operations/operations/visualization/';

import OperationEditionContainer from '../../../applications/operations/operations/edition';

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
