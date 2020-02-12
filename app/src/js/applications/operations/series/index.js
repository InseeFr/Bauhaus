import React from 'react';
import { connect } from 'react-redux';
import { Loading } from '@inseefr/wilco';
import SeriesHome from './home';
import { NOT_LOADED, LOADED } from 'js/constants';
import loadSeriesList from 'js/actions/operations/series/list';

function SeriesHomeContainer({ series, status }) {
	if (status !== LOADED) return <Loading />;
	return <SeriesHome series={series} />;
}

const mapStateToProps = state => {
	if (!state.operationsSeriesList) {
		return {
			status: NOT_LOADED,
			series: [],
		};
	}
	const { results: series, status, err } = state.operationsSeriesList;

	return {
		series,
		status,
		err,
	};
};

const mapDispatchToProps = {
	loadSeriesList,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(SeriesHomeContainer);
