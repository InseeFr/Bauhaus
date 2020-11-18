import { CodesList, ArrayUtils } from 'bauhaus-utilities';
const sortByLabel = ArrayUtils.sortArray('label');

export const getCodeList = () =>
	CodesList.getCodesLists().then((response) => sortByLabel(response));

export const getFormattedCodeList = () => {
	return getCodeList().then((response) => {
		return response?.map(({ uri, label, notation }) => {
			return {
				id: uri,
				label,
				notation,
			};
		});
	});
};
