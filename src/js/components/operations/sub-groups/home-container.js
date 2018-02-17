import React, { Component } from 'react';
import { connect } from 'react-redux';
import Loadable from 'react-loading-overlay';
import SubGroupsHome from './home';
import { dictionary } from 'js/utils/dictionary';
import { NOT_LOADED } from 'js/constants';
import loadSeriesList from 'js/actions/operations/series/list';

class SubGroupsHomeContainer extends Component {
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
		return <SubGroupsHome subGroups={series} />;
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
	SubGroupsHomeContainer
);
