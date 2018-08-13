import React from 'react';
import { Switch, Route } from 'react-router-dom';

import ClassificationsFamiliesContainer from 'js/components/classifications/families/home-container';
import ClassificationsFamilyContainer from 'js/components/classifications/families/visualization/home-container';
import ClassificationsSeriesContainer from 'js/components/classifications/series/home-container';
import ClassificationsOneSeriesContainer from 'js/components/classifications/series/visualization/home-container';
import ClassificationsContainer from 'js/components/classifications/home-container';
import ClassificationContainer from 'js/components/classifications/visualization/home-container';
import ClassificationItemsContainer from 'js/components/classifications/visualization/items/home-container';
import ClassificationTreeContainer from 'js/components/classifications/visualization/tree/home-container';
import ClassificationLevelContainer from 'js/components/classifications/level/home-container';
import ClassificationItemContainer from 'js/components/classifications/item/home-container';
import ClassificationItemCompareContainer from 'js/components/classifications/item/compare/home-container';
import ClassificationsCorrespondencesContainer from 'js/components/classifications/correspondences/home-container';
import ClassificationsCorrespondenceContainer from 'js/components/classifications/correspondences/visualization/home-container';
import ClassificationsCorrespondenceAssociationContainer from 'js/components/classifications/correspondences/association/home-container';

export default () => (
	<Switch>
		<Route
			exact
			path="/classifications/families"
			component={ClassificationsFamiliesContainer}
		/>
		<Route
			exact
			path="/classifications/family/:id"
			component={ClassificationsFamilyContainer}
		/>
		<Route
			exact
			path="/classifications/series"
			component={ClassificationsSeriesContainer}
		/>
		<Route
			exact
			path="/classifications/series/:id"
			component={ClassificationsOneSeriesContainer}
		/>
		<Route exact path="/classifications" component={ClassificationsContainer} />
		<Route
			exact
			path="/classifications/classification/:id"
			component={ClassificationContainer}
		/>
		<Route
			exact
			path="/classifications/classification/:id/items"
			component={ClassificationItemsContainer}
		/>
		<Route
			exact
			path="/classifications/classification/:id/tree"
			component={ClassificationTreeContainer}
		/>
		<Route
			exact
			path="/classifications/classification/:classificationId/level/:levelId"
			component={ClassificationLevelContainer}
		/>
		<Route
			exact
			path="/classifications/classification/:classificationId/item/:itemId"
			component={ClassificationItemContainer}
		/>
		<Route
			exact
			path="/classifications/classification/:classificationId/item/:itemId/compare"
			component={ClassificationItemCompareContainer}
		/>
		<Route
			exact
			path="/classifications/correspondences"
			component={ClassificationsCorrespondencesContainer}
		/>
		<Route
			exact
			path="/classifications/correspondence/:id"
			component={ClassificationsCorrespondenceContainer}
		/>
		<Route
			exact
			path="/classifications/correspondence/:correspondenceId/association/:associationId"
			component={ClassificationsCorrespondenceAssociationContainer}
		/>
	</Switch>
);
