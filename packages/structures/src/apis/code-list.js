import { CodesList, ArrayUtils } from 'bauhaus-utilities';
const sortByLabel = ArrayUtils.sortArray('labelLg1');

export const getCodeList = () =>
	CodesList.getCodesLists().then((response) => sortByLabel(response));

export const getFormattedCodeList = () => {
	return getCodeList().then((response) => {
		return response?.map(({ uri, labelLg1, id }) => {
			return {
				id: uri,
				label: labelLg1,
				notation: id,
			};
		});
	});
};
