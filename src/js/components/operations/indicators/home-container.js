import React, { Component } from 'react';
import Loading from 'js/components/shared/loading';
import IndicatorsHome from './home';
import loadIndicatorsList from 'js/actions/operations/indicators/list';
import { connect } from 'react-redux';
import { NOT_LOADED, LOADED } from 'js/constants';
import * as select from 'js/reducers';

class IndicatorsHomeContainer extends Component {
	componentWillMount() {
		if (this.props.status !== LOADED) {
			this.props.loadIndicatorsList();
		}
	}
	render() {
		const { indicators, status, permission } = this.props;
		if (status !== LOADED)
			return <Loading textType="loading" context="operations" />;
		return <IndicatorsHome indicators={indicators} permission={permission} />;
	}
}
const mapStateToProps = state => {
	if (!state.operationsIndicatorsList) {
		return {
			status: NOT_LOADED,
			indicators: [],
		};
	}
	//TODO should be sorted in the state, shouldn't they ?
	const { results: indicators, status, err } = state.operationsIndicatorsList;
	const permission = select.getPermission(state);
	return {
		indicators,
		status,
		permission,
		err,
	};
};

const mapDispatchToProps = {
	loadIndicatorsList,
};

export default connect(mapStateToProps, mapDispatchToProps)(
	IndicatorsHomeContainer
);
