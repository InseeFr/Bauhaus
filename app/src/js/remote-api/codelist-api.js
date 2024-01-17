import { API } from 'bauhaus-utilities';

const api = {
	getCode: (notation, code) => [`${notation}/code/${code}`],
};

export default API.buildApi('codeList', api);
