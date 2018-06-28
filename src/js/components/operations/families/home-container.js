import React, { Component } from 'react';
import Loading from 'js/components/shared/loading';
import FamiliesHome from './home';
import loadFamiliesList from 'js/actions/operations/families/list';
import { connect } from 'react-redux';
import { NOT_LOADED } from 'js/constants';

class FamiliesHomeContainer extends Component {
	componentWillMount() {
		if (!this.props.concepts) {
			this.props.loadFamiliesList();
		}
	}
	render() {
		const { families } = this.props;
		if (!families) return <Loading textType="loading" context="operations" />;
		return <FamiliesHome families={families} />;
	}
}
const mapStateToProps = state => {
	if (!state.operationsFamiliesList) {
		return {
			status: NOT_LOADED,
			series: [],
		};
	}
	//TODO should be sorted in the state, shouldn't they ?
	let { results: families, status, err } = state.operationsFamiliesList;

	return {
		families,
		status,
		err,
	};
};

const mapDispatchToProps = {
	loadFamiliesList,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(FamiliesHomeContainer);
