import { Switch, Route } from 'react-router-dom';

import { DatasetHome } from '../datasets/home/home';
import { DatasetEdit } from '../datasets/edit/edit';
import { DatasetView } from '../datasets/view/view';
import { DistributionHome } from '../distributions/home/home';
import { DistributionEdit } from '../distributions/edit';
import { DistributionView } from '../distributions/view/view';
import DatasetsMenu from './menu';

const rootApp = document.getElementById('root-app');
const DatasetsComponent = () => {
	if (rootApp) {
		rootApp.className = 'datasets';
	}
	return (
		<>
			<DatasetsMenu />
			<div className="container">
				<Switch>
					<Route exact path="/datasets"><DatasetHome /></Route>
					<Route
						exact
						path="/datasets/distributions"
					><DistributionHome /></Route>

					<Route exact path="/datasets/create"><DatasetEdit /></Route>
					<Route exact path="/datasets/:id"><DatasetView /></Route>
					<Route exact path="/datasets/:id/modify"><DatasetEdit /></Route>
					<Route
						exact
						path="/datasets/distributions/create"
					><DistributionEdit /></Route>
					<Route
						exact
						path="/datasets/distributions/:id"
					><DistributionView /></Route>
					<Route
						exact
						path="/datasets/distributions/:id/modify"
					><DistributionEdit /></Route>
				</Switch>
			</div>
		</>
	);
};

export default DatasetsComponent;
