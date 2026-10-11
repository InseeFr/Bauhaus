import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import type { ReactElement, ReactNode } from "react";

export const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

export const createQueryClientWrapper =
  (queryClient = createTestQueryClient()) =>
  ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

export const renderWithQueryClient = (ui: ReactElement, queryClient = createTestQueryClient()) => ({
  ...render(ui, { wrapper: createQueryClientWrapper(queryClient) }),
  queryClient,
});
