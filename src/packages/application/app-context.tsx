import { createContext, PropsWithChildren, useContext, useState } from "react";

export type AppName =
  | "concepts"
  | "classifications"
  | "operations"
  | "structures"
  | "codelists"
  | "datasets"
  | "ddi";
export interface AppProperties {
  modules: AppName[];
  activeModules: string[];
  defaultContributor: string;
  maxLengthScopeNote: string;
  extraMandatoryFields: string;
}
interface AppContextTypes {
  lg1: string;
  lg2: string;
  version?: string;
  secondLang: {
    value: boolean;
    toggle: VoidFunction;
  };
  properties: AppProperties;
}

const AppContext = createContext<AppContextTypes | undefined>(undefined);

export const AppContextProvider = ({
  lg1,
  lg2,
  version,
  properties,
  children,
}: PropsWithChildren<Pick<AppContextTypes, "lg1" | "lg2" | "version" | "properties">>) => {
  const [secondLang, setSecondLang] = useState(false);

  return (
    <AppContext.Provider
      value={{
        lg1,
        lg2,
        version,
        properties,
        secondLang: {
          value: secondLang,
          toggle: () => setSecondLang((value) => !value),
        },
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
export const useAppContext = (): AppContextTypes => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("The context AppContextTypes is not available.");
  }
  return context;
};
