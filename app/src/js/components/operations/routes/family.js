import React from 'react';
import { Switch, Route } from 'react-router-dom';
import OperationsFamiliesSearchContainer from 'js/components/operations/families/search';
import OperationsFamiliesContainer from 'js/components/operations/families/';

import OperationsFamilyVisualizationContainer from 'js/components/operations/families/visualization/';

import OperationsFamilyEditionContainer from 'js/components/operations/families/edition';

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
