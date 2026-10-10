import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { expect } from "vitest";

const wrapperFor =
  (queryClient: QueryClient) =>
  ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

/** Wrapper React Query sans retry, neuf à chaque appel (pas de cache partagé entre tests). */
export const createQueryWrapper = () =>
  wrapperFor(new QueryClient({ defaultOptions: { queries: { retry: false } } }));

/** `renderHook` enveloppé dans un QueryClient neuf. */
export const renderQueryHook = <T,>(hook: () => T) =>
  renderHook(hook, { wrapper: createQueryWrapper() });

/** Rend le hook et attend que `flag` (isSuccess, isError…) passe à `true`. */
export const renderQueryHookUntil = async <T extends object>(hook: () => T, flag: keyof T) => {
  const rendered = renderQueryHook(hook);
  await waitFor(() => {
    expect(rendered.result.current[flag]).toBe(true);
  });
  return rendered;
};

/** Rend le hook, vérifie qu'il démarre en chargement, puis attend le succès de la requête. */
export const renderQueryHookFromLoadingToSuccess = async <
  T extends { isLoading: boolean; isSuccess: boolean },
>(
  hook: () => T,
) => {
  const rendered = renderQueryHook(hook);
  expect(rendered.result.current.isLoading).toBe(true);
  await waitFor(() => {
    expect(rendered.result.current.isSuccess).toBe(true);
  });
  return rendered;
};

/** Vérifie qu'une requête désactivée n'est pas partie vers le back. */
export const expectIdleQuery = (current: { fetchStatus: string }, apiCall: unknown) => {
  expect(current.fetchStatus).toBe("idle");
  expect(apiCall).not.toHaveBeenCalled();
};

/**
 * `renderHook` d'un hook de mutation, dans un QueryClient neuf sans retry ; le client est
 * exposé pour espionner les invalidations ou amorcer le cache.
 */
export const renderMutationHook = <T,>(hook: () => T) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return { ...renderHook(hook, { wrapper: wrapperFor(queryClient) }), queryClient };
};

/** Une mutation qui n'a pas encore été déclenchée. */
export const expectIdleMutation = (current: {
  isPending: boolean;
  isError: boolean;
  isSuccess: boolean;
}) => {
  expect(current.isPending).toBe(false);
  expect(current.isError).toBe(false);
  expect(current.isSuccess).toBe(false);
};
