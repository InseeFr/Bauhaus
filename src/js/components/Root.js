import React, { Component } from 'react';
import 'babel-polyfill';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import auth from 'js/components/auth/hoc';
import { version } from 'config';

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
import ConceptsAdministrationHome from './administration/home';
import RoleHome from './administration/roles/home-container';
import ConceptsDashboardHome from './administration/dashboard/concepts/home-container';
import MenuDispatcher from './menu/menu-container';
import FamilliesHomeContainer from './operations/famillies/home-container';
import SeriesHomeContainer from './operations/series/home-container';
import OperationsHomeContainer from './operations/operations/home-container';
import FamilyVisualizationContainer from './operations/famillies/visualization-container';
import SeriesVisualizationContainer from './operations/series/visualization-container';
import OperationVisualizationContainer from './operations/operations/visualization-container';

class Root extends Component {
	render() {
		const routes = (
			<Router>
				<span>
					<Route path="/" component={MenuDispatcher} />
					<Switch>
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
							component={ConceptsAdministrationHome}
						/>
						<Route exact path="/administration/roles" component={RoleHome} />
						<Route
							exact
							path="/concepts/administration/dashboard"
							component={ConceptsDashboardHome}
						/>
						<Route exact path="/famillies" component={FamilliesHomeContainer} />
						<Route exact path="/series" component={SeriesHomeContainer} />
						<Route
							exact
							path="/operations"
							component={OperationsHomeContainer}
						/>
						<Route
							exact
							path="/family/:id"
							component={FamilyVisualizationContainer}
						/>
						<Route
							exact
							path="/series/:id"
							component={SeriesVisualizationContainer}
						/>
						<Route
							exact
							path="/operation/:id"
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
					<label>Gncs - Version {version}</label>
				</div>
			</div>
		);
	}
}

export default auth(Root);
