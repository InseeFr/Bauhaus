import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";

import { CodelistsApi } from "@sdk/index";

import { CodesPanel } from "./CodesPanel";

vi.mock("@sdk/index", () => ({
  CodelistsApi: {
    getCodesDetailedCodelist: vi.fn(),
    getCodesByCode: vi.fn(),
    getCodesByLabel: vi.fn(),
    getCodesByCodeAndLabel: vi.fn(),
    postCodesDetailedCodelist: vi.fn(),
    putCodesDetailedCodelist: vi.fn(),
    deleteCodesDetailedCodelist: vi.fn(),
  },
}));

vi.mock("@utils/hooks/users", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@utils/hooks/users")>();
  return {
    ...actual,
    usePrivileges: () => ({
      privileges: [
        {
          application: "CODESLIST_CODESLIST",
          privileges: [
            { privilege: "CREATE", strategy: "ALL" },
            { privilege: "UPDATE", strategy: "ALL" },
          ],
        },
      ],
    }),
    useUserStamps: () => ({ data: [{ stamp: "DG75-L201" }] }),
  };
});

const codelist = {
  id: "cl1",
  lastCodeUriSegment: "codes",
  contributor: "DG75-L201",
} as any;

const page = (items: Record<string, unknown>[]) => ({ items, total: items.length });

const Wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
    <MemoryRouter>{children}</MemoryRouter>
  </QueryClientProvider>
);

const renderPanel = async (props: Record<string, unknown> = {}) => {
  const view = render(<CodesPanel codelist={codelist} hidden={false} editable {...props} />, {
    wrapper: Wrapper,
  });
  await screen.findByText("001");
  return view;
};

const fillPanel = (panel: HTMLElement, values: Record<string, string>) => {
  for (const [name, value] of Object.entries(values)) {
    fireEvent.change(panel.querySelector(`#${name}`)!, { target: { name, value } });
  }
};

describe("CodesPanel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(CodelistsApi.getCodesDetailedCodelist).mockResolvedValue(
      page([
        { code: "001", labelLg1: "Premier", labelLg2: "First", broader: ["000"] },
        { code: "002", labelLg1: "Second", labelLg2: "Second" },
      ]),
    );
  });

  it("charge et affiche les codes de la liste", async () => {
    await renderPanel();

    expect(CodelistsApi.getCodesDetailedCodelist).toHaveBeenCalledWith("cl1", 1);
    expect(screen.getByText("Premier")).toBeInTheDocument();
    expect(screen.getByText("000")).toBeInTheDocument();
  });

  it("recherche les codes par code", async () => {
    vi.mocked(CodelistsApi.getCodesByCode).mockResolvedValue(page([{ code: "001" }]));
    await renderPanel();

    fireEvent.change(screen.getByLabelText(/code/i, { selector: "#search-code" }), {
      target: { value: "00" },
    });

    expect(CodelistsApi.getCodesByCode).toHaveBeenCalledWith("cl1", "00");
  });

  it("recherche les codes par libellé", async () => {
    vi.mocked(CodelistsApi.getCodesByLabel).mockResolvedValue(page([{ code: "001" }]));
    await renderPanel();

    fireEvent.change(screen.getByLabelText(/label/i, { selector: "#search-label" }), {
      target: { value: "Prem" },
    });

    expect(CodelistsApi.getCodesByLabel).toHaveBeenCalledWith("cl1", "Prem");
  });

  it("croise les deux critères quand ils sont renseignés tous les deux", async () => {
    vi.mocked(CodelistsApi.getCodesByCode).mockResolvedValue(page([{ code: "001" }]));
    vi.mocked(CodelistsApi.getCodesByCodeAndLabel).mockResolvedValue(page([{ code: "001" }]));
    await renderPanel();

    fireEvent.change(screen.getByLabelText(/code/i, { selector: "#search-code" }), {
      target: { value: "00" },
    });
    await waitFor(() => expect(CodelistsApi.getCodesByCode).toHaveBeenCalled());
    fireEvent.change(screen.getByLabelText(/label/i, { selector: "#search-label" }), {
      target: { value: "Prem" },
    });

    expect(CodelistsApi.getCodesByCodeAndLabel).toHaveBeenCalledWith("cl1", "00", "Prem");
  });

  it("ouvre le code sélectionné en modification", async () => {
    await renderPanel();

    fireEvent.click(screen.getAllByLabelText("See")[0].querySelector("span")!);

    const panel = await screen.findByRole("complementary");
    expect(within(panel).getByDisplayValue("Premier")).toBeInTheDocument();
    expect(panel.querySelector("#code")).toBeDisabled();
  });

  it("enregistre la modification d'un code puis referme le panneau", async () => {
    vi.mocked(CodelistsApi.putCodesDetailedCodelist).mockResolvedValue(undefined);
    await renderPanel();

    fireEvent.click(screen.getAllByLabelText("See")[0].querySelector("span")!);
    const panel = await screen.findByRole("complementary");
    fillPanel(panel, { labelLg1: "Premier modifié" });
    fireEvent.click(within(panel).getByRole("button", { name: /update|modifier/i }));

    await waitFor(() =>
      expect(CodelistsApi.putCodesDetailedCodelist).toHaveBeenCalledWith(
        "cl1",
        expect.objectContaining({ code: "001", labelLg1: "Premier modifié" }),
      ),
    );
  });

  it("crée un code depuis le bouton d'ajout", async () => {
    vi.mocked(CodelistsApi.postCodesDetailedCodelist).mockResolvedValue(undefined);
    await renderPanel();

    fireEvent.click(screen.getByRole("button", { name: "Add" }));
    const panel = await screen.findByRole("complementary");
    fillPanel(panel, { code: "003", labelLg1: "Troisième", labelLg2: "Third" });
    fireEvent.click(within(panel).getByRole("button", { name: /save|sauvegarder/i }));

    await waitFor(() =>
      expect(CodelistsApi.postCodesDetailedCodelist).toHaveBeenCalledWith("cl1", {
        code: "003",
        labelLg1: "Troisième",
        labelLg2: "Third",
      }),
    );
  });

  it("refuse d'enregistrer un code incomplet", async () => {
    await renderPanel();

    fireEvent.click(screen.getByRole("button", { name: "Add" }));
    const panel = await screen.findByRole("complementary");
    fireEvent.click(within(panel).getByRole("button", { name: /save|sauvegarder/i }));

    expect(await within(panel).findByRole("alert")).toBeInTheDocument();
    expect(CodelistsApi.postCodesDetailedCodelist).not.toHaveBeenCalled();
  });

  it("supprime un code puis recharge la liste", async () => {
    vi.mocked(CodelistsApi.deleteCodesDetailedCodelist).mockResolvedValue(undefined);
    await renderPanel();

    fireEvent.click(screen.getAllByLabelText(/remove/i)[0].querySelector("span")!);

    await waitFor(() =>
      expect(CodelistsApi.deleteCodesDetailedCodelist).toHaveBeenCalledWith(
        "cl1",
        expect.objectContaining({ code: "001" }),
      ),
    );
    expect(CodelistsApi.getCodesDetailedCodelist).toHaveBeenCalledTimes(2);
  });

  it("n'offre aucune action quand la liste n'est pas modifiable", async () => {
    await renderPanel({ editable: false });

    expect(screen.queryByLabelText("See")).toBeNull();
    expect(screen.queryByRole("button", { name: "Add" })).toBeNull();
  });
});
