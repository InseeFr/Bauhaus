import { useQueries, useQuery } from '@tanstack/react-query';
import { fetchCodeList } from '../../sdk';

const defaultCodesList = { codes: [] };
export const useCodesList = (notation: string) => {
	const { data } = useQuery({
		queryKey: ['codelist', notation],
		queryFn: () => fetchCodeList(notation),
	});
	return data ?? defaultCodesList;
};

export const useCodesLists = (notations: string[]) => {
	return useQueries({
		queries: notations.map((notation) => ({
			queryKey: ['codelist', notation],
			queryFn: () => fetchCodeList(notation),
		})),
	});
};
