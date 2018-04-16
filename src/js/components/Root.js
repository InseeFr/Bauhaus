import React, { Component } from 'react';
import { connect } from 'react-redux';
import 'babel-polyfill';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import auth from 'js/components/auth/hoc';
import { footer } from 'config';
import Error from 'js/components/shared/error';

import NotFound from 'js/components/shared/not-found';
import App from './app';
import ConceptsContainer from './concepts/home-container';
import ConceptsSearchListContainer from './concepts/advanced-search/home-container';
import ConceptCompareContainer from './concepts/compare/home-container';
import ConceptSendContainer from './concepts/send/home-container';
import ConceptCreationContainer from './concepts/edition-creation/creation-container';
import ConceptEditionContainer from './concepts/edition-creation/edition-container';
import ConceptVisualizationContainer from './concepts/visualization/home-container';
import ConceptsToValidateContainer from './concepts/validation/home-container';
import ConceptsToExportContainer from './concepts/export/home-container';
import CollectionsContainer from './collections/home-container';
import CollectionVisualizationContainer from './collections/visualization/home-container';
import CollectionSendContainer from './collections/send/home-container';
import CollectionCreationContainer from './collections/edition-creation/creation-container';
import CollectionEditionContainer from './collections/edition-creation/edition-container';
import CollectionsToValidateContainer from './collections/validation/home-container';
import CollectionsToExportContainer from './collections/export/home-container';
import HelpConcepts from './help/concepts/home';
import HelpClassifications from './help/classifications/home';
import HelpOperations from './help/operations/home';
import Administration from './administration/home-container';
import Role from './administration/roles/home-container';
import ConceptsDashboard from './administration/dashboard/concepts/home-container';
import MenuDispatcher from './menu/home-container';
// Classifications
import ClassificationsFamiliesContainer from './classifications/families/home-container';
import ClassificationsFamilyContainer from './classifications/families/visualization/home-container';
import ClassificationsSeriesContainer from './classifications/series/home-container';
import ClassificationsOneSeriesContainer from './classifications/series/visualization/home-container';
import ClassificationsContainer from './classifications/home-container';
import ClassificationContainer from './classifications/visualization/home-container';
import ClassificationTreeContainer from './classifications/visualization/tree/home-container';
import ClassificationLevelContainer from './classifications/level/home-container';
import ClassificationItemContainer from './classifications/item/home-container';
import ClassificationItemCompareContainer from './classifications/item/compare/home-container';
// Operations
import OperationsFamiliesContainer from './operations/families/home-container';
import OperationsSeriesContainer from './operations/series/home-container';
import OperationsContainer from './operations/operations/home-container';
import OperationsFamilyVisualizationContainer from './operations/families/visualization-container';
import OperationsSeriesVisualizationContainer from './operations/series/visualization-container';
import OperationVisualizationContainer from './operations/operations/visualization-container';

class Root extends Component {
	render() {
		const { error } = this.props;
		const routes = (
			<Router>
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
						<Route exact path="/concepts/help" component={HelpConcepts} />
						<Route
							exact
							path="/classifications/help"
							component={HelpClassifications}
						/>
						<Route exact path="/operations/help" component={HelpOperations} />
						<Route
							exact
							path="/concepts/administration"
							component={Administration}
						/>
						<Route exact path="/administration/roles" component={Role} />
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
							path="/operations/series/:id"
							component={OperationsSeriesVisualizationContainer}
						/>
						<Route
							exact
							path="/operations/operation/:id"
							component={OperationVisualizationContainer}
						/>
						<Route path="*" component={NotFound} />
					</Switch>
				</span>
			</Router>
		);
		return (
			<div>
				{routes}
				<div className="centered" style={{ marginTop: '50px' }}>
					<label>{footer}</label>
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => {
	const error = state.app.error;
	return { error };
};

export default auth(connect(mapStateToProps)(Root));
