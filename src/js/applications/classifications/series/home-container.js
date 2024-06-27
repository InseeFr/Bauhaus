import { Loading } from '@inseefr/wilco';
import SeriesHome from './home';
import api from 'js/remote-api/classifications-api';
import { useQuery } from '@tanstack/react-query';

const SeriesHomeContainer = () => {
	const { isLoading, data: series } = useQuery(
		['classifications-series'],
		() => {
			return api.getSeriesList();
		}
	);

	if (isLoading) {
		return <Loading />;
	}

	return <SeriesHome series={series} />;
};

export default SeriesHomeContainer;
