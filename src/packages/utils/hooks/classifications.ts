import { useQuery } from '@tanstack/react-query';
import { ClassificationsApi } from '../../sdk/classification';

export const useClassifications = () => {
	return useQuery({
		queryKey: ['classifications'],
		queryFn: ClassificationsApi.getList,
	});
};
