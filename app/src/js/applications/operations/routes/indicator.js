import { Switch, Route } from 'react-router-dom';
import OperationsIndicatorsContainer from 'js/applications/operations/indicators/';
import OperationIndicatorContainer from 'js/applications/operations/indicators/visualization/';
import OperationsIndicatorEditionContainer from 'js/applications/operations/indicators/edition';

export default () => {
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
