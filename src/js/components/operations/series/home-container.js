import React, { Component } from 'react';
import { connect } from 'react-redux';
import Loading from 'js/components/shared/loading';
import SeriesHome from './home';
import { NOT_LOADED, LOADED } from 'js/constants';
import loadSeriesList from 'js/actions/operations/series/list';

class SeriesHomeContainer extends Component {
	componentWillMount() {
		if (this.props.status !== LOADED) {
			this.props.loadSeriesList();
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
};

export default connect(mapStateToProps, mapDispatchToProps)(
	SeriesHomeContainer
);
