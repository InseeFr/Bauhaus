import { CodesList, ArrayUtils } from 'js/utils';
const sortByLabel = ArrayUtils.sortArray('labelLg1');

export const getCodeList = () =>
	CodesList.getCodesLists().then((response) => sortByLabel(response));

export const getPartialCodeLists = () =>
	CodesList.getPartialCodesLists().then((response) => sortByLabel(response));

export const getFormattedCodeList = () => {
	return Promise.all([getCodeList(), getPartialCodeLists()]).then(
		([codelist, partialCodeList]) => {
			return [...codelist, ...partialCodeList]?.map(({ uri, labelLg1, id }) => {
				return {
					id: uri,
					label: labelLg1,
					notation: id,
				};
			});
		}
	);
};
