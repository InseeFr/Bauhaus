import { useEffect, useState } from 'react';
import { Loading } from '../../components';
import OperationsHome from './home';
import { OperationsApi } from '../../sdk/operations-api';
import { sortArray } from '../../utils/array-utils';

const OperationsHomeContainer = () => {
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

export default OperationsHomeContainer;
