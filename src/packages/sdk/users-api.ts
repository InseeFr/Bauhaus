import { buildApi } from './build-api';

const apiConfig = {
	getStamp: () => ['stamp'],
};
export const UsersApi = buildApi('users', apiConfig) as any;
