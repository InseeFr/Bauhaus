import { waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { DDIApi } from "@sdk/index";

import { physicalInstanceFormData } from "./physicalInstanceFormData.testing";
import { expectIdleMutation, renderMutationHook } from "./queryClient.testing";
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
  const stubPost = (mockPost: ReturnType<typeof vi.fn>) => {
    (DDIApi.postPhysicalInstance as any) = mockPost;
    return mockPost;
  };

  const mockPostResolving = (
    topLevelReference: Record<string, string> = {
      Agency: "fr.insee",
      ID: "new-id",
      Version: "1",
      $type: "PhysicalInstance",
    },
  ) =>
    stubPost(
      vi.fn().mockResolvedValue({
        topLevelReferences: [topLevelReference],
        items: [{ $type: "PhysicalInstance", Agency: "fr.insee" }],
      }),
    );

  const mockPostRejecting = (message: string) =>
    stubPost(vi.fn().mockRejectedValue(new Error(message)));

  const renderCreate = () => renderMutationHook(() => useCreatePhysicalInstance());

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should resolve id and agency from the real backend response shape (TopLevelReference / $type)", async () => {
    mockPostResolving({
      $type: "PhysicalInstance",
      URN: "urn:ddi:fr.insee:236b9453:1",
      Agency: "fr.insee",
      ID: "236b9453",
      Version: "1",
    });

    const { result } = renderCreate();

    const created = await result.current.mutateAsync(physicalInstanceFormData("manu"));

    expect(created).toEqual({ id: "236b9453", agency: "fr.insee" });
  });

  it("should call postPhysicalInstance API with correct parameters", async () => {
    const mockPost = mockPostResolving();

    const { result } = renderCreate();

    const testData = physicalInstanceFormData();

    await result.current.mutateAsync(testData);

    expect(mockPost).toHaveBeenCalledWith(testData);
  });

  it("should invalidate physicalInstances query cache on successful mutation", async () => {
    mockPostResolving();

    const { result, queryClient } = renderCreate();
    using invalidateQueriesSpy = vi.spyOn(queryClient, "invalidateQueries");

    await result.current.mutateAsync(physicalInstanceFormData());

    await waitFor(() => {
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({
        queryKey: ["physicalInstances"],
      });
    });
  });

  it("should handle API errors correctly", async () => {
    mockPostRejecting("Creation failed");

    const { result } = renderCreate();

    await expect(result.current.mutateAsync(physicalInstanceFormData())).rejects.toThrow(
      "Creation failed",
    );
  });

  it("should return mutation status correctly", async () => {
    mockPostResolving();

    const { result } = renderCreate();

    expectIdleMutation(result.current);

    result.current.mutate(physicalInstanceFormData());

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  });

  it("should handle empty label and name", async () => {
    const mockPost = mockPostResolving();

    const { result } = renderCreate();

    const testData = physicalInstanceFormData("");

    await result.current.mutateAsync(testData);

    expect(mockPost).toHaveBeenCalledWith(testData);
  });

  it("should not invalidate cache if mutation fails", async () => {
    mockPostRejecting("API Error");

    const { result, queryClient } = renderCreate();
    using invalidateQueriesSpy = vi.spyOn(queryClient, "invalidateQueries");

    try {
      await result.current.mutateAsync(physicalInstanceFormData());
    } catch {
      // Expected to fail
    }

    expect(invalidateQueriesSpy).not.toHaveBeenCalled();
  });
});
