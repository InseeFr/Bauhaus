import { useQuery } from '@tanstack/react-query';

import { StampsApi } from '../../sdk';

export const useStamps = () =>
	useQuery({
		queryKey: ['stamps'],
		queryFn: () => {
			return StampsApi.getStamps() as Promise<string[]>;
		},
	});

export const useStampsOptions = () => {
	const { data = [] } = useStamps();
	return data.map((stamp: string) => ({
		value: stamp,
		label: stamp,
	}));
};
