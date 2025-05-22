import { buildApi } from './build-api';

const apiConfig = {
	getStamp: () => ['stamp'],
	getInfo: () => ['info'],
};

export const UsersApi = buildApi('users', apiConfig) as any;
