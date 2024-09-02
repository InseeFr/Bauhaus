import { buildApi } from './build-api';

const api = {
	getThemes: () => [''],
} as const;

export const ThemesApi = buildApi('themes', api) as any;
