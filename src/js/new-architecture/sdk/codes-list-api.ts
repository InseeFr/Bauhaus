import { buildApi } from './build-api';

const api = {
	getCodesLists: () => [''],
	getPartialCodesLists: () => ['partial'],
	getCodesList: (notation: string) => [`${notation}`],
	getCodesListCodes: (notation: string, page: number, perPage: number) => [
		`${notation}/codes?page=${page}&per_page=${perPage}`,
	],
	getPartialCodesList: (notation: string) => [`partial/${notation}`],
};

export const CodeListApi = buildApi('codeList', api);
