import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import type { Toast } from "primereact/toast";
import type { ReactNode, RefObject } from "react";

import { DDIApi } from "@sdk/index";

import type { PhysicalInstanceResponse } from "../physical-instances/types/api";
import { useExport } from "./useExport";

vi.mock("../../sdk", () => ({
  DDIApi: { convertToDDI3: vi.fn() },
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string, options?: Record<string, unknown>) =>
      options ? `${key}|${JSON.stringify(options)}` : key,
  }),
}));

vi.mock("../physical-instances/pages/view/enrichDataWithCodeLists", () => ({
  enrichDataWithCodeLists: (_client: unknown, data: unknown) => Promise.resolve(data),
}));

describe("useExport", () => {
  const data = {
    PhysicalInstance: [{ Agency: "fr.insee", ID: "pi-1" }],
  } as unknown as PhysicalInstanceResponse;

  const renderExport = () => {
    const show = vi.fn();
    const toast = { current: { show } } as unknown as RefObject<Toast>;
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
    const { result } = renderHook(() => useExport(data, "Titre", toast), { wrapper });
    return { handleExport: result.current, show };
  };

  it("affiche le message du back quand la conversion DDI3 échoue", async () => {
    // Le SDK rejette un objet nu { message, status }, jamais une Error.
    vi.mocked(DDIApi.convertToDDI3).mockRejectedValue({
      message: "Conversion impossible",
      status: 400,
    });

    const { handleExport, show } = renderExport();
    await handleExport("DDI3");

    expect(show).toHaveBeenCalledWith(
      expect.objectContaining({ severity: "error", detail: "Conversion impossible" }),
    );
  });

  it("retombe sur le message générique quand le rejet ne porte pas de message", async () => {
    vi.mocked(DDIApi.convertToDDI3).mockRejectedValue({ status: 500 });

    const { handleExport, show } = renderExport();
    await handleExport("DDI3");

    expect(show).toHaveBeenCalledWith(
      expect.objectContaining({
        severity: "error",
        detail: "physicalInstance.view.exportErrorDetail",
      }),
    );
  });
});
