import React, { useEffect, useState } from 'react';
import { Loading } from '../../../new-architecture/components';
import OperationsHome from './home';
import { ArrayUtils } from '../../../utils';
import { OperationsApi } from '../../../new-architecture/sdk/operations-api';

const OperationsHomeContainer = () => {
	const [operations, setOperations] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		OperationsApi.getOperationsList()
			.then((result) => setOperations(ArrayUtils.sortArray('label')(result)))
			.finally(() => setLoading(false));
	}, []);

	if (loading) return <Loading />;
	return <OperationsHome operations={operations} />;
};

export default OperationsHomeContainer;
