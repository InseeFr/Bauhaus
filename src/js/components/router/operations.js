import React from 'react';
import { Switch, Route } from 'react-router-dom';

import OperationsFamiliesContainer from 'js/components/operations/families/home-container';
import OperationsSeriesContainer from 'js/components/operations/series/home-container';
import OperationsContainer from 'js/components/operations/operations/home-container';
import OperationsIndicatorsContainer from 'js/components/operations/indicators/home-container';

import OperationsFamilyVisualizationContainer from 'js/components/operations/families/visualization/visualization-container';
import OperationsSeriesVisualizationContainer from 'js/components/operations/series/visualization/visualization-container';
import OperationVisualizationContainer from 'js/components/operations/operations/visualization/visualization-container';
import OperationIndicatorContainer from 'js/components/operations/indicators/visualization/visualization-container';

import OperationsFamilyEditionContainer from 'js/components/operations/families/edition';
import OperationsSeriesEditionContainer from 'js/components/operations/series/edition';
import OperationEditionContainer from 'js/components/operations/operations/edition';
import OperationsIndicatorEditionContainer from 'js/components/operations/indicators/edition';

export default () => (
	<Switch>
		<Route
			exact
			path="/operations/families"
			component={OperationsFamiliesContainer}
		/>
		<Route
			exact
			path="/operations/series"
			component={OperationsSeriesContainer}
		/>
		<Route exact path="/operations" component={OperationsContainer} />
		<Route
			exact
			path="/operations/family/:id"
			component={OperationsFamilyVisualizationContainer}
		/>
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

		<Route
			exact
			path="/operations/family/:id/modify"
			component={OperationsFamilyEditionContainer}
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
