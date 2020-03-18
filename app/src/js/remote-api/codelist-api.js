import { API } from 'bauhaus-utilities';

const api = {
	getCodesList: notation => [`${notation}`],
	getCode: (notation, code) => [`${notation}/code/${code}`],
};

export default API.buildApi('codeList', api);
