import { buildApi } from '../../../new-architecture/sdk';

export const apiConfig = {
	getDisseminationStatus: () => [''],
};

export const api = buildApi('disseminationStatus', apiConfig);
