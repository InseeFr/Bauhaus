import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { DDIApi } from "@sdk/index";

import { useDuplicatePhysicalInstance } from "./useDuplicatePhysicalInstance";

vi.mock("../../sdk", () => ({
  DDIApi: {
    duplicatePhysicalInstance: vi.fn(),
  },
}));

const request = {
  physicalInstanceLabel: "Original (copy)",
  dataRelationshipLabel: "Structure : Original (copy)",
  logicalRecordLabel: "Enregistrement logique : Original (copy)",
  groupId: "group-1",
  groupAgency: "fr.insee",
  studyUnitId: "su-1",
  studyUnitAgency: "fr.insee",
};

const copyResponse = {
  topLevelReferences: [
    {
      $type: "PhysicalInstance",
      URN: "urn:ddi:fr.insee:pi-copy:1",
      Agency: "fr.insee",
      ID: "pi-copy",
      Version: "1",
    },
  ],
  items: [{ $type: "PhysicalInstance", Agency: "fr.insee", ID: "pi-copy" }],
};

describe("useDuplicatePhysicalInstance", () => {
  let queryClient: QueryClient;

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    });
    vi.clearAllMocks();
  });

  it("should duplicate the source physical instance through the dedicated endpoint", async () => {
    vi.mocked(DDIApi.duplicatePhysicalInstance).mockResolvedValue(copyResponse);

    const { result } = renderHook(() => useDuplicatePhysicalInstance(), { wrapper });

    await result.current.mutateAsync({ agencyId: "fr.insee", id: "pi-src", data: request });

    expect(DDIApi.duplicatePhysicalInstance).toHaveBeenCalledWith("fr.insee", "pi-src", request);
  });

  it("should resolve the id and agency of the copy", async () => {
    vi.mocked(DDIApi.duplicatePhysicalInstance).mockResolvedValue(copyResponse);

    const { result } = renderHook(() => useDuplicatePhysicalInstance(), { wrapper });

    const copy = await result.current.mutateAsync({
      agencyId: "fr.insee",
      id: "pi-src",
      data: request,
    });

    expect(copy).toEqual({ id: "pi-copy", agency: "fr.insee" });
  });

  it("should invalidate the physical instance lists once the copy is created", async () => {
    vi.mocked(DDIApi.duplicatePhysicalInstance).mockResolvedValue(copyResponse);
    using invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useDuplicatePhysicalInstance(), { wrapper });

    await result.current.mutateAsync({ agencyId: "fr.insee", id: "pi-src", data: request });

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["physicalInstances"] });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["physicalInstancesSearch"] });
  });
});
