import React, { Component } from 'react';
import { connect } from 'react-redux';
import Loading from 'js/components/shared/loading';
import FamiliesHome from './home';
import { NOT_LOADED } from 'js/constants';
import loadFamiliesList from 'js/actions/classifications/families/list';

class FamiliesHomeContainer extends Component {
	componentWillMount() {
		if (!this.props.series) {
			this.props.loadFamiliesList();
		}
	}
	render() {
		const { families } = this.props;
		if (!families)
			return <Loading textType="loading" context="classifications" />;
		return <FamiliesHome families={families} />;
	}
}

const mapStateToProps = state => {
	if (!state.classificationsFamiliesList) {
		return {
			status: NOT_LOADED,
			families: [],
		};
	}
	//TODO should be sorted in the state, shouldn't they ?
	let { results: families, status, err } = state.classificationsFamiliesList;

	return {
		families,
		status,
		err,
	};
};

const mapDispatchToProps = {
	loadFamiliesList,
};

export default connect(mapStateToProps, mapDispatchToProps)(
	FamiliesHomeContainer
);
