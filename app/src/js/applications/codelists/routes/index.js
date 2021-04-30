import React from 'react';
import { Switch, Route } from 'react-router-dom';

import { Menu, Home, CodelistComponentView, D } from 'bauhaus-codelists';

const CodesListComponent = () => {
	document.title = 'Bauhaus - ' + D.codelistsTitle;
	document.getElementById('root-app').classList = ['structures'];
	return (
		<>
			<Menu />
			<div className="container">
				<Switch>
					<Route exact path="/codelists" component={Home} />
					<Route
						exact
						path="/codelists/components/:notation"
						component={CodelistComponentView}
					/>
				</Switch>
			</div>
		</>
	);
};

export default CodesListComponent;
