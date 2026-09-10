import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { PropsWithChildren } from "react";

import { CodelistsApi, fetchCodelist } from "@sdk/index";

import { useAllCodes, useCodelist, useCodelists } from "./codelist";

vi.mock("@sdk/index", () => ({
  fetchCodelist: vi.fn(),
  CodelistsApi: { getCodelistCodes: vi.fn() },
}));

const wrapper = ({ children }: PropsWithChildren) => (
  <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
    {children}
  </QueryClientProvider>
);

describe("useCodelist", () => {
  beforeEach(() => vi.clearAllMocks());

  it("rend une liste vide tant que la liste de codes n'est pas arrivée", () => {
    vi.mocked(fetchCodelist).mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useCodelist("CL_FREQ"), { wrapper });

    expect(result.current).toEqual({ codes: [] });
  });

  it("rend la liste de codes chargée", async () => {
    vi.mocked(fetchCodelist).mockResolvedValue({ codes: [{ code: "A" }] });

    const { result } = renderHook(() => useCodelist("CL_FREQ"), { wrapper });

    await waitFor(() => expect(result.current).toEqual({ codes: [{ code: "A" }] }));
    expect(vi.mocked(fetchCodelist)).toHaveBeenCalledWith("CL_FREQ");
  });
});

describe("useCodelists", () => {
  beforeEach(() => vi.clearAllMocks());

  it("charge chaque liste demandée et les rend dans l'ordre", async () => {
    vi.mocked(fetchCodelist).mockImplementation((notation: string) =>
      Promise.resolve({ notation, codes: [] }),
    );

    const { result } = renderHook(() => useCodelists(["CL_FREQ", "CL_SOURCE"]), { wrapper });

    await waitFor(() => {
      expect(result.current.map((query) => query.data?.notation)).toEqual(["CL_FREQ", "CL_SOURCE"]);
    });
  });
});

describe("useAllCodes", () => {
  beforeEach(() => vi.clearAllMocks());

  it("rend les codes triés par libellé", async () => {
    vi.mocked(CodelistsApi).getCodelistCodes.mockResolvedValue({
      items: [{ labelLg1: "Trimestrielle" }, { labelLg1: "Annuelle" }],
    });

    const { result } = renderHook(() => useAllCodes("CL_FREQ", true), { wrapper });

    await waitFor(() => {
      expect(result.current.data).toEqual([
        { labelLg1: "Annuelle" },
        { labelLg1: "Trimestrielle" },
      ]);
    });
    expect(vi.mocked(CodelistsApi).getCodelistCodes).toHaveBeenCalledWith("CL_FREQ", 1, 0);
  });

  it("rend un tableau vide quand la liste ne renvoie aucun code", async () => {
    vi.mocked(CodelistsApi).getCodelistCodes.mockResolvedValue({});

    const { result } = renderHook(() => useAllCodes("CL_FREQ", true), { wrapper });

    await waitFor(() => expect(result.current.data).toEqual([]));
  });

  it("n'interroge pas le serveur tant que la liste n'est pas demandée", () => {
    renderHook(() => useAllCodes("CL_FREQ", false), { wrapper });

    expect(vi.mocked(CodelistsApi).getCodelistCodes).not.toHaveBeenCalled();
  });

  it("n'interroge pas le serveur sans notation", () => {
    renderHook(() => useAllCodes(undefined, true), { wrapper });

    expect(vi.mocked(CodelistsApi).getCodelistCodes).not.toHaveBeenCalled();
  });
});
