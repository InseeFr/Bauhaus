import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useCodeListUsers, useFetchCodeListUsers } from "./useCodeListUsers";
import { DDIApi } from "../../sdk";

vi.mock("../../sdk", () => ({
  DDIApi: {
    getCodeListUsers: vi.fn(),
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

describe("useCodeListUsers", () => {
  const mockResponse = [
    {
      studyUnitAgencyId: "fr.insee",
      studyUnitId: "su-1",
      studyUnitLabel: "Recensement 2024",
      physicalInstanceAgencyId: "fr.insee",
      physicalInstanceId: "pi-1",
      physicalInstanceLabel: "Fichier détail",
      variableAgencyId: "fr.insee",
      variableId: "var-1",
      variableLabel: "Sexe",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch the code list users when agencyId and id are provided", async () => {
    vi.mocked(DDIApi.getCodeListUsers).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useCodeListUsers("fr.insee", "cl-1"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockResponse);
    expect(DDIApi.getCodeListUsers).toHaveBeenCalledWith("fr.insee", "cl-1");
  });

  it("should be disabled when agencyId or id is missing", () => {
    const { result } = renderHook(() => useCodeListUsers("", ""), {
      wrapper: createWrapper(),
    });

    expect(result.current.fetchStatus).toBe("idle");
    expect(DDIApi.getCodeListUsers).not.toHaveBeenCalled();
  });

  it("should be disabled when enabled is false even with agencyId and id", () => {
    const { result } = renderHook(() => useCodeListUsers("fr.insee", "cl-1", false), {
      wrapper: createWrapper(),
    });

    expect(result.current.fetchStatus).toBe("idle");
    expect(DDIApi.getCodeListUsers).not.toHaveBeenCalled();
  });

  describe("useFetchCodeListUsers", () => {
    it("serves subsequent calls for the same code list from the query cache", async () => {
      // La garde d'édition appelle ce fetcher à chaque modification : sans staleTime, chaque
      // édition paierait la marche relationnelle Colectica alors que la réponse vient d'arriver.
      vi.mocked(DDIApi.getCodeListUsers).mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useFetchCodeListUsers(), {
        wrapper: createWrapper(),
      });

      await result.current("fr.insee", "cl-1");
      const second = await result.current("fr.insee", "cl-1");

      expect(second).toEqual(mockResponse);
      expect(DDIApi.getCodeListUsers).toHaveBeenCalledTimes(1);
    });
  });
});
