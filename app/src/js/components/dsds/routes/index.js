import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Menu from 'js/components/dsds/menu';
import Home from 'js/components/dsds/home';
import Visualization from 'js/components/dsds/visualization';
import D from 'js/i18n';

export default () => {
	document.title = 'Bauhaus - ' + D.dsdsTitle;
	return (
		<>
			<Menu />
			<div className="container">
				<Switch>
					<Route exact path="/dsds" component={Home} />
					<Route exact path="/dsds/dsd/:dsdId" component={Visualization} />
				</Switch>
			</div>
		</>
	);
};
