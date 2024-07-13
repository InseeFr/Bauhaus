import { Switch, Route } from 'react-router-dom';
import OperationsIndicatorsContainer from '../../../applications/operations/indicators/';
import OperationIndicatorContainer from '../../../applications/operations/indicators/visualization/';
import OperationsIndicatorEditionContainer from '../../../applications/operations/indicators/edition';

const Routes = () => {
	return (
		<Switch>
			<Route
				exact
				path="/operations/indicators"
				component={OperationsIndicatorsContainer}
			/>
			<Route
				exact
				path="/operations/indicator/create"
				component={OperationsIndicatorEditionContainer}
			/>

			<Route
				exact
				path="/operations/indicator/:id"
				component={OperationIndicatorContainer}
			/>
			<Route
				exact
				path="/operations/indicator/:id/modify"
				component={OperationsIndicatorEditionContainer}
			/>
		</Switch>
	);
};

export default Routes;
