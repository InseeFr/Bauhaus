import { Switch, Route } from 'react-router-dom';
import OperationsFamiliesSearchContainer from 'js/applications/operations/families/search';
import OperationsFamiliesContainer from 'js/applications/operations/families/';

import OperationsFamilyVisualizationContainer from 'js/applications/operations/families/visualization/';

import OperationsFamilyEditionContainer from 'js/applications/operations/families/edition';

export default () => {
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
