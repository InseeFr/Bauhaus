import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import auth from 'js/components/auth/hoc';

import Error from 'js/components/shared/error';
import NotFound from 'js/components/shared/not-found';
// Concepts
import App from 'js/components/app';
import ConceptsContainer from 'js/components/concepts/home-container';
import ConceptsSearchListContainer from 'js/components/concepts/advanced-search/home-container';
import ConceptCompareContainer from 'js/components/concepts/compare/home-container';
import ConceptSendContainer from 'js/components/concepts/send/home-container';
import ConceptCreationContainer from 'js/components/concepts/edition-creation/creation-container';
import ConceptEditionContainer from 'js/components/concepts/edition-creation/edition-container';
import ConceptVisualizationContainer from 'js/components/concepts/visualization/home-container';
import ConceptsToValidateContainer from 'js/components/concepts/validation/home-container';
import ConceptsToExportContainer from 'js/components/concepts/export/home-container';
import CollectionsContainer from 'js/components/collections/home-container';
import CollectionVisualizationContainer from 'js/components/collections/visualization/home-container';
import CollectionSendContainer from 'js/components/collections/send/home-container';
import CollectionCreationContainer from 'js/components/collections/edition-creation/creation-container';
import CollectionEditionContainer from 'js/components/collections/edition-creation/edition-container';
import CollectionsToValidateContainer from 'js/components/collections/validation/home-container';
import CollectionsToExportContainer from 'js/components/collections/export/home-container';
import Help from 'js/components/help/home';
import Administration from 'js/components/administration/home-container';
import Role from 'js/components/administration/roles/home-container';
import ConceptsDashboard from 'js/components/administration/dashboard/concepts/home-container';
import MenuDispatcher from 'js/components/menu/home-container';
// Classifications
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

import OperationsRoutes from 'js/components/router/operations.js';
export default withRouter(
	auth(({ error }) => (
		<span>
			<Route path="/" component={MenuDispatcher} />
			<Switch>
				{error && <Route path="/" component={Error} />}
				<Route exact path="/" component={App} />
				<Route exact path="/concepts" component={ConceptsContainer} />
				<Route
					exact
					path="/concepts/search"
					component={ConceptsSearchListContainer}
				/>
				<Route
					exact
					path="/concept/create"
					component={ConceptCreationContainer}
				/>
				<Route
					exact
					path="/concept/:id"
					component={ConceptVisualizationContainer}
				/>
				<Route
					exact
					path="/concept/:id/compare"
					component={ConceptCompareContainer}
				/>
				<Route
					exact
					path="/concept/:id/send"
					component={ConceptSendContainer}
				/>
				<Route
					exact
					path="/concept/:id/modify"
					component={ConceptEditionContainer}
				/>
				<Route
					exact
					path="/concepts/validation"
					component={ConceptsToValidateContainer}
				/>
				<Route
					exact
					path="/concepts/export"
					component={ConceptsToExportContainer}
				/>
				<Route exact path="/collections" component={CollectionsContainer} />
				<Route
					exact
					path="/collection/create"
					component={CollectionCreationContainer}
				/>
				<Route
					exact
					path="/collection/:id"
					component={CollectionVisualizationContainer}
				/>
				<Route
					exact
					path="/collection/:id/send"
					component={CollectionSendContainer}
				/>
				<Route
					exact
					path="/collection/:id/modify"
					component={CollectionEditionContainer}
				/>
				<Route
					exact
					path="/collections/validation"
					component={CollectionsToValidateContainer}
				/>
				<Route
					exact
					path="/collections/export"
					component={CollectionsToExportContainer}
				/>
				<Route exact path="/concepts/help/:id" component={Help} />
				<Route
					exact
					path="/concepts/administration"
					component={Administration}
				/>
				<Route path="/administration/roles" component={Role} />
				<Route
					exact
					path="/concepts/administration/dashboard"
					component={ConceptsDashboard}
				/>
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

				{OperationsRoutes}
				<Route path="*" component={NotFound} />
			</Switch>
		</span>
	))
);
