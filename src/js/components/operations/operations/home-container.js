import React, { Component } from 'react';
import { connect } from 'react-redux';
import Loading from 'js/components/shared/loading';
import OperationsHome from './home';
import { NOT_LOADED } from 'js/constants';
import loadOperationsList from 'js/actions/operations/operations/list';

class OperationsHomeContainer extends Component {
	componentWillMount() {
		if (!this.props.concepts) {
			this.props.loadOperationsList();
		}
	}
	render() {
		const { operations } = this.props;
		if (!operations) return <Loading textType="loading" context="operations" />;
		return <OperationsHome operations={operations} />;
	}
}

const mapStateToProps = state => {
	if (!state.operationsOperationsList) {
		return {
			status: NOT_LOADED,
			operations: [],
		};
	}
	let { results: operations, status, err } = state.operationsOperationsList;

	return {
		operations,
		status,
		err,
	};
};

const mapDispatchToProps = {
	loadOperationsList,
};

export default connect(mapStateToProps, mapDispatchToProps)(
	OperationsHomeContainer
);
