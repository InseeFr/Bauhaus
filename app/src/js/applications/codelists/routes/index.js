import React from 'react';
import { Switch, Route } from 'react-router-dom';

import {
	Menu,
	Home,
	CodelistComponentView,
	CodelistEdit,
	D,
	SearchFormList,
} from 'bauhaus-codelists';

const CodesListComponent = () => {
	document.title = 'Bauhaus - ' + D.codelistsTitle;
	document.getElementById('root-app').classList = ['codelists'];
	return (
		<>
			<Menu />
			<div className="container">
				<Switch>
					<Route exact path="/codelists" component={Home} />
					<Route
						exact
						path="/codelists/components/create"
						component={CodelistEdit}
					/>
					<Route exact path="/codelists/search" component={SearchFormList} />
					<Route
						exact
						path="/codelists/components/:id"
						component={CodelistComponentView}
					/>
					<Route
						exact
						path="/codelists/components/:id/modify"
						component={CodelistEdit}
					/>
				</Switch>
			</div>
		</>
	);
};

export default CodesListComponent;
