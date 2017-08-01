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
import Collections from './collections';
import CollectionByID from './collection-by-id';
import CollectionCreate from './collection-create';
import CollectionSend from './collection-send';
import CollectionModify from './collection-modify';
import CollectionsToValidate from './collections-to-validate';
import CollectionsToExport from './collections-to-export';
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
            <Switch>
              <Route exact path="/" component={App} />
              <div>
                <MenuConcepts />
                <div>
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
                    path="/create/concept"
                    component={ConceptCreationContainer}
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
                  <Route exact path="/collections" component={Collections} />
                  <Route
                    exact
                    path="/collection/:id"
                    component={CollectionByID}
                  />
                  <Route
                    exact
                    path="/create/collection"
                    component={CollectionCreate}
                  />
                  <Route
                    exact
                    path="/collection/:id/send"
                    component={CollectionSend}
                  />
                  <Route
                    exact
                    path="/collection/:id/modify"
                    component={CollectionModify}
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
                </div>
              </div>
            </Switch>
          </Router>
        </Provider>
        <div className="centered" style={{ marginTop: '50px' }}>
          <label>Gncs - Version 0.1</label>
        </div>
      </div>
    );
  }
}
