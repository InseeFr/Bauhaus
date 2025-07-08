import { makeSafeUseContext } from '@utils/hooks/makeSafeUseContext';
import { createContext } from 'react';

const SimsContext = createContext({});

export const SimsContextProvider = SimsContext.Provider;

export const useSimsContext = makeSafeUseContext(SimsContext, 'SimsContext');

export default SimsContext;
