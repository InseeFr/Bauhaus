import { Switch, Route } from 'react-router-dom';
import OperationsFamiliesSearchContainer from '../../../applications/operations/families/search';
import OperationsFamiliesContainer from '../../../applications/operations/families/';

import OperationsFamilyVisualizationContainer from '../../../applications/operations/families/visualization/';

import OperationsFamilyEditionContainer from '../../../applications/operations/families/edition';

const Routes = () => {
	return (
		<Switch>
			<Route
				exact
				path="/operations/families"
				component={OperationsFamiliesContainer}
			/>
			<Route
				exact
				path="/operations/families/search"
				component={OperationsFamiliesSearchContainer}
			/>
			<Route
				exact
				path="/operations/family/create"
				component={OperationsFamilyEditionContainer}
			/>
			<Route
				exact
				path="/operations/family/:id"
				component={OperationsFamilyVisualizationContainer}
			/>
			<Route
				exact
				path="/operations/family/:id/modify"
				component={OperationsFamilyEditionContainer}
			/>
		</Switch>
	);
};

export default Routes;
