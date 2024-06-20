import React, { useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';

import Menu from 'js/applications/structures/menu';
import Home from 'js/applications/structures/home/home';
import Visualization from 'js/applications/structures/visualization';
import { Create, Update } from 'js/applications/structures/edition';
import StructuresComponentsList from '../components/components-list';
import StructuresComponentsSearch from '../components/component-search/search';
import StructuresSearch from '../components/structure-search/search';
import StructuresComponentView from '../components/component-detail/view-container';
import StructuresComponentEdit from '../components/component-detail/edit-container';

import { connect } from 'react-redux';
import loadStampList from 'js/actions/stamp';

const StructureComponent = ({ loadStampList }) => {
	useEffect(() => {
		loadStampList();
	}, [loadStampList]);

	return (
		<>
			<Menu />
			<div className="container">
				<Switch>
					<Route exact path="/structures" component={Home} />
					<Route
						exact
						path="/structures/components"
						component={StructuresComponentsList}
					/>
					<Route exact path="/structures/search" component={StructuresSearch} />
					<Route
						exact
						path="/structures/components/search"
						component={StructuresComponentsSearch}
					/>
					<Route
						exact
						path="/structures/components/create"
						component={StructuresComponentEdit}
					/>
					<Route
						exact
						path="/structures/components/:id"
						component={StructuresComponentView}
					/>
					<Route
						exact
						path="/structures/components/:id/modify"
						component={StructuresComponentEdit}
					/>
					<Route exact path="/structures/create" component={Create} />
					<Route
						exact
						path="/structures/:structureId/update"
						component={Update}
					/>
					<Route
						exact
						path="/structures/:structureId/duplicate"
						component={Update}
					/>
					<Route
						exact
						path="/structures/:structureId"
						component={Visualization}
					/>
				</Switch>
			</div>
		</>
	);
};

export default connect(undefined, {
	loadStampList,
})(StructureComponent);
