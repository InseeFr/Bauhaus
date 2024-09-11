import { Switch, Route } from 'react-router-dom';

import Menu from '../menu';
import Home from '../home/home';
import Visualization from '../visualization';
import { Create, Update } from '../edition';
import StructuresComponentsList from '../components/components-list';
import StructuresComponentsSearch from '../components/component-search/search';
import StructuresSearch from '../components/structure-search/search';
import StructuresComponentView from '../components/component-detail/view-container';
import StructuresComponentEdit from '../components/component-detail/edit-container';

const StructureComponent = () => {
	return (
		<>
			<Menu />
			<div className="container">
				<Switch>
					<Route exact path="/structures"><Home /></Route>
					<Route
						exact
						path="/structures/components"
					><StructuresComponentsList /></Route>
					<Route exact path="/structures/search"><StructuresSearch /></Route>
					<Route
						exact
						path="/structures/components/search"
					><StructuresComponentsSearch /></Route>
					<Route
						exact
						path="/structures/components/create"
					><StructuresComponentEdit /></Route>
					<Route
						exact
						path="/structures/components/:id"
					><StructuresComponentView /></Route>
					<Route
						exact
						path="/structures/components/:id/modify"
					><StructuresComponentEdit /></Route>
					<Route exact path="/structures/create"><Create /></Route>
					<Route
						exact
						path="/structures/:structureId/update"
					><Update /></Route>
					<Route
						exact
						path="/structures/:structureId/duplicate"
					><Update /></Route>
					<Route
						exact
						path="/structures/:structureId"
					><Visualization /></Route>
				</Switch>
			</div>
		</>
	);
};

export default StructureComponent;
