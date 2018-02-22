import { baseHost } from 'config';
import buildApi from './build-api';

const api = {
	getProperties: () => ['properties'],
	getAuthType: () => [
		`auth/type`,
		{
			headers: {
				Accept: 'text/plain',
			},
		},
		res => res,
	],
	postAuth: mdp => [
		`auth`,
		{
			headers: {
				Accept: 'text/plain',
				'Content-Type': 'text/plain',
			},
			body: mdp,
		},
		res => res.text(),
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

//TODO wrap api in a proxy for developement to catch error when accessing
//an unknown function (the kind of check performed when we import something
//that has not been exported)
export default buildApi(baseHost, api);
