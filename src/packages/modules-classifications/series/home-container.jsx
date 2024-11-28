import { useQuery } from '@tanstack/react-query';

import { Loading } from '@components/loading';

import { ClassificationsApi } from '@sdk/classification';

import SeriesHome from './home';

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
