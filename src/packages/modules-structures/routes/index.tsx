import { Route, Routes } from 'react-router-dom';

import StructuresComponentEdit from '../components/component-detail/edit-container';
import StructuresComponentView from '../components/component-detail/view-container';
import StructuresComponentsSearch from '../components/component-search/search';
import StructuresComponentsList from '../components/components-list';
import StructuresSearch from '../components/structure-search/search';
import { Create, Update } from '../edition';
import Home from '../home/home';
import Menu from '../menu';
import Visualization from '../visualization';

const StructureComponent = () => {
	return (
		<>
			<Menu />
			<div className="container">
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/components" element={<StructuresComponentsList />} />
					<Route path="/search" element={<StructuresSearch />} />
					<Route
						path="/components/search"
						element={<StructuresComponentsSearch />}
					/>
					<Route
						path="/components/create"
						element={<StructuresComponentEdit />}
					/>
					<Route path="/components/:id" element={<StructuresComponentView />} />
					<Route
						path="/components/:id/modify"
						element={<StructuresComponentEdit />}
					/>
					<Route path="/create" element={<Create />} />
					<Route path="/:structureId/update" element={<Update />} />
					<Route path="/:structureId/duplicate" element={<Update />} />
					<Route path="/:structureId" element={<Visualization />} />
				</Routes>
			</div>
		</>
	);
};

export default StructureComponent;
