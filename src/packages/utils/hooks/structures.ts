import { useQuery } from '@tanstack/react-query';

import { StructureApi } from '@sdk/index';

import { StructuresList } from '../../model/structures/Structure';

export const useStructures = () =>
	useQuery<StructuresList>({
		queryKey: ['structures'],
		queryFn: StructureApi.getStructures,
	});
