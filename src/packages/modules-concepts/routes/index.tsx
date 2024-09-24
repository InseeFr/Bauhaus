import { Route, Routes } from 'react-router-dom';

import ConceptsSearchListContainer from '../../modules-concepts/advanced-search/home-container';
import ConceptCompareContainer from '../../modules-concepts/compare/home-container';
import ConceptCreationContainer from '../../modules-concepts/edition-creation/creation-container';
import ConceptEditionContainer from '../../modules-concepts/edition-creation/edition-container';
import Concepts from '../../modules-concepts/home';

import ConceptsDashboard from '../../modules-concepts/administration/dashboard/concepts/home-container';
import Administration from '../../modules-concepts/administration/home';
import ConceptsToExportContainer from '../../modules-concepts/export/home-container';
import ConceptsToValidateContainer from '../../modules-concepts/validation/home-container';
import ConceptVisualizationContainer from '../../modules-concepts/visualization/home-container';
import CollectionCreationContainer from '../collections/edition-creation/creation-container';
import CollectionEditionContainer from '../collections/edition-creation/edition-container';
import CollectionsToExportContainer from '../collections/export/home-container';
import CollectionsContainer from '../collections/home-container';
import CollectionsToValidateContainer from '../collections/validation/home-container';
import CollectionVisualizationContainer from '../collections/visualization/home-container';
import Menu from '../menu/index';

export default () => {
	return (
		<>
			<Menu />
			<Routes>
				<Route path="/" element={<Concepts />} />
				<Route path="/search" element={<ConceptsSearchListContainer />} />
				<Route path="/validation" element={<ConceptsToValidateContainer />} />
				<Route path="/export" element={<ConceptsToExportContainer />} />
				<Route path="/create" element={<ConceptCreationContainer />} />
				<Route path="/:id" element={<ConceptVisualizationContainer />} />
				<Route path="/:id/compare" element={<ConceptCompareContainer />} />
				<Route path="/:id/modify" element={<ConceptEditionContainer />} />

				<Route path="/administration" element={<Administration />} />

				<Route
					path="/administration/dashboard"
					element={<ConceptsDashboard />}
				/>

				<Route path="/collections" element={<CollectionsContainer />} />
				<Route
					path="/collection/create"
					element={<CollectionCreationContainer />}
				/>
				<Route
					path="/collection/:id"
					element={<CollectionVisualizationContainer />}
				/>
				<Route
					path="/collection/:id/modify"
					element={<CollectionEditionContainer />}
				/>
				<Route
					path="/collections/validation"
					element={<CollectionsToValidateContainer />}
				/>
				<Route
					path="/collections/export"
					element={<CollectionsToExportContainer />}
				/>
			</Routes>
		</>
	);
};
