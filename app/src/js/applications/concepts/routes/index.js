import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Concepts from 'js/applications/concepts/home';
import ConceptsSearchListContainer from 'js/applications/concepts/advanced-search/home-container';
import ConceptCompareContainer from 'js/applications/concepts/compare/home-container';
import ConceptSendContainer from 'js/applications/concepts/send/home-container';
import ConceptCreationContainer from 'js/applications/concepts/edition-creation/creation-container';
import ConceptEditionContainer from 'js/applications/concepts/edition-creation/edition-container';
//import ConceptDeletionContainer from 'js/applications/concepts/edition-creation/deletion-container';

import ConceptVisualizationContainer from 'js/applications/concepts/visualization/home-container';
import ConceptsToValidateContainer from 'js/applications/concepts/validation/home-container';
import ConceptsToExportContainer from 'js/applications/concepts/export/home-container';
import CollectionsContainer from 'js/applications/collections/home-container';
import CollectionVisualizationContainer from 'js/applications/collections/visualization/home-container';
import CollectionSendContainer from 'js/applications/collections/send/home-container';
import CollectionCreationContainer from 'js/applications/collections/edition-creation/creation-container';
import CollectionEditionContainer from 'js/applications/collections/edition-creation/edition-container';
import CollectionsToValidateContainer from 'js/applications/collections/validation/home-container';
import CollectionsToExportContainer from 'js/applications/collections/export/home-container';
import Help from 'js/applications/help/home';
import Administration from 'js/applications/administration/home';
import ConceptsDashboard from 'js/applications/administration/dashboard/concepts/home-container';
import D from 'js/i18n';
import Menu from 'js/applications/concepts/menu';

export default () => {
	document.title = 'Bauhaus - ' + D.conceptsTitle;
	return (
		<>
			<Menu />
			<Switch>
				<Route exact path="/concepts" component={Concepts} />
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

				<Route
					exact
					path="/concepts/administration/dashboard"
					component={ConceptsDashboard}
				/>
			</Switch>
		</>
	);
};
