import React, { Component } from 'react';
import 'babel-polyfill';
import { Provider } from 'react-redux';
import configureStore from '../store/configure-store';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import App from './app';
import Auth from 'js/components/auth';
import { auth } from 'config/config';
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
import MenuDispatcher from './menu/';
import GroupsHomeContainer from './operations/groups/home-container';
import SubGroupsHomeContainer from './operations/sub-groups/home-container';
import StudyUnitsHomeContainer from './operations/study-units/home-container';
import GroupsVisualizationContainer from './operations/groups/visualization-container';
import SubGroupsVisualizationContainer from './operations/sub-groups/visualization-container';
import StudyUnitsVisualizationContainer from './operations/study-units/visualization-container';

const store = configureStore();

class Root extends Component {
	//TODO refactor routes (use nested routes, take advantage of react router 4
	//dynamic routes)

	constructor() {
		super();
		this.state = {
			loggedIn: false,
		};
		this.updateLogin = loggedIn => {
			this.setState({
				loggedIn,
			});
		};
	}

	render() {
		const { loggedIn } = this.state;
		const content =
			auth && !loggedIn ? (
				<Auth updateLogin={this.updateLogin} />
			) : (
				<Router>
					<div>
						<Route exact path="/" component={App} />
						<Route path="/" component={MenuDispatcher} />
						<Switch>
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
							<Route
								exact
								path="/concepts/export"
								component={ConceptsToExport}
							/>
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
							<Route exact path="/groups" component={GroupsHomeContainer} />
							<Route
								exact
								path="/sub-groups"
								component={SubGroupsHomeContainer}
							/>
							<Route
								exact
								path="/study-units"
								component={StudyUnitsHomeContainer}
							/>
							<Route
								exact
								path="/group/:id"
								component={GroupsVisualizationContainer}
							/>
							<Route
								exact
								path="/sub-group/:id"
								component={SubGroupsVisualizationContainer}
							/>
							<Route
								exact
								path="/study-unit/:id"
								component={StudyUnitsVisualizationContainer}
							/>
						</Switch>
					</div>
				</Router>
			);

		return (
			<div>
				<Provider store={store}>{content}</Provider>
				<div className="centered" style={{ marginTop: '50px' }}>
					<label>Gncs - Version 0.3</label>
				</div>
			</div>
		);
	}
}

export default Root;
