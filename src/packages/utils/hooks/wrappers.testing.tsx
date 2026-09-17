import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { PropsWithChildren } from "react";

import { AppContextProvider, AppProperties } from "../../application/app-context";

export const queryClientWrapper = ({ children }: PropsWithChildren) => (
  <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
    {children}
  </QueryClientProvider>
);

export const englishFrenchAppContextWrapper = ({ children }: PropsWithChildren) => (
  <AppContextProvider lg1="English" lg2="French" properties={{} as AppProperties}>
    {children}
  </AppContextProvider>
);
