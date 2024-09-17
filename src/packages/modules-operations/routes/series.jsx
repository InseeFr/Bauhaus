import { Switch, Route, Redirect } from 'react-router-dom';
import OperationsSeriesContainer from '../../modules-operations/series/';
import OperationsSeriesVisualizationContainer from '../../modules-operations/series/visualization/';
import OperationsSeriesEditionContainer from '../../modules-operations/series/edition';
import OperationsSeriesSearchContainer from '../../modules-operations/series/search';

const Routes = () => {
	return (
		<Switch>
			<Route
				exact
				path="/operations"
			>
				<Redirect to="/operations/series" />
			</Route>
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
