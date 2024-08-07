import { Switch, Route } from 'react-router-dom';

import Concepts from '../../../applications/concepts/home';
import ConceptsSearchListContainer from '../../../applications/concepts/advanced-search/home-container';
import ConceptCompareContainer from '../../../applications/concepts/compare/home-container';
import ConceptCreationContainer from '../../../applications/concepts/edition-creation/creation-container';
import ConceptEditionContainer from '../../../applications/concepts/edition-creation/edition-container';

import ConceptVisualizationContainer from '../../../applications/concepts/visualization/home-container';
import ConceptsToValidateContainer from '../../../applications/concepts/validation/home-container';
import ConceptsToExportContainer from '../../../applications/concepts/export/home-container';
import CollectionsContainer from '../../../applications/collections/home-container';
import CollectionVisualizationContainer from '../../../applications/collections/visualization/home-container';
import CollectionCreationContainer from '../../../applications/collections/edition-creation/creation-container';
import CollectionEditionContainer from '../../../applications/collections/edition-creation/edition-container';
import CollectionsToValidateContainer from '../../../applications/collections/validation/home-container';
import CollectionsToExportContainer from '../../../applications/collections/export/home-container';
import Administration from '../../../applications/administration/home';
import ConceptsDashboard from '../../../applications/administration/dashboard/concepts/home-container';
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
