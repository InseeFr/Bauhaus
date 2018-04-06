import React, { Component } from 'react';
import { connect } from 'react-redux';
import Loading from 'js/components/shared/loading';
import ClassificationsHome from './home';
import { NOT_LOADED } from 'js/constants';
import loadClassificationsList from 'js/actions/classifications/list';

class ClassificationsHomeContainer extends Component {
	componentWillMount() {
		if (!this.props.classifications) {
			this.props.loadClassificationsList();
		}
	}
	render() {
		const { classifications } = this.props;
		if (!classifications)
			return <Loading textType="loading" context="classifications" />;
		return <ClassificationsHome classifications={classifications} />;
	}
}

const mapStateToProps = state => {
	if (!state.classificationsList) {
		return {
			status: NOT_LOADED,
			classifications: [],
		};
	}
	let { results: classifications, status, err } = state.classificationsList;

	return {
		classifications,
		status,
		err,
	};
};

const mapDispatchToProps = {
	loadClassificationsList,
};

export default connect(mapStateToProps, mapDispatchToProps)(
	ClassificationsHomeContainer
);
