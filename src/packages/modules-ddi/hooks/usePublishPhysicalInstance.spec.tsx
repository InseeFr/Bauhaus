import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePublishPhysicalInstance } from "./usePublishPhysicalInstance";
import { DDIApi } from "../../sdk";
import type { ReactNode } from "react";

vi.mock("../../sdk", () => ({
  DDIApi: {
    putPhysicalInstance: vi.fn(),
  },
}));

describe("usePublishPhysicalInstance", () => {
  let queryClient: QueryClient;

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  const seedParents = () => {
    queryClient.setQueryData(["physicalInstanceParents", "fr.insee", "pi-1"], {
      studyUnit: { agency: "fr.insee", id: "su-1" },
      group: { agency: "fr.insee", id: "group-1", label: "Mon groupe" },
      stamps: [],
    });
  };

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    vi.clearAllMocks();
    (DDIApi.putPhysicalInstance as any) = vi.fn().mockResolvedValue({});
  });

  it("should invalidate the parent group's code lists cache on success", async () => {
    seedParents();
    using invalidateQueriesSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => usePublishPhysicalInstance(), { wrapper });
    await result.current.mutateAsync({ id: "pi-1", agencyId: "fr.insee", data: {} });

    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: ["groupCodesLists", "fr.insee", "group-1"],
    });
  });

  it("should not invalidate the mutualized code lists cache on success", async () => {
    seedParents();
    using invalidateQueriesSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => usePublishPhysicalInstance(), { wrapper });
    await result.current.mutateAsync({ id: "pi-1", agencyId: "fr.insee", data: {} });

    expect(invalidateQueriesSpy).not.toHaveBeenCalledWith({
      queryKey: ["mutualizedCodesLists"],
    });
  });

  it("should still invalidate the physical instance's own code lists cache on success", async () => {
    seedParents();
    using invalidateQueriesSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => usePublishPhysicalInstance(), { wrapper });
    await result.current.mutateAsync({ id: "pi-1", agencyId: "fr.insee", data: {} });

    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: ["physicalCodesLists", "fr.insee", "pi-1"],
    });
  });
});
