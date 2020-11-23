import { API } from 'bauhaus-utilities';

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
	getRoleList: () => ['roles'],
	getAgentList: () => ['agents'],
	postAddRole: (agent) => {
		const { id, role } = agent;
		return [`users/private/add/role/${role}/user/${id}`, undefined, () => {}];
	},
	postDeleteRole: (agent) => {
		const { id, role } = agent;
		return [`users/private/delete/role/${role}/user/${id}`, undefined, () => {}];
	},
};

export default API.buildApi('', api);
