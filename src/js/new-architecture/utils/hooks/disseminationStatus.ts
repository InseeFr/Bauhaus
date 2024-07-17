import { Options } from '../../model/SelectOption';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../../utils/stores/actions/dissemination-status.action';
export const useDisseminationStatus = () => {
	return useQuery({
		queryKey: ['dissemination-status'],
		queryFn: () => {
			return api.getDisseminationStatus() as Promise<any[]>;
		},
	});
};

export const useDisseminationStatusOptions = (): Options => {
	const { data = [] } = useDisseminationStatus();
	return data.map(({ url, label }) => ({ value: url, label }));
};
