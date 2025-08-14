export const StorageKeys = {
	HELP_VIEW: 'HELP_VIEW',
	HELP_COLLAPSED: 'HELP_COLLAPSED',
} as const;

export type StorageKeysType = (typeof StorageKeys)[keyof typeof StorageKeys];
export const getItem = (key: StorageKeysType) => localStorage.getItem(key);
export const setItem = (key: StorageKeysType, value: string) =>
	localStorage.setItem(key, value);
