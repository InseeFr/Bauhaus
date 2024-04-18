import { API } from 'bauhaus-utilities';

const api = {
	getCodelists: () => [''],
	getCodelist: (id) => [`${id}`],
	publishCodelist: (id) => [
		`validate/${id}`,
		{ method: 'PUT' },
		(res) => res.text(),
	],
	getDetailedCodelist: (id) => [`detailed/${id}`],
	postCodesDetailedCodelist: (id, code) => [
		`detailed/${id}/codes`,
		{
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(code),
		},
		(res) => res.text(),
	],
	putCodesDetailedCodelist: (id, code) => [
		`detailed/${id}/codes/${code.code}`,
		{
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(code),
		},
		(res) => res.text(),
	],
	deleteCodesDetailedCodelist: (id, code) => [
		`detailed/${id}/codes/${code.code}`,
		{},
		(res) => res.text(),
	],
	getCodesDetailedCodelist: (id, page) => [`detailed/${id}/codes?page=${page}`],
	getCodesByLabel: (id, value) => [
		`detailed/${id}/codes?page=1&search=labelLg1:${value}`,
	],
	getCodesByCode: (id, value) => [
		`detailed/${id}/codes?page=1&search=code:${value}`,
	],
	getPartialsByParent: (parentCode) => [`partials/parent/${parentCode}`],
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
	publishPartialCodelist: (id) => [
		`partial/validate/${id}`,
		{ method: 'PUT' },
		(res) => res.text(),
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
