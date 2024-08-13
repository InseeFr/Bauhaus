import { useEffect, useState } from 'react';
import { Loading } from '../../../new-architecture/components';
import SeriesHome from './home';
import { ArrayUtils } from '../../../utils';
import { OperationsApi } from '../../../new-architecture/sdk/operations-api';

function SeriesHomeContainer() {
	const [series, setSeries] = useState([]);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		OperationsApi.getSeriesList()
			.then((result) => setSeries(ArrayUtils.sortArray('label')(result)))
			.finally(() => setLoading(false));
	}, []);
	if (loading) return <Loading />;
	return <SeriesHome series={series} />;
}

export default SeriesHomeContainer;
