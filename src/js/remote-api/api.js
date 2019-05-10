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
