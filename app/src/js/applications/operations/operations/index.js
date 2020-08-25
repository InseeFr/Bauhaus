import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Loading } from '@inseefr/wilco';
import OperationsHome from './home';
import { NOT_LOADED, LOADED } from 'js/constants';
import loadOperationsList from 'js/actions/operations/operations/list';
import { getOperations } from 'js/reducers';

const OperationsHomeContainer = ({
	operations,
	status,
	loadOperationsList,
}) => {
	useEffect(() => {
		if (status !== LOADED) {
			loadOperationsList();
		}
	}, [status, loadOperationsList]);
	if (status !== LOADED) return <Loading />;
	return <OperationsHome operations={operations} />;
};

export const mapStateToProps = state => {
	const operationsOperationsList = getOperations(state);
	if (!operationsOperationsList.results) {
		return {
			status: NOT_LOADED,
			operations: [],
		};
	}
	const { results: operations, status, err } = operationsOperationsList;

	return {
		operations,
		status,
		err,
	};
};

const mapDispatchToProps = {
	loadOperationsList,
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(OperationsHomeContainer);
