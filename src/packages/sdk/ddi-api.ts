import { buildApi } from './build-api';

const api = {
	getPhysicalInstances: () => ['physical-instance'],
};

export const DDIApi = buildApi('ddi', api) as any;
