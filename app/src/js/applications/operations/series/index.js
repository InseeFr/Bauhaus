import React, { useEffect, useState } from 'react';
import { Loading } from '@inseefr/wilco';
import SeriesHome from './home';
import api from '../../../remote-api/operations-api';

function SeriesHomeContainer() {
	const [series, setSeries] = useState([])
	const [loading, setLoading] = useState(true)
	useEffect(() => {
		api.getSeriesList().then(result => setSeries(result)).finally(() => setLoading(false))
	})
	if (loading) return <Loading />;
	return <SeriesHome series={series} />;
}

//operationsSeriesList

export default SeriesHomeContainer
