import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Loading } from 'bauhaus-library';
import SeriesHome from './home';
import { NOT_LOADED } from 'js/constants';
import loadSeriesList from 'js/actions/classifications/series/list';
import { getClassificationsSeriesList } from 'js/reducers/classifications/series/selector';

class SeriesHomeContainer extends Component {
	componentWillMount() {
		if (!this.props.series) {
			this.props.loadSeriesList();
		}
	}
	render() {
		const { series } = this.props;
		if (!series) return <Loading />;
		return <SeriesHome series={series} />;
	}
}

export const mapStateToProps = state => {
	const classificationsSeriesList = getClassificationsSeriesList(state);
	if (!classificationsSeriesList) {
		return {
			status: NOT_LOADED,
			series: [],
		};
	}
	let { results: series, status, err } = classificationsSeriesList;

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
