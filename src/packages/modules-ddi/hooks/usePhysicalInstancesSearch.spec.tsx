import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import { DDIApi } from "../../sdk";
import { usePhysicalInstancesSearch } from "./usePhysicalInstancesSearch";

vi.mock("../../sdk", () => ({
  DDIApi: {
    getPhysicalInstancesForAdvancedSearch: vi.fn(),
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("usePhysicalInstancesSearch", () => {
  it("should return loading state initially", () => {
    vi.mocked(DDIApi.getPhysicalInstancesForAdvancedSearch).mockResolvedValue([]);

    const { result } = renderHook(() => usePhysicalInstancesSearch(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
  });

  it("should return the joined search rows when the API call succeeds", async () => {
    const mockData = [
      {
        agency: "fr.insee",
        id: "pi-1",
        label: "Recensement",
        versionDate: null,
        studyUnitAgency: "fr.insee",
        studyUnitId: "su-1",
        studyUnitLabel: "Étude A",
        groupAgency: "fr.insee",
        groupId: "g1",
        groupLabel: "Groupe X",
      },
    ];
    vi.mocked(DDIApi.getPhysicalInstancesForAdvancedSearch).mockResolvedValue(mockData);

    const { result } = renderHook(() => usePhysicalInstancesSearch(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockData);
  });

  it("should surface API errors", async () => {
    const error = new Error("API Error");
    vi.mocked(DDIApi.getPhysicalInstancesForAdvancedSearch).mockRejectedValue(error);

    const { result } = renderHook(() => usePhysicalInstancesSearch(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(error);
  });
});
