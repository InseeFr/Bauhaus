import buildApi from './build-api';

const api = {
	getInit: () => [
		`init`,
		{
			headers: {
				Accept: 'application/json',
			},
		},
		res => res,
	],
	getDocumentsList: () => ['documents'],
	getDocument: id => [`documents/${id}`],
	postDocument: formData => [
		`documents/document`,
		{
			headers: {
				'Content-Type': 'multipart/form-data',
			},
			body: formData,
		},
		res => res.text(),
	],
	postLink: formData => [
		`documents/link`,
		{
			headers: {},
			body: formData,
		},
		res => res.text(),
	],
	putDocument: document => [
		`documents/document/${document.id}`,
		{
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(document),
		},
		res => Promise.resolve(document.id),
	],
	getDissStatusList: () => ['disseminationStatus'],
	getStampList: () => ['stamps'],
	getRoleList: () => ['roles'],
	getAgentList: () => ['agents'],
	postAddRole: data => [
		`private/role/add`,
		{
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		},
		() => {},
	],
	postDeleteRole: data => [
		`private/role/delete`,
		{
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		},
		() => {},
	],
};

export default buildApi('', api);
