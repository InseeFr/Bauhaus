import React from 'react';
import { Switch, Route } from 'react-router-dom';


import { DatasetHome } from '../datasets/home';
import { DatasetEdit } from '../datasets/edit';
import { DatasetView } from '../datasets/view';
import { DistributionHome } from '../distributions/home';
import { DistributionEdit } from '../distributions/edit';
import { DistributionView } from '../distributions/view';
import DatasetsMenu from './menu';

const rootApp = document.getElementById('root-app');
const DatasetsComponent = () => {
	if(rootApp){
		rootApp.classList = ['datasets'];
	}

	return (
		<>
			<DatasetsMenu />
			<div className="container">
				<Switch>
					<Route exact path="/datasets" component={DatasetHome} />
					<Route exact path="/datasets/distributions" component={DistributionHome} />

					<Route
						exact
						path="/datasets/create"
						component={DatasetEdit}
					/>
					<Route
						exact
						path="/datasets/:id"
						component={DatasetView}
					/>
					<Route
						exact
						path="/datasets/:id/modify"
						component={DatasetEdit}
					/>
					<Route
						exact
						path="/datasets/distributions/create"
						component={DistributionEdit}
					/>
					<Route
						exact
						path="/datasets/distributions/:id"
						component={DistributionView}
					/>
					<Route
						exact
						path="/datasets/distributions/:id/modify"
						component={DistributionEdit}
					/>
				</Switch>
			</div>
		</>
	);
};

export default DatasetsComponent;
