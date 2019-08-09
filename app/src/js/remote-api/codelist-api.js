import buildApi from './build-api';

const api = {
	getCodesList: notation => [`${notation}`],
	getCode: (notation, code) => [`${notation}/code/${code}`],
};

export default buildApi('codeList', api);
