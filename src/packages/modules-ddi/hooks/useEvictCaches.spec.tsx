import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { DDIApi } from "@sdk/index";

import { useEvictCaches } from "./useEvictCaches";

vi.mock("../../sdk", () => ({
  DDIApi: {
    evictCaches: vi.fn(),
  },
}));

describe("useEvictCaches", () => {
  let queryClient: QueryClient;

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    });
    vi.clearAllMocks();
  });

  it("vide les caches côté back", async () => {
    vi.mocked(DDIApi.evictCaches).mockResolvedValue(undefined);

    const { result } = renderHook(() => useEvictCaches(), { wrapper });

    await result.current.mutateAsync();

    expect(DDIApi.evictCaches).toHaveBeenCalledTimes(1);
  });

  it("invalide toutes les requêtes en cache côté front une fois le back vidé", async () => {
    vi.mocked(DDIApi.evictCaches).mockResolvedValue(undefined);
    using invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useEvictCaches(), { wrapper });

    await result.current.mutateAsync();

    expect(invalidateSpy).toHaveBeenCalledWith();
  });

  it("n'invalide rien si le back refuse", async () => {
    vi.mocked(DDIApi.evictCaches).mockRejectedValue({ status: 403 });
    using invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useEvictCaches(), { wrapper });

    await expect(result.current.mutateAsync()).rejects.toEqual({ status: 403 });

    expect(invalidateSpy).not.toHaveBeenCalled();
  });
});
