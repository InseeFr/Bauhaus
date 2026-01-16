import { useContext, createContext } from "react";

const SimsContext = createContext({});

export const SimsContextProvider = SimsContext.Provider;

export const useSimsContext = () => useContext(SimsContext);

export default SimsContext;
