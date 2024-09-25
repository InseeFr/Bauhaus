import { useEffect, useState } from 'react';
import { Loading } from '../../components';
import SeriesHome from './home';
import { OperationsApi } from '../../sdk/operations-api';
import { sortArray } from '../../utils/array-utils';

export const Component = () => {
	const [series, setSeries] = useState([]);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		OperationsApi.getSeriesList()
			.then((result) => setSeries(sortArray('label')(result)))
			.finally(() => setLoading(false));
	}, []);
	if (loading) return <Loading />;
	return <SeriesHome series={series} />;
};
