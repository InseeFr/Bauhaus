import { Loading } from '@components/loading';
import SeriesHome from './home';
import { useQuery } from '@tanstack/react-query';
import { ClassificationsApi } from '@sdk/classification';

export const Component = () => {
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
