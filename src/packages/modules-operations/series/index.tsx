import { useEffect, useState } from 'react';
import { Loading } from '@components/loading';
import SeriesHome from './home';
import { OperationsApi } from '../../sdk/operations-api';
import { sortArray } from '../../utils/array-utils';
import { Series } from '../../model/Series';

export const Component = () => {
	const [series, setSeries] = useState<Series[]>([]);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		OperationsApi.getSeriesList()
			.then((result: Series[]) => setSeries(sortArray('label')(result)))
			.finally(() => setLoading(false));
	}, []);
	if (loading) return <Loading />;
	return <SeriesHome series={series} />;
};
