import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Loading } from '@inseefr/wilco';
import FamiliesHome from './home';
import { NOT_LOADED } from 'js/constants';
import loadFamiliesList from 'js/actions/classifications/families/list';
import { getClassificationsFamiliesList } from 'js/reducers/classifications/classification';

class FamiliesHomeContainer extends Component {
	componentWillMount() {
		if (!this.props.families) {
			this.props.loadFamiliesList();
		}
	}
	render() {
		const { families } = this.props;
		if (!families) return <Loading />;
		return <FamiliesHome families={families} />;
	}
}

export const mapStateToProps = state => {
	const classificationsFamiliesList = getClassificationsFamiliesList(state);
	if (!classificationsFamiliesList) {
		return {
			status: NOT_LOADED,
			families: [],
		};
	}

	let { results: families, status, err } = classificationsFamiliesList;

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
