import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { GeographieApi } from "@sdk/geographie";

import { createQueryWrapper } from "./queryClientWrapper.testing";
import { useAllGeographies, usePrefetchGeographies } from "./useAllGeographies";

vi.mock("@sdk/geographie", () => ({ GeographieApi: { getAll: vi.fn() } }));

const territories = [{ id: "g-1", uri: "http://geo/g-1", labelLg1: "France" }];

describe("useAllGeographies", () => {
  it("reprend les territoires préchargés par la consultation, sans les relire", async () => {
    vi.mocked(GeographieApi.getAll).mockResolvedValue(territories);
    const { wrapper, queryClient } = createQueryWrapper();

    renderHook(() => usePrefetchGeographies(), { wrapper });
    await waitFor(() => expect(queryClient.getQueryData(["geographies"])).toEqual(territories));

    const { result } = renderHook(() => useAllGeographies(), { wrapper });

    expect(result.current.geographies).toEqual(territories);
    expect(GeographieApi.getAll).toHaveBeenCalledTimes(1);
  });
});
