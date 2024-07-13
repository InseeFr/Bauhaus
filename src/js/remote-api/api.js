import { API } from '../utils';

const api = {
	getInit: () => [
		'init',
		{
			headers: {
				Accept: 'application/json',
			},
		},
		(res) => res,
	],
	getDocumentsList: () => ['documents'],
	getDocument: (id, type) => [`documents/${type}/${id}`],
	postDocument: (formData) => [
		`documents/document`,
		{
			headers: {},
			body: formData,
		},
		(res) => res.text(),
	],
	postLink: (formData) => [
		`documents/link`,
		{
			headers: {},
			body: formData,
		},
		(res) => res.text(),
	],
	putDocument: (document) => [
		`documents/document/${document.id}`,
		{
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(document),
		},
		() => Promise.resolve(document.id),
	],
	putLink: (document) => [
		`documents/link/${document.id}`,
		{
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(document),
		},
		() => Promise.resolve(document.id),
	],
	putDocumentFile: (document, formData) => [
		`documents/document/${document.id}/file`,
		{
			headers: {},
			body: formData,
		},
		() => Promise.resolve(document.id),
	],
	getStampList: () => ['stamps'],
};

export default API.buildApi('', api);
