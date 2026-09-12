import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";

import { DDIApi } from "../../sdk";
import { usePhysicalInstanceParents } from "./usePhysicalInstanceParents";

vi.mock("../../sdk", () => ({
  DDIApi: { getPhysicalInstanceParents: vi.fn() },
}));

const renderParents = (agencyId: string, id: string) => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return renderHook(() => usePhysicalInstanceParents(agencyId, id), { wrapper });
};

describe("usePhysicalInstanceParents", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(DDIApi.getPhysicalInstanceParents).mockResolvedValue({
      studyUnit: { agency: "fr.insee", id: "su-1" },
      group: { agency: "fr.insee", id: "grp-1" },
      stamps: [],
    });
  });

  it("résout les parents de la PhysicalInstance demandée", async () => {
    const { result } = renderParents("fr.insee", "pi-1");

    await waitFor(() => expect(result.current.data?.group.id).toBe("grp-1"));
    expect(DDIApi.getPhysicalInstanceParents).toHaveBeenCalledWith("fr.insee", "pi-1");
  });

  it("n'appelle pas le back tant que l'identité de la PhysicalInstance est inconnue", () => {
    // Les hooks composés passent des chaînes vides pour se désactiver (convention du module) :
    // sans garde, la requête partirait sur `/physical-instance///parents`.
    const { result } = renderParents("", "");

    expect(DDIApi.getPhysicalInstanceParents).not.toHaveBeenCalled();
    expect(result.current.isLoading).toBe(false);
  });
});
