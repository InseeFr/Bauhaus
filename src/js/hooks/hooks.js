import { useQueries, useQuery } from '@tanstack/react-query';
import { CodeListApi } from '../new-architecture/sdk';

const fetchCodeList = (notation) => {
	return Promise.all([
		CodeListApi.getCodesList(notation),
		CodeListApi.getCodesListCodes(notation, 1, 0),
	]).then(([codesList, codes]) => ({
		codes: codes.items ?? [],
		...codesList,
	}));
};

const defaultCodesList = { codes: [] };
export const useCodesList = (notation) => {
	const { data } = useQuery({
		queryKey: ['codelist', notation],
		queryFn: () => fetchCodeList(notation),
	});
	return data ?? defaultCodesList;
};

export const useCodesLists = (notations) => {
	return useQueries({
		queries: notations.map((notation) => ({
			queryKey: ['codelist', notation],
			queryFn: () => fetchCodeList(notation),
		})),
	});
};

export const withCodesLists = (notations) => {
	return (Component) => {
		return (props) => {
			const codesLists = useCodesLists(notations);
			const codesListsProps = notations.reduce((acc, notation, index) => {
				return {
					...acc,
					[notation]: codesLists[index].data,
				};
			}, {});
			return <Component {...props} {...codesListsProps} />;
		};
	};
};
