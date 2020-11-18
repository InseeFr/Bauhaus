import { buildApi } from './build-api';

export const api = {
	getCodesLists: () => [''],
	getCodesList: notation => [`${notation}`],
};

export default buildApi('codeList', api);
