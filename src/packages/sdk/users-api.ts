import { buildApi } from './build-api';

export type MODULE = 'FAMILY';
export type PRIVILEGE = 'READ' | 'CREATE' | 'UPDATE' | 'PUBLISH' | 'DELETE';
export type STRATEGY = 'ALL' | 'STAMP' | 'NONE';

const apiConfig = {
	getStamp: () => ['stamp'],
	getInfo: () => ['info'],
};
export const UsersApi = buildApi('users', apiConfig) as {
	getStamp: () => Promise<string>;
	getInfo: () => Promise<
		{
			application: MODULE;
			privileges: { privilege: PRIVILEGE; strategy: STRATEGY }[];
		}[]
	>;
};
