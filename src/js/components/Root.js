import React, { Component } from 'react';
import 'babel-polyfill';
import { Provider } from 'react-redux';
import configureStore from '../store/configure-store';
import { Router, Route, hashHistory } from 'react-router';
import App from './app';
import Concepts from './concepts';
import ConceptsSearchList from './concepts-search-list';
import ConceptByID from './concept-by-id';
import ConceptCompare from './concept-compare';
import ConceptCreate from './concept-create';
import ConceptSend from './concept-send';
import ConceptModify from './concept-modify';
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
          <Router history={hashHistory}>
            <Route path="/" component={App} />
            <Route path="/concepts" component={Concepts} />
            <Route path="/concepts/search" component={ConceptsSearchList} />
            <Route path="/concept/:id" component={ConceptByID} />
            <Route path="/concept/:id/compare" component={ConceptCompare} />
            <Route path="/create/concept" component={ConceptCreate} />
            <Route path="/concept/:id/send" component={ConceptSend} />
            <Route path="/concept/:id/modify" component={ConceptModify} />
            <Route path="/concepts/validation" component={ConceptsToValidate} />
            <Route path="/concepts/export" component={ConceptsToExport} />
            <Route path="/collections" component={Collections} />
            <Route path="/collection/:id" component={CollectionByID} />
            <Route path="/create/collection" component={CollectionCreate} />
            <Route path="/collection/:id/send" component={CollectionSend} />
            <Route path="/collection/:id/modify" component={CollectionModify} />
            <Route
              path="/collections/validation"
              component={CollectionsToValidate}
            />
            <Route path="/collections/export" component={CollectionsToExport} />
          </Router>
        </Provider>
        <div className="centered" style={{ 'margin-top': '50px' }}>
          <label>Gncs - Version 0.1</label>
        </div>
      </div>
    );
  }
}
