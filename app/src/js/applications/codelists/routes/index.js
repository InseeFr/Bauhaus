import React  from 'react';
import { Switch, Route } from 'react-router-dom';

import { Home } from 'bauhaus-codelists';

import D from 'js/i18n';

const CodesListComponent = () => {
	console.log("yo")
	document.title = 'Bauhaus - ' + D.structuresTitle;
	document.getElementById('root-app').classList = ['structures'];
	return (
		<>
			<div className="container">
				<Switch>
					<Route exact path="/codelists" component={Home} />
				</Switch>
			</div>
		</>
	);
};

export default CodesListComponent;
