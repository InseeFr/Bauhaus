import React, { useEffect, useState } from 'react';
import { Loading } from '@inseefr/wilco';
import SeriesHome from './home';
import api from 'js/remote-api/classifications-api';

const SeriesHomeContainer = () => {
	const [series, setSeries] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		api.getSeriesList().then(result => setSeries(result)).finally(() => setLoading(false));
	}, []);

	if(loading){
		return <Loading />
	}

	return <SeriesHome series={series} />;
}

export default SeriesHomeContainer;
