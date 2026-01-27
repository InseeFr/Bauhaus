import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAllCodesLists } from "./useAllCodesLists";
import { DDIApi } from "../../sdk";

vi.mock("../../sdk", () => ({
  DDIApi: {
    getPhysicalCodesLists: vi.fn(),
    getMutualizedCodesLists: vi.fn(),
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
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useAllCodesLists", () => {
  const mockPhysicalCodesLists = [
    { agencyId: "fr.insee", id: "physical-1", label: "Liste physique 1" },
    { agencyId: "fr.insee", id: "common-1", label: "Liste commune" },
  ];

  const mockMutualizedCodesLists = [
    { agencyId: "fr.insee", id: "mutualized-1", label: "Liste mutualisée 1" },
    { agencyId: "fr.insee", id: "common-1", label: "Liste commune mutualisée" },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should combine physical and mutualized codes lists", async () => {
    vi.mocked(DDIApi.getPhysicalCodesLists).mockResolvedValue(mockPhysicalCodesLists);
    vi.mocked(DDIApi.getMutualizedCodesLists).mockResolvedValue(mockMutualizedCodesLists);

    const { result } = renderHook(() => useAllCodesLists("fr.insee", "pi-123"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toHaveLength(3);
    expect(result.current.data).toContainEqual({
      agencyId: "fr.insee",
      id: "physical-1",
      label: "Liste physique 1",
    });
    expect(result.current.data).toContainEqual({
      agencyId: "fr.insee",
      id: "mutualized-1",
      label: "Liste mutualisée 1",
    });
  });

  it("should deduplicate by agencyId-id (physical takes precedence)", async () => {
    vi.mocked(DDIApi.getPhysicalCodesLists).mockResolvedValue(mockPhysicalCodesLists);
    vi.mocked(DDIApi.getMutualizedCodesLists).mockResolvedValue(mockMutualizedCodesLists);

    const { result } = renderHook(() => useAllCodesLists("fr.insee", "pi-123"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const commonItems = result.current.data.filter((item) => item.id === "common-1");
    expect(commonItems).toHaveLength(1);
    expect(commonItems[0].label).toBe("Liste commune");
  });

  it("should return empty array when both queries fail", async () => {
    vi.mocked(DDIApi.getPhysicalCodesLists).mockRejectedValue(new Error("Error 1"));
    vi.mocked(DDIApi.getMutualizedCodesLists).mockRejectedValue(new Error("Error 2"));

    const { result } = renderHook(() => useAllCodesLists("fr.insee", "pi-123"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.error).toBeTruthy();
    });

    expect(result.current.data).toEqual([]);
  });

  it("should show loading when either query is loading", async () => {
    vi.mocked(DDIApi.getPhysicalCodesLists).mockImplementation(() => new Promise(() => {}));
    vi.mocked(DDIApi.getMutualizedCodesLists).mockResolvedValue(mockMutualizedCodesLists);

    const { result } = renderHook(() => useAllCodesLists("fr.insee", "pi-123"), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
  });
});
