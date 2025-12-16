import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { PropsWithChildren } from "react";
import { vi } from "vitest";

import { OperationsApi } from "@sdk/operations-api";

import { Series } from "../../model/Series";
import { useSeries } from "./series";

vi.mock("@sdk/operations-api");

const queryClient = new QueryClient();

const wrapper = ({ children }: Readonly<PropsWithChildren<unknown>>) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe("useSeries", () => {
  it("fetches and returns series data", async () => {
    const seriesMock: Series[] = [
      { id: "1", label: "Series 1", iri: "iri", altLabel: "altLabel 1" },
    ];

    (OperationsApi.getSeriesList as any).mockResolvedValueOnce(seriesMock);

    const { result } = renderHook(() => useSeries(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(seriesMock);
    expect(OperationsApi.getSeriesList).toHaveBeenCalledTimes(1);
  });
});
