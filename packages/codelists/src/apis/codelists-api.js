import { API } from 'bauhaus-utilities';

const api = {
	getCodelists: () => [''],
	getCodelist: (id) => [`${id}`],
	publishCodelist: id => [
		`validate/${id}`,
		{ method: 'PUT' },
		res => res.text(),
	],
	getDetailedCodelist: (id) => [`detailed/${id}`],
	getPartialsByParent: (parentCode) => [`partials/${parentCode}`],
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
		(res) => res.text(),
	],
	putCodelist: (codelist) => [
		`${codelist.id}`,
		{
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(codelist),
		},
		(res) => res.text(),
	],
	deleteCodelist: (id) => [id, {}, () => Promise.resolve()],
	getCodelistsPartial: () => ['partial'],
	getCodelistPartial: (id) => [`partial/${id}`],
	publishPartialCodelist: id => [
		`partial/validate/${id}`,
		{ method: 'PUT' },
		res => res.text(),
	],
	getCodelistsPartialForSearch: () => ['partial/search'],
	postCodelistPartial: (codelist) => [
		'partial',
		{
			headers: {
				Accept: 'text/plain',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(codelist),
		},
		() => {},
	],
	putCodelistPartial: (codelist) => [
		`partial/${codelist.id}`,
		{
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(codelist),
		},
		() => {},
	],
	deleteCodelistPartial: (id) => ['partial/' + id, {}, () => Promise.resolve()],
};

export default API.buildApi('codeList', api);
