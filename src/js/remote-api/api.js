import { baseHost } from 'config/config';
import buildApi from './build-api';

const api = {
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

//TODO wrap api in a proxy for developement to catch error when accessing
//an unknown function (the kind of check performed when we import something
//that has not been exported)
export default buildApi(baseHost, api);
