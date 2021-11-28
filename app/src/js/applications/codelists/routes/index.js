import React from 'react';
import { Switch, Route } from 'react-router-dom';

import {
	Menu,
	Home,
	CodelistComponentView,
	CodeListsEditContext,
	SearchFormList,
} from 'bauhaus-codelists';

const CodesListComponent = () => {
	document.getElementById('root-app').classList = ['codelists'];
	return (
		<>
			<Menu />
			<div className="container">
				<Switch>
					<Route exact path="/codelists" component={Home} />
					<Route
						exact
						path="/codelists/create"
						component={CodeListsEditContext}
					/>
					<Route exact path="/codelists/search" component={SearchFormList} />
					<Route
						exact
						path="/codelists/:id"
						component={CodelistComponentView}
					/>
					<Route
						exact
						path="/codelists/:id/modify"
						component={CodeListsEditContext}
					/>
				</Switch>
			</div>
		</>
	);
};

export default CodesListComponent;
