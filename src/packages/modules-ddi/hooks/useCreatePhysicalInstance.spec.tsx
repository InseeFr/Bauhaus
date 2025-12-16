import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useCreatePhysicalInstance } from "./useCreatePhysicalInstance";
import { DDIApi } from "../../sdk";
import type { ReactNode } from "react";

vi.mock("../../sdk", () => ({
  DDIApi: {
    postPhysicalInstance: vi.fn(),
  },
}));

describe("useCreatePhysicalInstance", () => {
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

  it("should call postPhysicalInstance API with correct parameters", async () => {
    const mockPost = vi.fn().mockResolvedValue({
      id: "new-id",
      agency: "fr.insee",
    });
    (DDIApi.postPhysicalInstance as any) = mockPost;

    const { result } = renderHook(() => useCreatePhysicalInstance(), {
      wrapper,
    });

    const testData = {
      physicalInstanceLabel: "Test Label",
      dataRelationshipName: "Test Name",
    };

    await result.current.mutateAsync(testData);

    expect(mockPost).toHaveBeenCalledWith({
      physicalInstanceLabel: "Test Label",
      dataRelationshipName: "Test Name",
    });
  });

  it("should invalidate physicalInstances query cache on successful mutation", async () => {
    const mockPost = vi.fn().mockResolvedValue({
      id: "new-id",
      agency: "fr.insee",
    });
    (DDIApi.postPhysicalInstance as any) = mockPost;

    const invalidateQueriesSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useCreatePhysicalInstance(), {
      wrapper,
    });

    const testData = {
      physicalInstanceLabel: "Test Label",
      dataRelationshipName: "Test Name",
    };

    await result.current.mutateAsync(testData);

    await waitFor(() => {
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({
        queryKey: ["physicalInstances"],
      });
    });
  });

  it("should handle API errors correctly", async () => {
    const mockError = new Error("Creation failed");
    const mockPost = vi.fn().mockRejectedValue(mockError);
    (DDIApi.postPhysicalInstance as any) = mockPost;

    const { result } = renderHook(() => useCreatePhysicalInstance(), {
      wrapper,
    });

    const testData = {
      physicalInstanceLabel: "Test Label",
      dataRelationshipName: "Test Name",
    };

    await expect(result.current.mutateAsync(testData)).rejects.toThrow("Creation failed");
  });

  it("should return mutation status correctly", async () => {
    const mockPost = vi.fn().mockResolvedValue({
      id: "new-id",
      agency: "fr.insee",
    });
    (DDIApi.postPhysicalInstance as any) = mockPost;

    const { result } = renderHook(() => useCreatePhysicalInstance(), {
      wrapper,
    });

    expect(result.current.isPending).toBe(false);
    expect(result.current.isError).toBe(false);
    expect(result.current.isSuccess).toBe(false);

    const testData = {
      physicalInstanceLabel: "Test Label",
      dataRelationshipName: "Test Name",
    };

    result.current.mutate(testData);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  });

  it("should handle empty label and name", async () => {
    const mockPost = vi.fn().mockResolvedValue({
      id: "new-id",
      agency: "fr.insee",
    });
    (DDIApi.postPhysicalInstance as any) = mockPost;

    const { result } = renderHook(() => useCreatePhysicalInstance(), {
      wrapper,
    });

    const testData = {
      physicalInstanceLabel: "",
      dataRelationshipName: "",
    };

    await result.current.mutateAsync(testData);

    expect(mockPost).toHaveBeenCalledWith({
      physicalInstanceLabel: "",
      dataRelationshipName: "",
    });
  });

  it("should not invalidate cache if mutation fails", async () => {
    const mockError = new Error("API Error");
    const mockPost = vi.fn().mockRejectedValue(mockError);
    (DDIApi.postPhysicalInstance as any) = mockPost;

    const invalidateQueriesSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useCreatePhysicalInstance(), {
      wrapper,
    });

    const testData = {
      physicalInstanceLabel: "Test Label",
      dataRelationshipName: "Test Name",
    };

    try {
      await result.current.mutateAsync(testData);
    } catch {
      // Expected to fail
    }

    expect(invalidateQueriesSpy).not.toHaveBeenCalled();
  });
});
