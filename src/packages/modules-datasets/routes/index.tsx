import { Route, Routes } from 'react-router-dom';

import { DatasetEdit } from '../datasets/edit/edit';
import { DatasetHome } from '../datasets/home/home';
import { DatasetView } from '../datasets/view/view';
import { DistributionEdit } from '../distributions/edit';
import { DistributionHome } from '../distributions/home/home';
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
				<Routes>
					<Route path="/" element={<DatasetHome />} />
					<Route path="/distributions" element={<DistributionHome />} />
					<Route path="/create" element={<DatasetEdit />} />
					<Route path="/:id" element={<DatasetView />} />
					<Route path="/:id/modify" element={<DatasetEdit />} />
					<Route path="/distributions/create" element={<DistributionEdit />} />
					<Route path="/distributions/:id" element={<DistributionView />} />
					<Route
						path="/distributions/:id/modify"
						element={<DistributionEdit />}
					/>
				</Routes>
			</div>
		</>
	);
};

export default DatasetsComponent;
