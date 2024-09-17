import { Switch, Route } from 'react-router-dom';

import Menu from '../menu';
import Home from '../components/home/home';
import CodeListsPartialHome from '../components/home/partial-home';
import SearchFormList from '../components/search/search';
import SearchFormPartialList from '../components/search/partial-search';
import CodesListView from '../components/codelist-detail/view-container';
import CodesListEdit from '../components/codelist-detail/edit-context';
import PartialCodesListView from '../components/codelist-partial-detail/view-container';
import PartialCodesListEdit from '../components/codelist-partial-detail/edit-container';

const CodesListComponent = () => {
	document.getElementById('root-app').classList = ['codelists'];

	return (
		<>
			<Menu />
			<div className="container">
				<Switch>
					<Route exact path="/codelists"><Home /></Route>
					<Route exact path="/codelists/create"><CodesListEdit /></Route>
					<Route exact path="/codelists/search"><SearchFormList /></Route>
					<Route exact path="/codelists/:id"><CodesListView /></Route>
					<Route exact path="/codelists/:id/modify"><CodesListEdit /></Route>
					<Route
						exact
						path="/codelists-partial"
					><CodeListsPartialHome /></Route>
					<Route
						exact
						path="/codelists-partial/create"
					><PartialCodesListEdit /></Route>
					<Route
						exact
						path="/codelists-partial/search"
					><SearchFormPartialList /></Route>
					<Route
						exact
						path="/codelists-partial/:id"
					><PartialCodesListView /></Route>
					<Route
						exact
						path="/codelists-partial/:id/modify"
					><PartialCodesListEdit /></Route>
				</Switch>
			</div>
		</>
	);
};

export default CodesListComponent;
