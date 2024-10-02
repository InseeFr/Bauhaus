import { createContext, useContext } from 'react';

const LoadingContext = createContext({ loading: '', setLoading: () => {} });

export const LoadingProvider = LoadingContext.Provider;
export const useLoading = () => useContext(LoadingContext);
