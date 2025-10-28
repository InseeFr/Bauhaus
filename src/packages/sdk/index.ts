import { buildApi } from './build-api';

export * from './codes-list-api';
export * from './concepts-api';
export * from './datasets-api';
export * from './distributions-api';
export * from './organisations-api';
export * from './stamps-api';
export * from './structure-api';
export * from './themes-api';
export * from './build-api';
export * from './ddi-api';

const api = {
	getStamps: () => ['stamps'],
} as const;

export const V2Api = buildApi('v2', api);
