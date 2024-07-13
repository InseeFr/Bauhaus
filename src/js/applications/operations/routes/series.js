import { Switch, Route } from 'react-router-dom';
import OperationsSeriesContainer from '../../../applications/operations/series/';
import OperationsSeriesVisualizationContainer from '../../../applications/operations/series/visualization/';
import OperationsSeriesEditionContainer from '../../../applications/operations/series/edition';
import OperationsSeriesSearchContainer from '../../../applications/operations/series/search';

const Routes = () => {
	return (
		<Switch>
			<Route
				exact
				path="/operations/series"
				component={OperationsSeriesContainer}
			/>
			<Route
				exact
				path="/operations/series/search"
				component={OperationsSeriesSearchContainer}
			/>
			<Route
				exact
				path="/operations/series/create"
				component={OperationsSeriesEditionContainer}
			/>
			<Route
				exact
				path="/operations/series/:id"
				component={OperationsSeriesVisualizationContainer}
			/>
			<Route
				exact
				path="/operations/series/:id/modify"
				component={OperationsSeriesEditionContainer}
			/>
		</Switch>
	);
};

export default Routes;
