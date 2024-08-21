import { Switch, Route } from 'react-router-dom';
import OperationsIndicatorsContainer from '../../modules-operations/indicators/';
import OperationIndicatorContainer from '../../modules-operations/indicators/visualization/';
import OperationsIndicatorEditionContainer from '../../modules-operations/indicators/edition';

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
