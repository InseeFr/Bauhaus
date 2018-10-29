import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';

import OperationsFamiliesContainer from 'js/components/operations/families/';
import OperationsSeriesContainer from 'js/components/operations/series/';
import OperationsContainer from 'js/components/operations/operations/';
import OperationsIndicatorsContainer from 'js/components/operations/indicators/';

import OperationsFamilyVisualizationContainer from 'js/components/operations/families/visualization/';
import OperationsSeriesVisualizationContainer from 'js/components/operations/series/visualization/';
import OperationVisualizationContainer from 'js/components/operations/operations/visualization/';
import OperationIndicatorContainer from 'js/components/operations/indicators/visualization/';

import OperationsFamilyEditionContainer from 'js/components/operations/families/edition';
import OperationsSeriesEditionContainer from 'js/components/operations/series/edition';
import OperationEditionContainer from 'js/components/operations/operations/edition';
import OperationsIndicatorEditionContainer from 'js/components/operations/indicators/edition';

import { loadSetup } from 'js/actions/operations/utils/setup';
import MSDContainer, { CREATE, VIEW, UPDATE } from '../operations/msd/';

class RootComponent extends Component {
	componentDidMount() {
		this.props.loadSetup();
	}
	render() {
		return (
			<Switch>
				<Route
					exact
					path="/operations/families"
					component={OperationsFamiliesContainer}
				/>
				<Route
					exact
					path="/operations/series"
					component={OperationsSeriesContainer}
				/>
				<Route exact path="/operations" component={OperationsContainer} />
				<Route
					exact
					path="/operations/family/:id"
					component={OperationsFamilyVisualizationContainer}
				/>
				<Route
					exact
					path="/operations/indicators"
					component={OperationsIndicatorsContainer}
				/>
				<Route
					exact
					path="/operations/indicator/create"
					component={OperationsIndicatorEditionContainer}
				/>
				<Route
					exact
					path="/operations/indicator/:id"
					component={OperationIndicatorContainer}
				/>
				<Route
					exact
					path="/operations/indicator/:id/modify"
					component={OperationsIndicatorEditionContainer}
				/>
				<Route
					exact
					path="/operations/family/:id/modify"
					component={OperationsFamilyEditionContainer}
				/>
				<Route
					exact
					path="/operations/series/:id"
					component={OperationsSeriesVisualizationContainer}
				/>
				<Route
					exact
					path="/operations/series/:id/modify"
					component={OperationsSeriesEditionContainer}
				/>
				<Route
					exact
					path="/operations/operation/:id"
					component={OperationVisualizationContainer}
				/>
				<Route
					exact
					path="/operations/operation/:id/modify"
					component={OperationEditionContainer}
				/>
				<Route exact path="/operations/help" component={MSDContainer} />
				<Route
					exact
					path="/operations/help/:idSection"
					component={MSDContainer}
				/>
				<Route
					exact
					path="/operations/:idOperation/sims/create"
					render={props => (
						<MSDContainer
							mode={CREATE}
							baseUrl={`/operations/${
								props.match.params.idOperation
							}/sims/create`}
							disableSectionAnchor
						/>
					)}
				/>
				<Route
					exact
					path="/operations/sims/:id"
					render={props => (
						<MSDContainer
							mode={VIEW}
							baseUrl={`/operations/sims/${props.match.params.id}/section/`}
						/>
					)}
				/>
				<Route
					exact
					path="/operations/sims/:id/modify"
					render={props => (
						<MSDContainer
							mode={UPDATE}
							disableSectionAnchor
							baseUrl={`/operations/sims/${props.match.params.id}/modify`}
						/>
					)}
				/>
				<Route
					exact
					path="/operations/sims/:id/section/:idSection"
					render={props => (
						<MSDContainer
							mode={VIEW}
							baseUrl={`/operations/sims/${props.match.params.id}/section/`}
						/>
					)}
				/>
			</Switch>
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
