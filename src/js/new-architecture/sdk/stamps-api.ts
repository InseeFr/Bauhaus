import { buildApi } from './build-api';

//getStamps ou getStampList
export const api = {
	getStamps: () => [''],
} as const;

export const StampsApi = buildApi('stamps', api);
