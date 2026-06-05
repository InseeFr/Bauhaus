import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAllCodesLists } from "./useAllCodesLists";
import { DDIApi } from "../../sdk";

vi.mock("../../sdk", () => ({
  DDIApi: {
    getPhysicalInstanceParents: vi.fn(),
    getGroupCodesLists: vi.fn(),
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
  const mockParents = {
    studyUnit: { agency: "fr.insee", id: "su-1" },
    group: { agency: "fr.insee", id: "group-1" },
    stamps: [],
  };

  // L'endpoint group renvoie { agency, id, label, versionDate } (pas agencyId).
  const mockGroupCodesLists = [
    {
      agency: "fr.insee",
      id: "group-1cl",
      label: "Liste groupe 1",
      versionDate: "0001-01-01T00:00:00.000Z",
    },
    {
      agency: "fr.insee",
      id: "common-1",
      label: "Liste commune",
      versionDate: "0001-01-01T00:00:00.000Z",
    },
  ];

  const mockMutualizedCodesLists = [
    { agencyId: "fr.insee", id: "mutualized-1", label: "Liste mutualisée 1" },
    { agencyId: "fr.insee", id: "common-1", label: "Liste commune mutualisée" },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(DDIApi.getPhysicalInstanceParents).mockResolvedValue(mockParents);
  });

  it("should combine group and mutualized codes lists with origin marker", async () => {
    vi.mocked(DDIApi.getGroupCodesLists).mockResolvedValue(mockGroupCodesLists);
    vi.mocked(DDIApi.getMutualizedCodesLists).mockResolvedValue(mockMutualizedCodesLists);

    const { result } = renderHook(() => useAllCodesLists("fr.insee", "pi-123"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toHaveLength(3);
    // Listes du group : éditables.
    expect(result.current.data).toContainEqual({
      agencyId: "fr.insee",
      id: "group-1cl",
      label: "Liste groupe 1",
      mutualized: false,
    });
    // Listes mutualisées : read-only.
    expect(result.current.data).toContainEqual({
      agencyId: "fr.insee",
      id: "mutualized-1",
      label: "Liste mutualisée 1",
      mutualized: true,
    });
  });

  it("should fetch group codes lists from the physical instance parent group", async () => {
    vi.mocked(DDIApi.getGroupCodesLists).mockResolvedValue(mockGroupCodesLists);
    vi.mocked(DDIApi.getMutualizedCodesLists).mockResolvedValue(mockMutualizedCodesLists);

    renderHook(() => useAllCodesLists("fr.insee", "pi-123"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(DDIApi.getGroupCodesLists).toHaveBeenCalledWith("fr.insee", "group-1");
    });
  });

  it("should deduplicate by agencyId-id (mutualized takes precedence)", async () => {
    vi.mocked(DDIApi.getGroupCodesLists).mockResolvedValue(mockGroupCodesLists);
    vi.mocked(DDIApi.getMutualizedCodesLists).mockResolvedValue(mockMutualizedCodesLists);

    const { result } = renderHook(() => useAllCodesLists("fr.insee", "pi-123"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const commonItems = result.current.data.filter((item) => item.id === "common-1");
    expect(commonItems).toHaveLength(1);
    expect(commonItems[0].label).toBe("Liste commune mutualisée");
    expect(commonItems[0].mutualized).toBe(true);
  });

  it("should return empty array when both queries fail", async () => {
    vi.mocked(DDIApi.getGroupCodesLists).mockRejectedValue(new Error("Error 1"));
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
    vi.mocked(DDIApi.getGroupCodesLists).mockImplementation(() => new Promise(() => {}));
    vi.mocked(DDIApi.getMutualizedCodesLists).mockResolvedValue(mockMutualizedCodesLists);

    const { result } = renderHook(() => useAllCodesLists("fr.insee", "pi-123"), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
  });
});
