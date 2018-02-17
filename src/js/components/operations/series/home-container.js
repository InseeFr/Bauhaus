import React, { Component } from 'react';
import { connect } from 'react-redux';
import Loadable from 'react-loading-overlay';
import SeriesHome from './home';
import { dictionary } from 'js/utils/dictionary';
import { NOT_LOADED } from 'js/constants';
import loadSeriesList from 'js/actions/operations/series/list';

class SeriesHomeContainer extends Component {
	componentWillMount() {
		if (!this.props.concepts) {
			this.props.loadSeriesList();
		}
	}
	render() {
		const { series } = this.props;
		if (!series) {
			return (
				<div>
					<Loadable
						active={true}
						spinner
						text={dictionary.loadable.loading}
						color="#457DBB"
						background="grey"
						spinnerSize="400px"
					/>
				</div>
			);
		}
		return <SeriesHome series={series} />;
	}
}

const mapStateToProps = state => {
	if (!state.seriesList) {
		return {
			status: NOT_LOADED,
			series: [],
		};
	}
	//TODO should be sorted in the state, shouldn't they ?
	let { results: series, status, err } = state.seriesList;

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
