import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Loading } from '@inseefr/wilco';
import CorrespondencesHome from './home';
import { NOT_LOADED } from 'js/constants';
import loadCorrespondencesList from 'js/actions/classifications/correspondences/list';
import { getCorrespondencesList } from 'js/reducers/classifications/correspondence';

class CorrespondencesHomeContainer extends Component {
	componentWillMount() {
		if (!this.props.correspondences) {
			this.props.loadCorrespondencesList();
		}
	}
	render() {
		const { correspondences } = this.props;
		if (!correspondences) return <Loading />;
		return <CorrespondencesHome correspondences={correspondences} />;
	}
}

export const mapStateToProps = state => {
	const classificationsCorrespondencesList = getCorrespondencesList(state);
	if (!classificationsCorrespondencesList) {
		return {
			status: NOT_LOADED,
			correspondences: [],
		};
	}
	let {
		results: correspondences,
		status,
		err,
	} = classificationsCorrespondencesList;

	return {
		correspondences,
		status,
		err,
	};
};

const mapDispatchToProps = {
	loadCorrespondencesList,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(CorrespondencesHomeContainer);
