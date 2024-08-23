import { useQueries, useQuery } from '@tanstack/react-query';
import { CodeListApi, fetchCodeList } from '../../sdk';
import { Code } from '../../model/CodesList';
import { sortArray } from '../array-utils';

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

export const useAllCodes = (notation: string, enabled: boolean) => {
	return useQuery({
		enabled: !!notation && enabled,
		queryKey: ['codelist', notation, 'codes'],
		queryFn: () =>
			CodeListApi.getCodesListCodes(notation, 1, 0).then(
				(codes: { items: Code[] }) => {
					return sortArray('labelLg1')(codes?.items || []);
				}
			),
	});
};
