import { Route, Routes, Switch } from 'react-router-dom';

import ClassificationsCorrespondenceAssociationContainer from '../../modules-classifications/correspondences/association/home-container';
import ClassificationsCorrespondencesContainer from '../../modules-classifications/correspondences/home-container';
import ClassificationsCorrespondenceContainer from '../../modules-classifications/correspondences/visualization/home-container';
import ClassificationsFamiliesContainer from '../../modules-classifications/families/home-container';
import ClassificationsFamilyContainer from '../../modules-classifications/families/visualization/home-container';
import ClassificationsContainer from '../../modules-classifications/home-container';
import ClassificationItemCompareContainer from '../../modules-classifications/item/compare/home-container';
import ClassificationItemEdition from '../../modules-classifications/item/edition';
import ClassificationItemContainer from '../../modules-classifications/item/home-container';
import ClassificationLevelContainer from '../../modules-classifications/level/home-container';
import Menu from '../../modules-classifications/menu';
import ClassificationsSeriesContainer from '../../modules-classifications/series/home-container';
import ClassificationsOneSeriesContainer from '../../modules-classifications/series/visualization/home-container';
import ClassificationContainer from '../../modules-classifications/visualization/home-container';
import ClassificationItemsContainer from '../../modules-classifications/visualization/items/home-container';
import ClassificationTreeContainer from '../../modules-classifications/visualization/tree/home-container';
import { ClassificationEdition } from '../edition';

export default () => {
	return (
		<>
			<Menu />
			<Routes>
				<Route
					path="/families"
					element={<ClassificationsFamiliesContainer />}
				/>
				<Route
					path="/family/:id"
					element={<ClassificationsFamilyContainer />}
				/>
				<Route path="/series" element={<ClassificationsSeriesContainer />} />
				<Route
					path="/series/:id"
					element={<ClassificationsOneSeriesContainer />}
				/>
				<Route path="/" element={<ClassificationsContainer />} />
				<Route
					path="/classification/:id"
					element={<ClassificationContainer />}
				/>
				<Route
					path="/classification/:id/modify"
					element={<ClassificationEdition />}
				/>
				<Route
					path="/classification/:id/items"
					element={<ClassificationItemsContainer />}
				/>
				<Route
					path="/classification/:id/tree"
					element={<ClassificationTreeContainer />}
				/>
				<Route
					path="/classification/:classificationId/level/:levelId"
					element={<ClassificationLevelContainer />}
				/>
				<Route
					path="/classification/:classificationId/item/:itemId"
					element={<ClassificationItemContainer />}
				/>
				<Route
					path="/classification/:classificationId/item/:itemId/modify"
					element={<ClassificationItemEdition />}
				/>
				<Route
					path="/classification/:classificationId/item/:itemId/compare"
					element={<ClassificationItemCompareContainer />}
				/>
				<Route
					path="/correspondences"
					element={<ClassificationsCorrespondencesContainer />}
				/>
				<Route
					path="/correspondence/:id"
					element={<ClassificationsCorrespondenceContainer />}
				/>
				<Route
					path="/correspondence/:correspondenceId/association/:associationId"
					element={<ClassificationsCorrespondenceAssociationContainer />}
				/>
			</Routes>
		</>
	);
};
