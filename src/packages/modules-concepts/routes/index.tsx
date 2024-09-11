import { Switch, Route } from 'react-router-dom';

import Concepts from '../../modules-concepts/home';
import ConceptsSearchListContainer from '../../modules-concepts/advanced-search/home-container';
import ConceptCompareContainer from '../../modules-concepts/compare/home-container';
import ConceptCreationContainer from '../../modules-concepts/edition-creation/creation-container';
import ConceptEditionContainer from '../../modules-concepts/edition-creation/edition-container';

import ConceptVisualizationContainer from '../../modules-concepts/visualization/home-container';
import ConceptsToValidateContainer from '../../modules-concepts/validation/home-container';
import ConceptsToExportContainer from '../../modules-concepts/export/home-container';
import CollectionsContainer from '../collections/home-container';
import CollectionVisualizationContainer from '../collections/visualization/home-container';
import CollectionCreationContainer from '../collections/edition-creation/creation-container';
import CollectionEditionContainer from '../collections/edition-creation/edition-container';
import CollectionsToValidateContainer from '../collections/validation/home-container';
import CollectionsToExportContainer from '../collections/export/home-container';
import Administration from '../../modules-concepts/administration/home';
import ConceptsDashboard from '../../modules-concepts/administration/dashboard/concepts/home-container';
import Menu from '../menu/index';

const Routes = () => {
	return (
		<>
			<Menu />
			<Switch>
				<Route exact path="/concepts"><Concepts /></Route>
				<Route
					exact
					path="/concepts/search"
				><ConceptsSearchListContainer /></Route>
				<Route
					exact
					path="/concept/create"
				><ConceptCreationContainer /></Route>
				<Route
					exact
					path="/concept/:id"
				><ConceptVisualizationContainer /></Route>
				<Route
					exact
					path="/concept/:id/compare"
				><ConceptCompareContainer /></Route>
				<Route
					exact
					path="/concept/:id/modify"
				><ConceptEditionContainer /></Route>
				<Route
					exact
					path="/concepts/validation"
				><ConceptsToValidateContainer /></Route>
				<Route
					exact
					path="/concepts/export"
				><ConceptsToExportContainer /></Route>
				<Route exact path="/collections"><CollectionsContainer /></Route>
				<Route
					exact
					path="/collection/create"
				><CollectionCreationContainer /></Route>
				<Route
					exact
					path="/collection/:id"
				><CollectionVisualizationContainer /></Route>
				<Route
					exact
					path="/collection/:id/modify"
				><CollectionEditionContainer /></Route>
				<Route
					exact
					path="/collections/validation"
				><CollectionsToValidateContainer /></Route>
				<Route
					exact
					path="/collections/export"
				><CollectionsToExportContainer /></Route>
				<Route
					exact
					path="/concepts/administration"
				><Administration /></Route>

				<Route
					exact
					path="/concepts/administration/dashboard"
				><ConceptsDashboard /></Route>
			</Switch>
		</>
	);
};

export default Routes;
