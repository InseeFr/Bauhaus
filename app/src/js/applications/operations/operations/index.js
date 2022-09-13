import React, { useEffect, useState } from 'react';
import { Loading } from '@inseefr/wilco';
import OperationsHome from './home';
import api from '../../../remote-api/operations-api';
import { ArrayUtils } from 'bauhaus-utilities';

const OperationsHomeContainer = () => {
	const [operations, setOperations] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		api.getOperationsList()
			.then(result => setOperations(ArrayUtils.sortArray('label')(result)))
			.finally(() => setLoading(false));
	}, [])

	if (loading) return <Loading />;
	return <OperationsHome operations={operations} />;
};

export default OperationsHomeContainer
