import { useQuery } from '@tanstack/react-query';

import { ClassificationsApi } from '@sdk/classification';

export const useClassificationsItem = (id: string) => {
	return useQuery({
		queryKey: ['classification-items', id],
		queryFn: () => ClassificationsApi.getClassificationItems(id),
	});
};
