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
				<Route exact path="/concepts" component={Concepts} />
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
				<Route
					exact
					path="/concepts/administration"
					component={Administration}
				/>

				<Route
					exact
					path="/concepts/administration/dashboard"
					component={ConceptsDashboard}
				/>
			</Switch>
		</>
	);
};

export default Routes;
