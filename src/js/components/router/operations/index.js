import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';

import { loadSetup } from 'js/actions/operations/utils/setup';

import D from 'js/i18n';
import { ApplicationContext } from 'js/context';

import FamilyRoutes from 'js/components/router/operations/family';
import SeriesRoutes from 'js/components/router/operations/series';
import OperationsRoutes from 'js/components/router/operations/operation';
import DocumentRoutes from 'js/components/router/operations/document';
import IndicatorRoutes from 'js/components/router/operations/indicator';
import SimsRoutes from 'js/components/router/operations/sims';

class RootComponent extends Component {
	componentDidMount() {
		this.props.loadSetup();
		document.title = 'Bauhaus - ' + D.operationsTitle;
	}
	render() {
		return (
			<ApplicationContext.Provider value={'operations'}>
				<FamilyRoutes />
				<SeriesRoutes />
				<OperationsRoutes />
				<IndicatorRoutes />
				<DocumentRoutes />
				<SimsRoutes />
			</ApplicationContext.Provider>
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
