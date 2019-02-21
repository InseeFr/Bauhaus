import React from 'react';
import Loading from 'js/components/shared/loading';
import IndicatorsHome from './home';
import loadIndicatorsList from 'js/actions/operations/indicators/list';
import { connect } from 'react-redux';
import { NOT_LOADED, LOADED } from 'js/constants';
import * as select from 'js/reducers';

function IndicatorsHomeContainer({ indicators, status, permission }) {
	if (status !== LOADED)
		return <Loading textType="loading" context="operations" />;
	return <IndicatorsHome indicators={indicators} permission={permission} />;
}

export const mapStateToProps = state => {
	if (!state.operationsIndicatorsList) {
		return {
			status: NOT_LOADED,
			indicators: [],
		};
	}
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

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(IndicatorsHomeContainer);
