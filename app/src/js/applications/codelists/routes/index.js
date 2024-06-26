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
					<Route exact path="/codelists" component={Home} />
					<Route exact path="/codelists/create" component={CodesListEdit} />
					<Route exact path="/codelists/search" component={SearchFormList} />
					<Route exact path="/codelists/:id" component={CodesListView} />
					<Route exact path="/codelists/:id/modify" component={CodesListEdit} />
					<Route
						exact
						path="/codelists-partial"
						component={CodeListsPartialHome}
					/>
					<Route
						exact
						path="/codelists-partial/create"
						component={PartialCodesListEdit}
					/>
					<Route
						exact
						path="/codelists-partial/search"
						component={SearchFormPartialList}
					/>
					<Route
						exact
						path="/codelists-partial/:id"
						component={PartialCodesListView}
					/>
					<Route
						exact
						path="/codelists-partial/:id/modify"
						component={PartialCodesListEdit}
					/>
				</Switch>
			</div>
		</>
	);
};

export default CodesListComponent;
