import { useQuery } from '@tanstack/react-query';

import { StructuresList } from '../../model/structures/Structure';
import { StructureApi } from '../../sdk';

export const useStructures = () =>
	useQuery<StructuresList>({
		queryKey: ['structures'],
		queryFn: StructureApi.getStructures,
	});
