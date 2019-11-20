import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';

import { loadSetup } from 'js/actions/operations/utils/setup';

import D from 'js/i18n';
import { ThemeContext } from 'bauhaus-library';

import FamilyRoutes from 'js/applications/operations/routes/family';
import SeriesRoutes from 'js/applications/operations/routes/series';
import OperationsRoutes from 'js/applications/operations/routes/operation';
import DocumentRoutes from 'js/applications/operations/routes/document';
import IndicatorRoutes from 'js/applications/operations/routes/indicator';
import SimsRoutes from 'js/applications/operations/routes/sims';
import Menu from 'js/applications/operations/menu';

class RootComponent extends Component {
	componentDidMount() {
		this.props.loadSetup();
		document.title = 'Bauhaus - ' + D.operationsTitle;
		document.body.classList = ['operations'];
	}
	render() {
		return (
			<>
				<Menu />
				<ThemeContext.Provider value={'operations'}>
					<FamilyRoutes />
					<SeriesRoutes />
					<OperationsRoutes />
					<IndicatorRoutes />
					<DocumentRoutes />
					<SimsRoutes />
				</ThemeContext.Provider>
			</>
		);
	}
}
const mapDispatchToProps = {
	loadSetup,
};
const ConnectedRootComponent = connect(
	undefined,
	mapDispatchToProps
)(RootComponent);

export default () => <Route path="/" component={ConnectedRootComponent} />;
