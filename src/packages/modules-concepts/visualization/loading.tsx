import { createContext, useContext } from 'react';

export type LoadingType =
	| ''
	| 'loading'
	| 'validating'
	| 'deleting'
	| undefined;

const LoadingContext = createContext<{
	loading: LoadingType;
	setLoading: (value: LoadingType) => void;
}>({ loading: '', setLoading: () => {} });

export const LoadingProvider = LoadingContext.Provider;
export const useLoading = () => useContext(LoadingContext);
