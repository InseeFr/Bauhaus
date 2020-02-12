import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Loading } from '@inseefr/wilco';
import ClassificationsHome from './home';
import { NOT_LOADED } from 'js/constants';
import loadClassificationsList from 'js/actions/classifications/list';
import { getClassificationsList } from 'js/reducers/classifications/selector';
class ClassificationsHomeContainer extends Component {
	componentWillMount() {
		if (!this.props.classifications) {
			this.props.loadClassificationsList();
		}
	}
	render() {
		const { classifications } = this.props;
		if (!classifications) return <Loading />;
		return <ClassificationsHome classifications={classifications} />;
	}
}

export const mapStateToProps = state => {
	const classificationsList = getClassificationsList(state);
	if (!classificationsList) {
		return {
			status: NOT_LOADED,
			classifications: [],
		};
	}
	let { results: classifications, status, err } = classificationsList;

	return {
		classifications,
		status,
		err,
	};
};

const mapDispatchToProps = {
	loadClassificationsList,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(ClassificationsHomeContainer);
