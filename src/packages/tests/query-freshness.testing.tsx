import { QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { vi } from "vitest";

import { createQueryClient } from "../application/query-client";

/** Au-delà de la durée de fraîcheur par défaut de l'application. */
const PAST_DEFAULT_STALE_TIME_MS = 10 * 60_000;

type QueryResult = { isSuccess: boolean; isFetching: boolean };

/**
 * Monte `useHook` avec le client de l'application, le démonte, puis le remonte bien après la durée
 * de fraîcheur par défaut — comme un écran rouvert plus tard. L'appelant compte ensuite les
 * lectures faites au serveur.
 */
export const mountAgainLongAfter = async (useHook: () => QueryResult) => {
  vi.useFakeTimers({ toFake: ["Date"] });
  try {
    const queryClient = createQueryClient();
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const first = renderHook(useHook, { wrapper });
    await waitFor(() => expect(first.result.current.isSuccess).toBe(true));
    first.unmount();

    vi.setSystemTime(Date.now() + PAST_DEFAULT_STALE_TIME_MS);
    const second = renderHook(useHook, { wrapper });
    await waitFor(() => expect(second.result.current.isFetching).toBe(false));
  } finally {
    vi.useRealTimers();
  }
};
