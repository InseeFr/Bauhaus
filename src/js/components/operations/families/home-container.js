import React, { Component } from 'react';
import Loading from 'js/components/shared/loading';
import FamiliesHome from './home';
import loadFamiliesList from 'js/actions/operations/families/list';
import { connect } from 'react-redux';
import { NOT_LOADED, LOADED } from 'js/constants';

class FamiliesHomeContainer extends Component {
	componentWillMount() {
		if (this.props.status !== LOADED) {
			this.props.loadFamiliesList();
		}
	}
	render() {
		const { families, status } = this.props;
		if (status !== LOADED)
			return <Loading textType="loading" context="operations" />;
		return <FamiliesHome families={families} />;
	}
}
const mapStateToProps = state => {
	if (!state.operationsFamiliesList) {
		return {
			status: NOT_LOADED,
			families: [],
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
