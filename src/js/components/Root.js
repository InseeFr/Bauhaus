import React, { Component } from 'react';
import 'babel-polyfill';
import { Provider } from 'react-redux';
import configureStore from '../store/configure-store';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import App from './app';
import ConceptsHomeContainer from './concepts-home-container';
import ConceptsSearchList from './concepts-search-list';
import ConceptByID from './concept-by-id';
import ConceptCompare from './concept-compare';
import ConceptSend from './concept-send';
import { ConceptCreate, ConceptEdit } from './concept-edition';
import ConceptsToValidate from './concepts-to-validate';
import ConceptsToExport from './concepts-to-export';
import Collections from './collections';
import CollectionByID from './collection-by-id';
import CollectionCreate from './collection-create';
import CollectionSend from './collection-send';
import CollectionModify from './collection-modify';
import CollectionsToValidate from './collections-to-validate';
import CollectionsToExport from './collections-to-export';

const store = configureStore();

export default class Root extends Component {
  render() {
    return (
      <div>
        <Provider store={store}>
          <Router>
            <Switch>
              <Route exact path="/" component={App} />
              <Route exact path="/concepts" component={ConceptsHomeContainer} />
              <Route
                exact
                path="/concepts/search"
                component={ConceptsSearchList}
              />
              <Route exact path="/concept/:id" component={ConceptByID} />
              <Route
                exact
                path="/concept/:id/compare"
                component={ConceptCompare}
              />
              <Route exact path="/create/concept" component={ConceptCreate} />
              <Route exact path="/concept/:id/send" component={ConceptSend} />
              <Route exact path="/concept/:id/modify" component={ConceptEdit} />
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
              <Route exact path="/collection/:id" component={CollectionByID} />
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
