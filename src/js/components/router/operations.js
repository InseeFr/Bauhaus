import React from 'react';
import { Route } from 'react-router-dom';

import OperationsFamiliesContainer from 'js/components/operations/families/home-container';
import OperationsSeriesContainer from 'js/components/operations/series/home-container';
import OperationsContainer from 'js/components/operations/operations/home-container';
import OperationsFamilyVisualizationContainer from 'js/components/operations/families/visualization-container';
import OperationsSeriesVisualizationContainer from 'js/components/operations/series/visualization-container';
import OperationVisualizationContainer from 'js/components/operations/operations/visualization/home-container';

import OperationsFamilyEditionContainer from 'js/components/operations/families/edition';
import OperationsSeriesEditionContainer from 'js/components/operations/series/edition';
import OperationEditionContainer from 'js/components/operations/operations/edition';

export default [
	<Route
		exact
		path="/operations/families"
		component={OperationsFamiliesContainer}
	/>,
	<Route
		exact
		path="/operations/series"
		component={OperationsSeriesContainer}
	/>,
	<Route exact path="/operations" component={OperationsContainer} />,
	<Route
		exact
		path="/operations/family/:id"
		component={OperationsFamilyVisualizationContainer}
	/>,
	<Route
		exact
		path="/operations/family/:id/modify"
		component={OperationsFamilyEditionContainer}
	/>,
	<Route
		exact
		path="/operations/series/:id"
		component={OperationsSeriesVisualizationContainer}
	/>,
	<Route
		exact
		path="/operations/series/:id/modify"
		component={OperationsSeriesEditionContainer}
	/>,
	<Route
		exact
		path="/operations/operation/:id"
		component={OperationVisualizationContainer}
	/>,
	<Route
		exact
		path="/operations/operation/:id/modify"
		component={OperationEditionContainer}
	/>,
];
