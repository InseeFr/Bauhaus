import { useQuery } from '@tanstack/react-query';
import { StampsApi } from '../../sdk';

export const useStamps = () =>
	useQuery({
		queryKey: ['stamps'],
		queryFn: () => {
			return StampsApi.getStamps();
		},
	});

export const useStampsOptions = () => {
	const { data = [] } = useStamps() as any;
	return data.map((stamp: string) => ({
		value: stamp,
		label: stamp,
	}));
};
