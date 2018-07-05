import React, { Component } from 'react';
import { connect } from 'react-redux';
import Loading from 'js/components/shared/loading';
import CorrespondencesHome from './home';
import { NOT_LOADED } from 'js/constants';
import loadCorrespondencesList from 'js/actions/classifications/correspondences/list';

class CorrespondencesHomeContainer extends Component {
	componentWillMount() {
		if (!this.props.correspondences) {
			this.props.loadCorrespondencesList();
		}
	}
	render() {
		const { correspondences } = this.props;
		if (!correspondences)
			return <Loading textType="loading" context="classifications" />;
		return <CorrespondencesHome correspondences={correspondences} />;
	}
}

const mapStateToProps = state => {
	if (!state.classificationsCorrespondencesList) {
		return {
			status: NOT_LOADED,
			correspondences: [],
		};
	}
	//TODO should be sorted in the state, shouldn't they ?
	let {
		results: correspondences,
		status,
		err,
	} = state.classificationsCorrespondencesList;

	return {
		correspondences,
		status,
		err,
	};
};

const mapDispatchToProps = {
	loadCorrespondencesList,
};

export default connect(mapStateToProps, mapDispatchToProps)(
	CorrespondencesHomeContainer
);
