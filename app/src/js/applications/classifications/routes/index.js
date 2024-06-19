import React from 'react';
import { Switch, Route } from 'react-router-dom';

import ClassificationsFamiliesContainer from 'js/applications/classifications/families/home-container';
import ClassificationsFamilyContainer from 'js/applications/classifications/families/visualization/home-container';
import ClassificationsSeriesContainer from 'js/applications/classifications/series/home-container';
import ClassificationsOneSeriesContainer from 'js/applications/classifications/series/visualization/home-container';
import ClassificationsContainer from 'js/applications/classifications/home-container';
import ClassificationContainer from 'js/applications/classifications/visualization/home-container';
import ClassificationItemsContainer from 'js/applications/classifications/visualization/items/home-container';
import ClassificationTreeContainer from 'js/applications/classifications/visualization/tree/home-container';
import ClassificationLevelContainer from 'js/applications/classifications/level/home-container';
import ClassificationItemContainer from 'js/applications/classifications/item/home-container';
import ClassificationItemEdition from 'js/applications/classifications/item/edition';
import ClassificationItemCompareContainer from 'js/applications/classifications/item/compare/home-container';
import ClassificationsCorrespondencesContainer from 'js/applications/classifications/correspondences/home-container';
import ClassificationsCorrespondenceContainer from 'js/applications/classifications/correspondences/visualization/home-container';
import ClassificationsCorrespondenceAssociationContainer from 'js/applications/classifications/correspondences/association/home-container';
import Menu from 'js/applications/classifications/menu';
import { ClassificationEdition } from '../edition';

export default () => {
	return (
		<>
			<Menu />
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
				<Route
					exact
					path="/classifications"
					component={ClassificationsContainer}
				/>
				<Route
					exact
					path="/classifications/classification/:id"
					component={ClassificationContainer}
				/>
				<Route
					exact
					path="/classifications/classification/:id/modify"
					component={ClassificationEdition}
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
					path="/classifications/classification/:classificationId/item/:itemId/modify"
					component={ClassificationItemEdition}
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
		</>
	);
};
