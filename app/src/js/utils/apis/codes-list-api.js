import { buildApi } from './build-api';

export const api = {
	getCodesLists: () => [''],
	getPartialCodesLists: () => ['partial'],
	getCodesList: (notation) => [`${notation}`],
	getCodesListCodes: (notation, page, perPage) => [
		`${notation}/codes?page=${page}&per_page=${perPage}`,
	],
	getPartialCodesList: (notation) => [`partial/${notation}`],
};

export default buildApi('codeList', api);
