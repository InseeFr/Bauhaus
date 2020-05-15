import React from 'react';
import { Loading } from '@inseefr/wilco';
import IndicatorsHome from './home';
import loadIndicatorsList from 'js/actions/operations/indicators/list';
import { connect } from 'react-redux';
import { NOT_LOADED, LOADED } from 'js/constants';
import { Auth } from 'bauhaus-utilities';

function IndicatorsHomeContainer({ indicators, status, permission }) {
	if (status !== LOADED) return <Loading />;
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
	const permission = Auth.getPermission(state);
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
