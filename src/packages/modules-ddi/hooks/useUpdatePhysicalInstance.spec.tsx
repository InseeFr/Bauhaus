import { waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { DDIApi } from "@sdk/index";

import { physicalInstanceFormData } from "./physicalInstanceFormData.testing";
import { expectIdleMutation, renderMutationHook } from "./queryClient.testing";
import { useUpdatePhysicalInstance } from "./useUpdatePhysicalInstance";

vi.mock("../../sdk", () => ({
  DDIApi: {
    patchPhysicalInstance: vi.fn(),
  },
}));

describe("useUpdatePhysicalInstance", () => {
  const stubPatch = (mockPatch: ReturnType<typeof vi.fn>) => {
    (DDIApi.patchPhysicalInstance as any) = mockPatch;
    return mockPatch;
  };

  const updateData = (id = "test-id", agencyId = "test-agency") => ({
    id,
    agencyId,
    data: physicalInstanceFormData(),
  });

  const renderUpdate = () => renderMutationHook(() => useUpdatePhysicalInstance());

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call patchPhysicalInstance API with correct parameters", async () => {
    const mockPatch = stubPatch(vi.fn().mockResolvedValue({}));

    const { result } = renderUpdate();

    const testData = updateData();

    await result.current.mutateAsync(testData);

    expect(mockPatch).toHaveBeenCalledWith("test-agency", "test-id", testData.data);
  });

  for (const { name, queryKey } of [
    {
      name: "should invalidate physicalInstances query cache on success",
      queryKey: ["physicalInstances"],
    },
    {
      // La recherche avancée affiche le label et les parents : après un renommage ou un
      // re-rattachement, elle resterait périmée (staleTime: Infinity) sans cette éviction.
      name: "should invalidate the advanced search cache on success",
      queryKey: ["physicalInstancesSearch"],
    },
    {
      name: "should invalidate the edited physical instance detail cache on success",
      queryKey: ["physicalInstanceById", "test-agency-456", "test-id-123"],
    },
  ]) {
    it(name, async () => {
      stubPatch(vi.fn().mockResolvedValue({}));

      const { result, queryClient } = renderUpdate();
      using invalidateQueriesSpy = vi.spyOn(queryClient, "invalidateQueries");

      await result.current.mutateAsync(updateData("test-id-123", "test-agency-456"));

      expect(invalidateQueriesSpy).toHaveBeenCalledWith({ queryKey });
    });
  }

  it("should handle API errors correctly", async () => {
    stubPatch(vi.fn().mockRejectedValue(new Error("API Error")));

    const { result } = renderUpdate();

    await expect(result.current.mutateAsync(updateData())).rejects.toThrow("API Error");
  });

  it("should return mutation status correctly", async () => {
    stubPatch(vi.fn().mockResolvedValue({}));

    const { result } = renderUpdate();

    expectIdleMutation(result.current);

    result.current.mutate(updateData());

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  });
});
