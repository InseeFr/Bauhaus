import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { DDIApi } from "@sdk/index";

import { useCreatePhysicalInstance } from "./useCreatePhysicalInstance";

vi.mock("../../sdk", () => ({
  DDIApi: {
    postPhysicalInstance: vi.fn(),
  },
}));

vi.mock("../../application/app-context", () => ({
  useAppContext: () => ({
    properties: {
      defaultAgencyId: "fr.insee",
    },
  }),
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

  it("should resolve id and agency from the real backend response shape (TopLevelReference / $type)", async () => {
    const mockPost = vi.fn().mockResolvedValue({
      topLevelReferences: [
        {
          $type: "PhysicalInstance",
          URN: "urn:ddi:fr.insee:236b9453:1",
          Agency: "fr.insee",
          ID: "236b9453",
          Version: "1",
        },
      ],
      items: [{ $type: "PhysicalInstance", Agency: "fr.insee" }],
    });
    (DDIApi.postPhysicalInstance as any) = mockPost;

    const { result } = renderHook(() => useCreatePhysicalInstance(), {
      wrapper,
    });

    const created = await result.current.mutateAsync({
      physicalInstanceLabel: "manu",
      dataRelationshipLabel: "manu",
      logicalRecordLabel: "manu",
      groupId: "group-1",
      groupAgency: "fr.insee",
      studyUnitId: "su-1",
      studyUnitAgency: "fr.insee",
    });

    expect(created).toEqual({ id: "236b9453", agency: "fr.insee" });
  });

  it("should call postPhysicalInstance API with correct parameters", async () => {
    const mockPost = vi.fn().mockResolvedValue({
      topLevelReferences: [
        {
          Agency: "fr.insee",
          ID: "new-id",
          Version: "1",
          $type: "PhysicalInstance",
        },
      ],
      items: [{ $type: "PhysicalInstance", Agency: "fr.insee" }],
    });
    (DDIApi.postPhysicalInstance as any) = mockPost;

    const { result } = renderHook(() => useCreatePhysicalInstance(), {
      wrapper,
    });

    const testData = {
      physicalInstanceLabel: "Test Label",
      dataRelationshipLabel: "Test Label",
      logicalRecordLabel: "Test Label",
      groupId: "group-1",
      groupAgency: "fr.insee",
      studyUnitId: "su-1",
      studyUnitAgency: "fr.insee",
    };

    await result.current.mutateAsync(testData);

    expect(mockPost).toHaveBeenCalledWith(testData);
  });

  it("should invalidate physicalInstances query cache on successful mutation", async () => {
    const mockPost = vi.fn().mockResolvedValue({
      topLevelReferences: [
        {
          Agency: "fr.insee",
          ID: "new-id",
          Version: "1",
          $type: "PhysicalInstance",
        },
      ],
      items: [{ $type: "PhysicalInstance", Agency: "fr.insee" }],
    });
    (DDIApi.postPhysicalInstance as any) = mockPost;

    using invalidateQueriesSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useCreatePhysicalInstance(), {
      wrapper,
    });

    const testData = {
      physicalInstanceLabel: "Test Label",
      dataRelationshipLabel: "Test Label",
      logicalRecordLabel: "Test Label",
      groupId: "group-1",
      groupAgency: "fr.insee",
      studyUnitId: "su-1",
      studyUnitAgency: "fr.insee",
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
      dataRelationshipLabel: "Test Label",
      logicalRecordLabel: "Test Label",
      groupId: "group-1",
      groupAgency: "fr.insee",
      studyUnitId: "su-1",
      studyUnitAgency: "fr.insee",
    };

    await expect(result.current.mutateAsync(testData)).rejects.toThrow("Creation failed");
  });

  it("should return mutation status correctly", async () => {
    const mockPost = vi.fn().mockResolvedValue({
      topLevelReferences: [
        {
          Agency: "fr.insee",
          ID: "new-id",
          Version: "1",
          $type: "PhysicalInstance",
        },
      ],
      items: [{ $type: "PhysicalInstance", Agency: "fr.insee" }],
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
      dataRelationshipLabel: "Test Label",
      logicalRecordLabel: "Test Label",
      groupId: "group-1",
      groupAgency: "fr.insee",
      studyUnitId: "su-1",
      studyUnitAgency: "fr.insee",
    };

    result.current.mutate(testData);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  });

  it("should handle empty label and name", async () => {
    const mockPost = vi.fn().mockResolvedValue({
      topLevelReferences: [
        {
          Agency: "fr.insee",
          ID: "new-id",
          Version: "1",
          $type: "PhysicalInstance",
        },
      ],
      items: [{ $type: "PhysicalInstance", Agency: "fr.insee" }],
    });
    (DDIApi.postPhysicalInstance as any) = mockPost;

    const { result } = renderHook(() => useCreatePhysicalInstance(), {
      wrapper,
    });

    const testData = {
      physicalInstanceLabel: "",
      dataRelationshipLabel: "",
      logicalRecordLabel: "",
      groupId: "group-1",
      groupAgency: "fr.insee",
      studyUnitId: "su-1",
      studyUnitAgency: "fr.insee",
    };

    await result.current.mutateAsync(testData);

    expect(mockPost).toHaveBeenCalledWith(testData);
  });

  it("should not invalidate cache if mutation fails", async () => {
    const mockError = new Error("API Error");
    const mockPost = vi.fn().mockRejectedValue(mockError);
    (DDIApi.postPhysicalInstance as any) = mockPost;

    using invalidateQueriesSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useCreatePhysicalInstance(), {
      wrapper,
    });

    const testData = {
      physicalInstanceLabel: "Test Label",
      dataRelationshipLabel: "Test Label",
      logicalRecordLabel: "Test Label",
      groupId: "group-1",
      groupAgency: "fr.insee",
      studyUnitId: "su-1",
      studyUnitAgency: "fr.insee",
    };

    try {
      await result.current.mutateAsync(testData);
    } catch {
      // Expected to fail
    }

    expect(invalidateQueriesSpy).not.toHaveBeenCalled();
  });
});
