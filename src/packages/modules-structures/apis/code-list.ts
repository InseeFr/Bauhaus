import { CodesList, CodesLists } from '../../model/CodesList';
import { CodeListApi } from '../../sdk';
import { sortArray } from '../../utils/array-utils';

const sortByLabel = sortArray('labelLg1');

export const getCodeList = () =>
	CodeListApi.getCodesLists().then((response: CodesList[]) =>
		sortByLabel(response),
	);

export const getPartialCodeLists = () =>
	CodeListApi.getPartialCodesLists().then((response: CodesList[]) =>
		sortByLabel(response),
	);

export const getFormattedCodeList = (): Promise<CodesLists> => {
	return Promise.all([getCodeList(), getPartialCodeLists()]).then(
		([codelist, partialCodeList]) => {
			return [...codelist, ...partialCodeList]?.map(({ uri, labelLg1, id }) => {
				return {
					id: uri,
					label: labelLg1,
					notation: id,
				};
			});
		},
	);
};
