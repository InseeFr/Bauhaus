import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useGroupMissingValuesRepresentations } from "./useGroupMissingValuesRepresentations";
import { DDIApi } from "../../sdk";

vi.mock("../../sdk", () => ({
  DDIApi: {
    getGroupMissingValuesRepresentations: vi.fn(),
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

describe("useGroupMissingValuesRepresentations", () => {
  const mockResponse = [
    {
      id: "mmvr-1",
      agency: "fr.insee",
      version: "1",
      label: "Valeurs sentinelles NSP/REF",
      codeListId: "cl-sentinelles",
      codeValues: ["NSP", "REF"],
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch the reusable missing values representations of the group", async () => {
    vi.mocked(DDIApi.getGroupMissingValuesRepresentations).mockResolvedValue(mockResponse);

    const { result } = renderHook(
      () => useGroupMissingValuesRepresentations("fr.insee", "group-1"),
      {
        wrapper: createWrapper(),
      },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockResponse);
    expect(DDIApi.getGroupMissingValuesRepresentations).toHaveBeenCalledWith("fr.insee", "group-1");
  });

  it("should not fetch when agencyId is empty", () => {
    const { result } = renderHook(() => useGroupMissingValuesRepresentations("", "group-1"), {
      wrapper: createWrapper(),
    });

    expect(result.current.fetchStatus).toBe("idle");
    expect(DDIApi.getGroupMissingValuesRepresentations).not.toHaveBeenCalled();
  });

  it("should not fetch when groupId is empty", () => {
    const { result } = renderHook(() => useGroupMissingValuesRepresentations("fr.insee", ""), {
      wrapper: createWrapper(),
    });

    expect(result.current.fetchStatus).toBe("idle");
    expect(DDIApi.getGroupMissingValuesRepresentations).not.toHaveBeenCalled();
  });
});
