import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';

import { loadSetup } from 'js/actions/operations/utils/setup';

import D from 'js/i18n';
import { ThemeContext } from 'bauhaus-library';

import FamilyRoutes from 'js/components/operations/routes/family';
import SeriesRoutes from 'js/components/operations/routes/series';
import OperationsRoutes from 'js/components/operations/routes/operation';
import DocumentRoutes from 'js/components/operations/routes/document';
import IndicatorRoutes from 'js/components/operations/routes/indicator';
import SimsRoutes from 'js/components/operations/routes/sims';
import Menu from 'js/components/operations/menu';

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
