import React, { useEffect, useState } from 'react';
import { Loading } from '@inseefr/wilco';
import SeriesHome from './home';
import api from '../../../remote-api/operations-api';
import { ArrayUtils } from 'bauhaus-utilities';

function SeriesHomeContainer() {
	const [series, setSeries] = useState([])
	const [loading, setLoading] = useState(true)
	useEffect(() => {
		api.getSeriesList().then(result => setSeries(ArrayUtils.sortArray('label')(result))).finally(() => setLoading(false))
	}, [])
	if (loading) return <Loading />;
	return <SeriesHome series={series} />;
}

//operationsSeriesList

export default SeriesHomeContainer
