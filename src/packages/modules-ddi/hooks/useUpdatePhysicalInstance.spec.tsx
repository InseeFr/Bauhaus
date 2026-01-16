import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useUpdatePhysicalInstance } from "./useUpdatePhysicalInstance";
import { DDIApi } from "../../sdk";
import type { ReactNode } from "react";

vi.mock("../../sdk", () => ({
  DDIApi: {
    patchPhysicalInstance: vi.fn(),
  },
}));

describe("useUpdatePhysicalInstance", () => {
  let queryClient: QueryClient;

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
        mutations: {
          retry: false,
        },
      },
    });
    vi.clearAllMocks();
  });

  it("should call patchPhysicalInstance API with correct parameters", async () => {
    const mockPatch = vi.fn().mockResolvedValue({});
    (DDIApi.patchPhysicalInstance as any) = mockPatch;

    const { result } = renderHook(() => useUpdatePhysicalInstance(), {
      wrapper,
    });

    const testData = {
      id: "test-id",
      agencyId: "test-agency",
      data: {
        physicalInstanceLabel: "Test Label",
        dataRelationshipName: "Test Name",
      },
    };

    await result.current.mutateAsync(testData);

    expect(mockPatch).toHaveBeenCalledWith("test-agency", "test-id", {
      physicalInstanceLabel: "Test Label",
      dataRelationshipName: "Test Name",
    });
  });

  it("should not invalidate query cache to preserve local variables", async () => {
    const mockPatch = vi.fn().mockResolvedValue({});
    (DDIApi.patchPhysicalInstance as any) = mockPatch;

    const invalidateQueriesSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useUpdatePhysicalInstance(), {
      wrapper,
    });

    const testData = {
      id: "test-id-123",
      agencyId: "test-agency-456",
      data: {
        physicalInstanceLabel: "Test Label",
        dataRelationshipName: "Test Name",
      },
    };

    await result.current.mutateAsync(testData);

    // Le cache ne doit pas être invalidé pour préserver les variables locales non sauvegardées
    expect(invalidateQueriesSpy).not.toHaveBeenCalled();
  });

  it("should handle API errors correctly", async () => {
    const mockError = new Error("API Error");
    const mockPatch = vi.fn().mockRejectedValue(mockError);
    (DDIApi.patchPhysicalInstance as any) = mockPatch;

    const { result } = renderHook(() => useUpdatePhysicalInstance(), {
      wrapper,
    });

    const testData = {
      id: "test-id",
      agencyId: "test-agency",
      data: {
        physicalInstanceLabel: "Test Label",
        dataRelationshipName: "Test Name",
      },
    };

    await expect(result.current.mutateAsync(testData)).rejects.toThrow("API Error");
  });

  it("should return mutation status correctly", async () => {
    const mockPatch = vi.fn().mockResolvedValue({});
    (DDIApi.patchPhysicalInstance as any) = mockPatch;

    const { result } = renderHook(() => useUpdatePhysicalInstance(), {
      wrapper,
    });

    expect(result.current.isPending).toBe(false);
    expect(result.current.isError).toBe(false);
    expect(result.current.isSuccess).toBe(false);

    const testData = {
      id: "test-id",
      agencyId: "test-agency",
      data: {
        physicalInstanceLabel: "Test Label",
        dataRelationshipName: "Test Name",
      },
    };

    result.current.mutate(testData);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  });
});
