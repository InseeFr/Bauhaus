import { waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { DDIApi } from "@sdk/index";

import { renderQueryHook } from "./queryClient.testing";
import { useAllCodeLists } from "./useAllCodeLists";

vi.mock("../../sdk", () => ({
  DDIApi: {
    getPhysicalInstanceParents: vi.fn(),
    getGroupCodeLists: vi.fn(),
    getMutualizedCodeLists: vi.fn(),
  },
}));

describe("useAllCodeLists", () => {
  const mockParents = {
    studyUnit: { agency: "fr.insee", id: "su-1" },
    group: { agency: "fr.insee", id: "group-1", label: "Base permanente des équipements" },
    stamps: [],
  };

  // L'endpoint group renvoie { agency, id, label, versionDate } (pas agencyId).
  const mockGroupCodeLists = [
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

  const mockMutualizedCodeLists = [
    { agencyId: "fr.insee", id: "mutualized-1", label: "Liste mutualisée 1" },
    { agencyId: "fr.insee", id: "common-1", label: "Liste commune mutualisée" },
  ];

  const mutualizedItem = {
    agencyId: "fr.insee",
    id: "mutualized-1",
    label: "Liste mutualisée 1",
    mutualized: true,
  };

  const renderAllCodeLists = () => renderQueryHook(() => useAllCodeLists("fr.insee", "pi-123"));

  /** Les deux sources répondent ; rend le hook et attend la fin du chargement. */
  const renderLoadedAllCodeLists = async () => {
    vi.mocked(DDIApi.getGroupCodeLists).mockResolvedValue(mockGroupCodeLists);
    vi.mocked(DDIApi.getMutualizedCodeLists).mockResolvedValue(mockMutualizedCodeLists);
    return waitUntilLoaded();
  };

  const waitUntilLoaded = async () => {
    const { result } = renderAllCodeLists();
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    return result;
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(DDIApi.getPhysicalInstanceParents).mockResolvedValue(mockParents);
  });

  it("should combine group and mutualized codes lists with origin marker", async () => {
    const result = await renderLoadedAllCodeLists();

    expect(result.current.data).toHaveLength(3);
    // Listes du group : éditables (la versionDate est désormais propagée).
    expect(result.current.data).toContainEqual({
      agencyId: "fr.insee",
      id: "group-1cl",
      label: "Liste groupe 1",
      versionDate: "0001-01-01T00:00:00.000Z",
      mutualized: false,
    });
    // Listes mutualisées : read-only.
    expect(result.current.data).toContainEqual(mutualizedItem);
  });

  it("should expose the parent group label", async () => {
    const result = await renderLoadedAllCodeLists();

    expect(result.current.groupLabel).toBe("Base permanente des équipements");
  });

  it("should fetch group codes lists from the physical instance parent group", async () => {
    vi.mocked(DDIApi.getGroupCodeLists).mockResolvedValue(mockGroupCodeLists);
    vi.mocked(DDIApi.getMutualizedCodeLists).mockResolvedValue(mockMutualizedCodeLists);

    renderAllCodeLists();

    await waitFor(() => {
      expect(DDIApi.getGroupCodeLists).toHaveBeenCalledWith("fr.insee", "group-1");
    });
  });

  it("should deduplicate by agencyId-id (mutualized takes precedence)", async () => {
    const result = await renderLoadedAllCodeLists();

    const commonItems = result.current.data.filter((item) => item.id === "common-1");
    expect(commonItems).toHaveLength(1);
    expect(commonItems[0].label).toBe("Liste commune mutualisée");
    expect(commonItems[0].mutualized).toBe(true);
  });

  it("should return empty array when both queries fail", async () => {
    vi.mocked(DDIApi.getGroupCodeLists).mockRejectedValue(new Error("Error 1"));
    vi.mocked(DDIApi.getMutualizedCodeLists).mockRejectedValue(new Error("Error 2"));

    const { result } = renderAllCodeLists();

    await waitFor(() => {
      expect(result.current.error).toBeTruthy();
    });

    expect(result.current.data).toEqual([]);
  });

  it("should expose mutualized codes lists when the group query fails", async () => {
    vi.mocked(DDIApi.getGroupCodeLists).mockRejectedValue(new Error("group boom"));
    vi.mocked(DDIApi.getMutualizedCodeLists).mockResolvedValue(mockMutualizedCodeLists);

    const result = await waitUntilLoaded();

    // L'échec de la liste du groupe ne doit pas masquer les listes mutualisées.
    expect(result.current.error).toBeFalsy();
    expect(result.current.data).toContainEqual(mutualizedItem);
  });

  it("should show loading when either query is loading", async () => {
    vi.mocked(DDIApi.getGroupCodeLists).mockImplementation(() => new Promise(() => {}));
    vi.mocked(DDIApi.getMutualizedCodeLists).mockResolvedValue(mockMutualizedCodeLists);

    const { result } = renderAllCodeLists();

    expect(result.current.isLoading).toBe(true);
  });
});
