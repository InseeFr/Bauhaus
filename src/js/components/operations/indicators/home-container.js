import React, { Component } from 'react';
import Loading from 'js/components/shared/loading';
import IndicatorsHome from './home';
import loadIndicatorsList from 'js/actions/operations/indicators/list';
import { connect } from 'react-redux';
import { NOT_LOADED, LOADED } from 'js/constants';

class IndicatorsHomeContainer extends Component {
	componentWillMount() {
		if (this.props.status !== LOADED) {
			this.props.loadIndicatorsList();
		}
	}
	render() {
		const { indicators, status } = this.props;
		if (status !== LOADED)
			return <Loading textType="loading" context="operations" />;
		return <IndicatorsHome indicators={indicators} />;
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
	let { results: indicators, status, err } = state.operationsIndicatorsList;

	return {
		indicators,
		status,
		err,
	};
};

const mapDispatchToProps = {
	loadIndicatorsList,
};

export default connect(mapStateToProps, mapDispatchToProps)(
	IndicatorsHomeContainer
);
