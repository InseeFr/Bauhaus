import React, { useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';

import Menu from 'js/applications/structures/menu';
import Home from 'js/applications/structures/home';
import Visualization from 'js/applications/structures/structures/visualization';
import { Create, Update } from 'js/applications/structures/structures/edition';
import {
	StructuresComponentsList,
	StructuresComponentsSearch,
	StructuresComponentView,
	StructuresComponentEdit,
	StructuresSearch,
} from 'bauhaus-structures';
import D from 'js/i18n';
import { connect } from 'react-redux';
import loadStampList from 'js/actions/stamp';

const StructureComponent = ({ loadStampList }) => {
	useEffect(() => {
		loadStampList();
	}, [loadStampList])
	document.title = 'Bauhaus - ' + D.structuresTitle;
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
					<Route exact path="/structures/:structureId/update" component={Update} />
					<Route exact path="/structures/:structureId/duplicate" component={Update} />
					<Route exact path="/structures/:structureId" component={Visualization} />
				</Switch>
			</div>
		</>
	);
};

export default connect(undefined, {
	loadStampList
})(StructureComponent)
