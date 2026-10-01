import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { ReactNode, useState } from "react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";

import { CodelistsApi } from "@sdk/index";

import { sdkRejection } from "../../tests/sdk-rejection.testing";
import { CodeChanges } from "../utils/code-changes";
import { CodesPanel } from "./CodesPanel";

vi.mock("@sdk/index", () => ({
  CodelistsApi: {
    getCodesDetailedCodelist: vi.fn(),
    getCodelistCodes: vi.fn(),
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

/** Tient les modifications en attente comme le fait la page d'édition de la liste. */
const PanelWithPendingChanges = ({
  onCodeChangesChange,
  ...props
}: Record<string, unknown> & { onCodeChangesChange: (changes: CodeChanges) => void }) => {
  const [codeChanges, setCodeChanges] = useState<CodeChanges>({});
  return (
    <CodesPanel
      codelist={codelist}
      hidden={false}
      editable
      codeChanges={codeChanges}
      onCodeChangesChange={(changes) => {
        setCodeChanges(changes);
        onCodeChangesChange(changes);
      }}
      {...props}
    />
  );
};

const renderPanel = async (props: Record<string, unknown> = {}) => {
  const onCodeChangesChange = vi.fn();
  const view = render(
    <PanelWithPendingChanges onCodeChangesChange={onCodeChangesChange} {...props} />,
    { wrapper: Wrapper },
  );
  await screen.findByText("001");
  return { ...view, onCodeChangesChange };
};

const fillPanel = (panel: HTMLElement, values: Record<string, string>) => {
  for (const [name, value] of Object.entries(values)) {
    fireEvent.change(panel.querySelector(`#${name}`)!, { target: { name, value } });
  }
};

const searchByCode = (value: string) =>
  fireEvent.change(screen.getByLabelText(/code/i, { selector: "#search-code" }), {
    target: { value },
  });

const searchByLabel = (value: string) =>
  fireEvent.change(screen.getByLabelText(/label/i, { selector: "#search-label" }), {
    target: { value },
  });

describe("CodesPanel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(CodelistsApi.getCodesDetailedCodelist).mockResolvedValue(
      page([
        { code: "001", labelLg1: "Premier", labelLg2: "First", broader: ["000"] },
        { code: "002", labelLg1: "Second", labelLg2: "Second" },
      ]),
    );
    vi.mocked(CodelistsApi.getCodelistCodes).mockResolvedValue(
      page([
        { code: "000", labelLg1: "Racine" },
        { code: "001", labelLg1: "Premier" },
        { code: "002", labelLg1: "Second" },
        { code: "003", labelLg1: "Troisième" },
      ]),
    );
  });

  it("charge et affiche les codes de la liste", async () => {
    await renderPanel();

    expect(CodelistsApi.getCodesDetailedCodelist).toHaveBeenCalledWith("cl1", 1);
    expect(screen.getByText("Premier")).toBeInTheDocument();
    expect(screen.getByText("000")).toBeInTheDocument();
  });

  it("affiche l'erreur à la place d'une liste vide quand les codes ne se chargent pas", async () => {
    vi.mocked(CodelistsApi.getCodesDetailedCodelist).mockRejectedValue(
      sdkRejection.json(500, { message: "Le dépôt RDF est indisponible." }),
    );

    render(<CodesPanel codelist={codelist} hidden={false} editable={false} />, {
      wrapper: Wrapper,
    });

    expect(await screen.findByRole("alert")).toHaveTextContent("Le dépôt RDF est indisponible.");
    expect(screen.queryByRole("table")).toBeNull();
  });

  it("ne présente plus les anciens codes comme résultat d'une recherche en échec", async () => {
    vi.mocked(CodelistsApi.getCodesByCode).mockRejectedValue(sdkRejection.network());
    await renderPanel();

    searchByCode("00");

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "The server cannot be reached. Check your connection and try again.",
    );
    expect(screen.queryByText("Premier")).toBeNull();
  });

  it("recherche les codes par code", async () => {
    vi.mocked(CodelistsApi.getCodesByCode).mockResolvedValue(page([{ code: "001" }]));
    await renderPanel();

    searchByCode("00");

    expect(CodelistsApi.getCodesByCode).toHaveBeenCalledWith("cl1", "00");
  });

  it("recherche les codes par libellé", async () => {
    vi.mocked(CodelistsApi.getCodesByLabel).mockResolvedValue(page([{ code: "001" }]));
    await renderPanel();

    searchByLabel("Prem");

    expect(CodelistsApi.getCodesByLabel).toHaveBeenCalledWith("cl1", "Prem");
  });

  it("croise les deux critères quand ils sont renseignés tous les deux", async () => {
    vi.mocked(CodelistsApi.getCodesByCode).mockResolvedValue(page([{ code: "001" }]));
    vi.mocked(CodelistsApi.getCodesByCodeAndLabel).mockResolvedValue(page([{ code: "001" }]));
    await renderPanel();

    searchByCode("00");
    await waitFor(() => expect(CodelistsApi.getCodesByCode).toHaveBeenCalled());
    searchByLabel("Prem");

    expect(CodelistsApi.getCodesByCodeAndLabel).toHaveBeenCalledWith("cl1", "00", "Prem");
  });

  it("ouvre le code sélectionné en modification", async () => {
    await renderPanel();

    fireEvent.click(screen.getAllByLabelText("See")[0].querySelector("span")!);

    const panel = await screen.findByRole("complementary");
    expect(within(panel).getByDisplayValue("Premier")).toBeInTheDocument();
    expect(panel.querySelector("#code")).toBeDisabled();
  });

  it("garde la modification d'un code en attente, sans l'envoyer au serveur", async () => {
    const { onCodeChangesChange } = await renderPanel();

    fireEvent.click(screen.getAllByLabelText("See")[0].querySelector("span")!);
    const panel = await screen.findByRole("complementary");
    fillPanel(panel, { labelLg1: "Premier modifié" });
    fireEvent.click(within(panel).getByRole("button", { name: /update|modifier/i }));

    expect(await screen.findByText("Premier modifié")).toBeInTheDocument();
    expect(onCodeChangesChange).toHaveBeenLastCalledWith({
      "001": {
        type: "updated",
        code: expect.objectContaining({ code: "001", labelLg1: "Premier modifié" }),
      },
    });
    expect(CodelistsApi.putCodesDetailedCodelist).not.toHaveBeenCalled();
    await waitFor(() => expect(screen.queryByRole("complementary")).toBeNull());
  });

  it("garde la création d'un code en attente, sans l'envoyer au serveur", async () => {
    const { onCodeChangesChange } = await renderPanel();

    fireEvent.click(screen.getByRole("button", { name: "Add" }));
    const panel = await screen.findByRole("complementary");
    fillPanel(panel, { code: "003", labelLg1: "Troisième", labelLg2: "Third" });
    fireEvent.click(within(panel).getByRole("button", { name: /save|sauvegarder/i }));

    expect(await screen.findByText("Troisième")).toBeInTheDocument();
    expect(onCodeChangesChange).toHaveBeenLastCalledWith({
      "003": { type: "created", code: { code: "003", labelLg1: "Troisième", labelLg2: "Third" } },
    });
    expect(CodelistsApi.postCodesDetailedCodelist).not.toHaveBeenCalled();
  });

  it("refuse de créer un code déjà présent dans la liste", async () => {
    await renderPanel();

    fireEvent.click(screen.getByRole("button", { name: "Add" }));
    const panel = await screen.findByRole("complementary");
    fillPanel(panel, { code: "001", labelLg1: "Doublon", labelLg2: "Duplicate" });
    fireEvent.click(within(panel).getByRole("button", { name: /save|sauvegarder/i }));

    expect(await within(panel).findByRole("alert")).toBeInTheDocument();
    expect(screen.queryByText("Doublon")).toBeNull();
  });

  it("saisit la description d'un code dans une zone de texte multiligne", async () => {
    await renderPanel();

    fireEvent.click(screen.getByRole("button", { name: "Add" }));
    const panel = await screen.findByRole("complementary");

    expect(panel.querySelector("textarea#descriptionLg1")).toBeInTheDocument();
    expect(panel.querySelector("textarea#descriptionLg2")).toBeInTheDocument();
  });

  it("refuse d'enregistrer un code incomplet", async () => {
    await renderPanel();

    fireEvent.click(screen.getByRole("button", { name: "Add" }));
    const panel = await screen.findByRole("complementary");
    fireEvent.click(within(panel).getByRole("button", { name: /save|sauvegarder/i }));

    expect(await within(panel).findByRole("alert")).toBeInTheDocument();
    expect(CodelistsApi.postCodesDetailedCodelist).not.toHaveBeenCalled();
  });

  it("garde la suppression d'un code en attente, sans l'envoyer au serveur", async () => {
    const { onCodeChangesChange } = await renderPanel();

    fireEvent.click(screen.getAllByLabelText(/remove/i)[0].querySelector("span")!);

    await waitFor(() => expect(screen.queryByText("001")).toBeNull());
    expect(onCodeChangesChange).toHaveBeenLastCalledWith({
      "001": { type: "deleted", code: expect.objectContaining({ code: "001" }) },
    });
    expect(CodelistsApi.deleteCodesDetailedCodelist).not.toHaveBeenCalled();
  });

  it("n'offre aucune action quand la liste n'est pas modifiable", async () => {
    await renderPanel({ editable: false });

    expect(screen.queryByLabelText("See")).toBeNull();
    expect(screen.queryByRole("button", { name: "Add" })).toBeNull();
  });
  describe("liens entre codes", () => {
    const openFirstCode = async () => {
      fireEvent.click(screen.getAllByLabelText("See")[0].querySelector("span")!);
      return screen.findByRole("complementary");
    };

    const openLinkSelect = async (panel: HTMLElement, id: "broader" | "narrower") => {
      fireEvent.click(panel.querySelector(`#${id}-field .p-multiselect`)!);
      // Sans animation sous happy-dom, le panneau reste en display: none : il est masqué pour les rôles.
      return screen.findByRole("listbox", { hidden: true });
    };

    const optionLabels = (listbox: HTMLElement) =>
      within(listbox)
        .getAllByRole("option", { hidden: true })
        .map((option) => option.textContent);

    it("propose en parents tous les codes de la liste, sauf le code lui-même", async () => {
      await renderPanel();
      const panel = await openFirstCode();

      const listbox = await openLinkSelect(panel, "broader");

      await waitFor(() =>
        expect(optionLabels(listbox)).toEqual(["000 - Racine", "002 - Second", "003 - Troisième"]),
      );
      expect(CodelistsApi.getCodelistCodes).toHaveBeenCalledWith("cl1", 1, 0);
    });

    it("n'offre pas en enfant un code déjà choisi comme parent", async () => {
      await renderPanel();
      const panel = await openFirstCode();

      const listbox = await openLinkSelect(panel, "narrower");

      await waitFor(() =>
        expect(optionLabels(listbox)).toEqual(["002 - Second", "003 - Troisième"]),
      );
    });

    it("filtre les codes proposés sur le code ou le libellé", async () => {
      await renderPanel();
      const panel = await openFirstCode();
      const listbox = await openLinkSelect(panel, "narrower");
      await waitFor(() => expect(optionLabels(listbox)).toHaveLength(2));

      fireEvent.change(document.querySelector(".p-multiselect-filter")!, {
        target: { value: "troi" },
      });

      await waitFor(() => expect(optionLabels(listbox)).toEqual(["003 - Troisième"]));
    });

    it("garde les enfants choisis dans la modification en attente", async () => {
      const { onCodeChangesChange } = await renderPanel();
      const panel = await openFirstCode();
      const listbox = await openLinkSelect(panel, "narrower");

      fireEvent.click(await within(listbox).findByText("003 - Troisième"));
      fireEvent.click(within(panel).getByRole("button", { name: /update|modifier/i }));

      await waitFor(() =>
        expect(onCodeChangesChange).toHaveBeenLastCalledWith({
          "001": {
            type: "updated",
            code: expect.objectContaining({ broader: ["000"], narrower: ["003"] }),
          },
        }),
      );
    });
  });
});
