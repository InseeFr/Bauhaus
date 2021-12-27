import React, { useEffect, useState } from 'react';
import { Loading } from '@inseefr/wilco';
import OperationsHome from './home';
import api from '../../../remote-api/operations-api';

const OperationsHomeContainer = () => {
	const [operations, setOperations] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		api.getOperationsList()
			.then(result => setOperations(result))
			.finally(() => setLoading(false));
	}, [])

	if (loading) return <Loading />;
	return <OperationsHome operations={operations} />;
};

export default OperationsHomeContainer
