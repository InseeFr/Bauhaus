import React, { Component } from 'react';
import { connect } from 'react-redux';
import Loading from 'js/components/shared/loading';
import SeriesHome from './home';
import { NOT_LOADED, LOADED } from 'js/constants';
import loadSeriesList from 'js/actions/operations/series/list';
import loadCodesList from 'js/actions/operations/series/codesList';
import { CL_SOURCE_CATEGORY, CL_FREQ } from 'js/actions/constants/codeList';

class SeriesHomeContainer extends Component {
	componentWillMount() {
		if (this.props.status !== LOADED) {
			this.props.loadSeriesList();
			this.props.loadCodesList(CL_FREQ);
			this.props.loadCodesList(CL_SOURCE_CATEGORY);
		}
	}
	render() {
		const { series, status } = this.props;
		if (status !== LOADED)
			return <Loading textType="loading" context="operations" />;
		return <SeriesHome series={series} />;
	}
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
	loadCodesList,
};

export default connect(mapStateToProps, mapDispatchToProps)(
	SeriesHomeContainer
);
