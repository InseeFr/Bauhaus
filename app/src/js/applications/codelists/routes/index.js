import React from 'react';
import { Switch, Route } from 'react-router-dom';

import {
	Menu,
	Home,
	CodelistComponentView,
	CodelistEdit,
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
					<Route exact path="/codelists/create" component={CodelistEdit} />
					<Route exact path="/codelists/search" component={SearchFormList} />
					<Route
						exact
						path="/codelists/:id"
						component={CodelistComponentView}
					/>
					<Route exact path="/codelists/:id/modify" component={CodelistEdit} />
				</Switch>
			</div>
		</>
	);
};

export default CodesListComponent;
