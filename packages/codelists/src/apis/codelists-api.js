import { API } from 'bauhaus-utilities';

const api = {
	getCodelists: () => [''],
	getCodelist: (id) => [`${id}`],
	getDetailedCodelist: (id) => [`detailed/${id}`],
	getCodelistsForSearch: () => ['search'],
	getCodelistCode: (id, code) => [`${id}/code/${code}`],
	postCodelist: (codelist) => [
		'',
		{
			headers: {
				Accept: 'text/plain',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(codelist),
		},
		() => {},
	],
	putCodelist: (codelist) => [
		`${codelist.id}`,
		{
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(codelist),
		},
		() => {},
	],
};

export default API.buildApi('codeList', api);
