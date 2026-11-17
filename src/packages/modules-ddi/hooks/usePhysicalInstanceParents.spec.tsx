import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";

import { DDIApi } from "../../sdk";
import { usePhysicalInstanceParents } from "./usePhysicalInstanceParents";

vi.mock("../../sdk", () => ({
  DDIApi: { getPhysicalInstanceParents: vi.fn() },
}));

const renderParents = (agencyId: string, id: string, options?: { enabled?: boolean }) => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return renderHook(() => usePhysicalInstanceParents(agencyId, id, options), { wrapper });
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

  it("ne redemande pas des parents en échec quand un autre composant les lit à son tour", async () => {
    // #1683 : l'onglet « Représentation » relit les parents ; relancer la requête en échec la
    // repassait en chargement, la page démontait l'onglet, puis le remontait : boucle infinie.
    vi.mocked(DDIApi.getPhysicalInstanceParents).mockRejectedValue({ status: 404 });
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
    const first = renderHook(() => usePhysicalInstanceParents("fr.insee", "pi-1"), { wrapper });
    await waitFor(() => expect(first.result.current.isError).toBe(true));

    const second = renderHook(() => usePhysicalInstanceParents("fr.insee", "pi-1"), { wrapper });

    expect(second.result.current.isError).toBe(true);
    expect(first.result.current.isLoading).toBe(false);
    expect(DDIApi.getPhysicalInstanceParents).toHaveBeenCalledTimes(1);
  });

  it("n'appelle pas le back quand l'appelant désactive la requête", () => {
    const { result } = renderParents("fr.insee", "pi-1", { enabled: false });

    expect(DDIApi.getPhysicalInstanceParents).not.toHaveBeenCalled();
    expect(result.current.isLoading).toBe(false);
  });
});
