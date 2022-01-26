import React from 'react';
import { Switch, Route } from 'react-router-dom';

import {
	Menu,
	Home,
	CodelistComponentView,
	CodeListsEditContext,
	SearchFormList,
	CodeListsPartialHome,
	SearchFormPartialList,
	CodelistPartialComponentView,
	CodelistPartialEdit,
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
					<Route
						exact
						path="/codelists-partial"
						component={CodeListsPartialHome}
					/>
					<Route
						exact
						path="/codelists-partial/create"
						component={CodelistPartialEdit}
					/>
					<Route
						exact
						path="/codelists-partial/search"
						component={SearchFormPartialList}
					/>
					<Route
						exact
						path="/codelists-partial/:id"
						component={CodelistPartialComponentView}
					/>
					<Route
						exact
						path="/codelists-partial/:id/modify"
						component={CodelistPartialEdit}
					/>
				</Switch>
			</div>
		</>
	);
};

export default CodesListComponent;
