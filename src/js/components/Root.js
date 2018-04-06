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
import ConceptsSearchListContainer from './concepts/search-container';
import ConceptCompareContainer from './concepts/compare-container';
import ConceptSendContainer from './concepts/send-container';
import ConceptCreationContainer from './concepts/creation-container';
import ConceptEditionContainer from './concepts/edition-container';
import ConceptVisualizationContainer from './concepts/visualization-container';
import ConceptsToValidate from './concepts/to-validate';
import ConceptsToExport from './concepts/to-export';
import CollectionsHomeContainer from './collections/home-container';
import CollectionVisualizationContainer from './collections/visualization-container';
import CollectionSendContainer from './collections/send-container';
import CollectionCreationContainer from './collections/creation-container';
import CollectionEditionContainer from './collections/edition-container';
import CollectionsToValidate from './collections/to-validate';
import CollectionsToExport from './collections/to-export';
import Help from './help/home';
import AdministrationHome from './administration/home-container';
import RoleHome from './administration/roles/home-container';
import ConceptsDashboardHome from './administration/dashboard/concepts/home-container';
import MenuDispatcher from './menu/menu-container';
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
							component={CollectionsToValidate}
						/>
						<Route
							exact
							path="/collections/export"
							component={CollectionsToExport}
						/>
						<Route exact path="/concepts/help" component={Help} />
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
