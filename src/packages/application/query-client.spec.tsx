import { QueryClientProvider, useQuery } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { sdkRejection } from "../tests/sdk-rejection.testing";
import { createQueryClient } from "./query-client";

/** Lit une fiche comme un écran, avec le client de l'application (sans délai entre deux tentatives). */
const renderRead = (queryFn: () => Promise<unknown>) => {
  const queryClient = createQueryClient();
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return renderHook(() => useQuery({ queryKey: ["item"], queryFn, retryDelay: 0 }), { wrapper });
};

describe("createQueryClient", () => {
  it("does not retry a read which answered 404: the item does not exist", async () => {
    const queryFn = vi.fn().mockRejectedValue(sdkRejection.emptyBody(404));

    const { result } = renderRead(queryFn);

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(queryFn).toHaveBeenCalledTimes(1);
  });

  it("still retries a read which failed on the server", async () => {
    const queryFn = vi
      .fn()
      .mockRejectedValueOnce(sdkRejection.emptyBody(500))
      .mockResolvedValue("item");

    const { result } = renderRead(queryFn);

    await waitFor(() => expect(result.current.data).toBe("item"));
    expect(queryFn).toHaveBeenCalledTimes(2);
  });

  describe("freshness", () => {
    afterEach(() => {
      vi.useRealTimers();
    });

    const readTwice = async (elapsedMs: number) => {
      vi.useFakeTimers({ toFake: ["Date"] });
      const queryClient = createQueryClient();
      const queryFn = vi.fn().mockResolvedValue("item");

      await queryClient.fetchQuery({ queryKey: ["item"], queryFn });
      vi.setSystemTime(Date.now() + elapsedMs);
      await queryClient.fetchQuery({ queryKey: ["item"], queryFn });

      return queryFn;
    };

    it("serves a read made less than a minute ago from the cache", async () => {
      const queryFn = await readTwice(59_000);

      expect(queryFn).toHaveBeenCalledTimes(1);
    });

    it("reads again from the server once a minute has passed", async () => {
      const queryFn = await readTwice(61_000);

      expect(queryFn).toHaveBeenCalledTimes(2);
    });
  });
});
