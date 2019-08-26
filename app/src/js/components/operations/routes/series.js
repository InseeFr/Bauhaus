import React from 'react';
import { Switch, Route } from 'react-router-dom';
import OperationsSeriesContainer from 'js/components/operations/series/';
import OperationsSeriesVisualizationContainer from 'js/components/operations/series/visualization/';
import OperationsSeriesEditionContainer from 'js/components/operations/series/edition';
import OperationsSeriesSearchContainer from 'js/components/operations/series/search';

export default () => {
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
