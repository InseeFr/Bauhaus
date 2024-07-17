import { Switch, Route } from 'react-router-dom';

import ClassificationsFamiliesContainer from '../../../applications/classifications/families/home-container';
import ClassificationsFamilyContainer from '../../../applications/classifications/families/visualization/home-container';
import ClassificationsSeriesContainer from '../../../applications/classifications/series/home-container';
import ClassificationsOneSeriesContainer from '../../../applications/classifications/series/visualization/home-container';
import ClassificationsContainer from '../../../applications/classifications/home-container';
import ClassificationContainer from '../../../applications/classifications/visualization/home-container';
import ClassificationItemsContainer from '../../../applications/classifications/visualization/items/home-container';
import ClassificationTreeContainer from '../../../applications/classifications/visualization/tree/home-container';
import ClassificationLevelContainer from '../../../applications/classifications/level/home-container';
import ClassificationItemContainer from '../../../applications/classifications/item/home-container';
import ClassificationItemEdition from '../../../applications/classifications/item/edition';
import ClassificationItemCompareContainer from '../../../applications/classifications/item/compare/home-container';
import ClassificationsCorrespondencesContainer from '../../../applications/classifications/correspondences/home-container';
import ClassificationsCorrespondenceContainer from '../../../applications/classifications/correspondences/visualization/home-container';
import ClassificationsCorrespondenceAssociationContainer from '../../../applications/classifications/correspondences/association/home-container';
import Menu from '../../../applications/classifications/menu';
import { ClassificationEdition } from '../edition';

const Routes = () => {
	return (
		<>
			<Menu />
			<Switch>
				<Route
					exact
					path="/classifications/families"
					component={ClassificationsFamiliesContainer}
				/>
				<Route
					exact
					path="/classifications/family/:id"
					component={ClassificationsFamilyContainer}
				/>
				<Route
					exact
					path="/classifications/series"
					component={ClassificationsSeriesContainer}
				/>
				<Route
					exact
					path="/classifications/series/:id"
					component={ClassificationsOneSeriesContainer}
				/>
				<Route
					exact
					path="/classifications"
					component={ClassificationsContainer}
				/>
				<Route
					exact
					path="/classifications/classification/:id"
					component={ClassificationContainer}
				/>
				<Route
					exact
					path="/classifications/classification/:id/modify"
					component={ClassificationEdition}
				/>
				<Route
					exact
					path="/classifications/classification/:id/items"
					component={ClassificationItemsContainer}
				/>
				<Route
					exact
					path="/classifications/classification/:id/tree"
					component={ClassificationTreeContainer}
				/>
				<Route
					exact
					path="/classifications/classification/:classificationId/level/:levelId"
					component={ClassificationLevelContainer}
				/>
				<Route
					exact
					path="/classifications/classification/:classificationId/item/:itemId"
					component={ClassificationItemContainer}
				/>
				<Route
					exact
					path="/classifications/classification/:classificationId/item/:itemId/modify"
					component={ClassificationItemEdition}
				/>
				<Route
					exact
					path="/classifications/classification/:classificationId/item/:itemId/compare"
					component={ClassificationItemCompareContainer}
				/>
				<Route
					exact
					path="/classifications/correspondences"
					component={ClassificationsCorrespondencesContainer}
				/>
				<Route
					exact
					path="/classifications/correspondence/:id"
					component={ClassificationsCorrespondenceContainer}
				/>
				<Route
					exact
					path="/classifications/correspondence/:correspondenceId/association/:associationId"
					component={ClassificationsCorrespondenceAssociationContainer}
				/>
			</Switch>
		</>
	);
};

export default Routes;
