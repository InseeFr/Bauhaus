import { Route, Routes } from 'react-router-dom';

import CodesListEdit from '../components/codelist-detail/edit-context';
import CodesListView from '../components/codelist-detail/view-container';
import PartialCodesListEdit from '../components/codelist-partial-detail/edit-container';
import PartialCodesListView from '../components/codelist-partial-detail/view-container';
import Home from '../components/home/home';
import CodeListsPartialHome from '../components/home/partial-home';
import SearchFormPartialList from '../components/search/partial-search';
import SearchFormList from '../components/search/search';
import Menu from '../menu';

const CodesListComponent = () => {
	document.getElementById('root-app').classList = ['codelists'];

	return (
		<>
			<Menu />
			<div className="container">
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/create" element={<CodesListEdit />} />
					<Route path="/search" element={<SearchFormList />} />
					<Route path="/:id" element={<CodesListView />} />
					<Route path="/:id/modify" element={<CodesListEdit />} />
					<Route path="/partial" element={<CodeListsPartialHome />} />
					<Route path="/partial/create" element={<PartialCodesListEdit />} />
					<Route path="/partial/search" element={<SearchFormPartialList />} />
					<Route path="/partial/:id" element={<PartialCodesListView />} />
					<Route
						path="/partial/:id/modify"
						element={<PartialCodesListEdit />}
					/>
				</Routes>
			</div>
		</>
	);
};

export default CodesListComponent;
