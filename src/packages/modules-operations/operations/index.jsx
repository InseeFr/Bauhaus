import { useEffect, useState } from 'react';

import { Loading } from '@components/loading';

import { OperationsApi } from '@sdk/operations-api';

import { sortArray } from '../../utils/array-utils';
import OperationsHome from './home';

export const Component = () => {
	const [operations, setOperations] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		OperationsApi.getOperationsList()
			.then((result) => setOperations(sortArray('label')(result)))
			.finally(() => setLoading(false));
	}, []);

	if (loading) return <Loading />;
	return <OperationsHome operations={operations} />;
};
