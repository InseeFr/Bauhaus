import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Menu from 'js/applications/structures/menu';
import Home from 'js/applications/structures/home';
import Visualization from 'js/applications/structures/visualization';
import { Create, Update } from 'js/applications/structures/edition';

import D from 'js/i18n';

export default () => {
	document.title = 'Bauhaus - ' + D.structuresTitle;
	document.getElementById('root-app').classList = ['structures'];
	return (
		<>
			<Menu />
			<div className="container">
				<Switch>
					<Route exact path="/structures" component={Home} />
					<Route exact path="/structures/create" component={Create} />
					<Route exact path="/structures/:dsdId/update" component={Update} />
					<Route exact path="/structures/:dsdId" component={Visualization} />
				</Switch>
			</div>
		</>
	);
};
