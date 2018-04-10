import React, { Component } from 'react';
import { connect } from 'react-redux';
import 'babel-polyfill';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import auth from 'js/components/auth/hoc';
import { footer } from 'config';
import Error from 'js/components/shared/error';

import NotFound from 'js/components/shared/not-found';
import App from './app';
import ConceptsHomeContainer from './concepts/home-container';
import ConceptsSearchListContainer from './concepts/advanced-search/home-container';
import ConceptCompareContainer from './concepts/compare/home-container';
import ConceptSendContainer from './concepts/send/home-container';
import ConceptCreationContainer from './concepts/edition-creation/creation-container';
import ConceptEditionContainer from './concepts/edition-creation/edition-container';
import ConceptVisualizationContainer from './concepts/visualization/home-container';
import ConceptsToValidate from './concepts/validation/home';
import ConceptsToExport from './concepts/export/home';
import CollectionsHomeContainer from './collections/home-container';
import CollectionVisualizationContainer from './collections/visualization/home-container';
import CollectionSendContainer from './collections/send/home-container';
import CollectionCreationContainer from './collections/edition-creation/creation-container';
import CollectionEditionContainer from './collections/edition-creation/edition-container';
import CollectionsToValidateContainer from './collections/validation/home-container';
import CollectionsToExportContainer from './collections/export/home-container';
import HelpConcepts from './help/concepts/home';
import HelpClassifications from './help/classifications/home';
import HelpOperations from './help/operations/home';
import AdministrationHome from './administration/home-container';
import RoleHome from './administration/roles/home-container';
import ConceptsDashboardHome from './administration/dashboard/concepts/home-container';
import MenuDispatcher from './menu/home-container';
// Classifications
import ClassificationsFamiliesHomeContainer from './classifications/families/home-container';
import ClassificationsFamilyHomeContainer from './classifications/families/visualization/home-container';
import ClassificationsSeriesHomeContainer from './classifications/series/home-container';
import ClassificationsOneSeriesHomeContainer from './classifications/series/visualization/home-container';
import ClassificationsHomeContainer from './classifications/home-container';
import ClassificationHomeContainer from './classifications/visualization/home-container';
// Operations
import OperationsFamiliesHomeContainer from './operations/families/home-container';
import OperationsSeriesHomeContainer from './operations/series/home-container';
import OperationsHomeContainer from './operations/operations/home-container';
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
						<Route exact path="/concepts" component={ConceptsHomeContainer} />
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
							component={ConceptsToValidate}
						/>
						<Route exact path="/concepts/export" component={ConceptsToExport} />
						<Route
							exact
							path="/collections"
							component={CollectionsHomeContainer}
						/>
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
							component={AdministrationHome}
						/>
						<Route exact path="/administration/roles" component={RoleHome} />
						<Route
							exact
							path="/concepts/administration/dashboard"
							component={ConceptsDashboardHome}
						/>
						<Route
							exact
							path="/classifications/families"
							component={ClassificationsFamiliesHomeContainer}
						/>
						<Route
							exact
							path="/classifications/family/:id"
							component={ClassificationsFamilyHomeContainer}
						/>
						<Route
							exact
							path="/classifications/series"
							component={ClassificationsSeriesHomeContainer}
						/>
						<Route
							exact
							path="/classifications/series/:id"
							component={ClassificationsOneSeriesHomeContainer}
						/>
						<Route
							exact
							path="/classifications"
							component={ClassificationsHomeContainer}
						/>
						<Route
							exact
							path="/classifications/classification/:id"
							component={ClassificationHomeContainer}
						/>
						<Route
							exact
							path="/operations/families"
							component={OperationsFamiliesHomeContainer}
						/>
						<Route
							exact
							path="/operations/series"
							component={OperationsSeriesHomeContainer}
						/>
						<Route
							exact
							path="/operations"
							component={OperationsHomeContainer}
						/>
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
