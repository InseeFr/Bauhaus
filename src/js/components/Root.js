import React, { Component } from 'react';
import 'babel-polyfill';
import { Provider } from 'react-redux';
import configureStore from '../store/configure-store';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
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
import AdministrationHome from './administration/home';
import MenuConcepts from './menu/';

const store = configureStore();

export default class Root extends Component {
	//TODO refactor routes (use nested routes, take advantage of react router 4
	//dynamic routes)
	render() {
		return (
			<div>
				<Provider store={store}>
					<Router>
						<div>
							<Route exact path="/" component={App} />
							<Route
								path={/(concept|concepts)/}
								component={() => <MenuConcepts defaultActiveItem="concepts" />}
							/>

							<Route
								path={/(collection|collections)/}
								component={() =>
									<MenuConcepts defaultActiveItem="collections" />}
							/>
							<Route
								path="/help"
								component={() => <MenuConcepts defaultActiveItem="help" />}
							/>
							<Route
								path="/administration"
								component={() =>
									<MenuConcepts defaultActiveItem="administration" />}
							/>
							<Switch>
								<Route
									exact
									path="/concepts"
									component={ConceptsHomeContainer}
								/>
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
								<Route exact path="/help" component={Help} />
								<Route
									exact
									path="/administration"
									component={AdministrationHome}
								/>
							</Switch>
						</div>
					</Router>
				</Provider>
				<div className="centered" style={{ marginTop: '50px' }}>
					<label>Gncs - Version 0.1</label>
				</div>
			</div>
		);
	}
}
