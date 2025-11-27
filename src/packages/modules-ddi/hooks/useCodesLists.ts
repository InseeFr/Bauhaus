import { useQuery } from '@tanstack/react-query';

import { DDIApi } from '../../sdk';

export const useCodesLists = () => {
	return useQuery({
		queryKey: ['codesLists'],
		queryFn: () => DDIApi.getCodesLists(),
	});
};
