import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { ReactNode, useState } from "react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";

import { CodelistsApi } from "@sdk/index";

import { CodeChanges } from "../utils/code-changes";
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
});
