import { useQuery } from '@tanstack/react-query';
import { StructureApi } from '../../sdk';

export const useStructures = () =>
	useQuery({
		queryKey: ['structures'],
		queryFn: StructureApi.getStructures,
	});
