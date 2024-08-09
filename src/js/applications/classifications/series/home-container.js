import { Loading } from '../../../new-architecture/components';
import SeriesHome from './home';
import { useQuery } from '@tanstack/react-query';
import { ClassificationsApi } from '../../../new-architecture/sdk/classification';

const SeriesHomeContainer = () => {
	const { isLoading, data: series } = useQuery({
		queryKey: ['classifications-series'],
		queryFn: () => {
			return ClassificationsApi.getSeriesList();
		},
	});

	if (isLoading) {
		return <Loading />;
	}

	return <SeriesHome series={series} />;
};

export default SeriesHomeContainer;
