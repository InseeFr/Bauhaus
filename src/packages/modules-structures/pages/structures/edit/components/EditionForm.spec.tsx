import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ReactNode } from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { vi } from "vitest";

import { StructureApi } from "@sdk/index";

import { AppContextProvider } from "../../../../../application/app-context";
import { EditionForm } from "./EditionForm";

vi.mock("@sdk/index", () => ({
  StructureApi: {
    postStructure: vi.fn(),
    putStructure: vi.fn(),
    getMutualizedComponents: vi.fn().mockResolvedValue([]),
  },
  ConceptsApi: { getConceptList: vi.fn().mockResolvedValue([]) },
  CodelistsApi: {
    getCodelists: vi.fn().mockResolvedValue([]),
    getCodelistsPartial: vi.fn().mockResolvedValue([]),
  },
  StampsApi: { getStamps: vi.fn().mockResolvedValue([]) },
}));

vi.mock("@components/business/creators-input", () => ({
  CreatorsInput: () => <div />,
}));
vi.mock("@components/business/contributors-input/contributors-input", () => ({
  ContributorsInput: () => <div />,
}));
vi.mock("./StructureComponents", () => ({
  StructureComponents: () => <div />,
}));

vi.mock("@utils/hooks/users", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@utils/hooks/users")>();
  return {
    ...actual,
    usePrivileges: () => ({
      privileges: [
        {
          application: "STRUCTURE_STRUCTURE",
          privileges: [{ privilege: "CREATE", strategy: "ALL" }],
        },
      ],
    }),
    useUserStamps: () => ({ data: [{ stamp: "DG75-L201" }] }),
  };
});

const Wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
    <MemoryRouter initialEntries={["/structures/edit"]}>
      <AppContextProvider lg1="fr" lg2="en" version="2.0.0" properties={{} as any}>
        <Routes>
          <Route path="/structures/edit" element={children} />
          <Route path="/structures/:id" element={<span>Fiche de la structure</span>} />
        </Routes>
      </AppContextProvider>
    </MemoryRouter>
  </QueryClientProvider>
);

const structure = {
  id: "dsd1",
  identifiant: "DSD1",
  labelLg1: "Structure 1",
  labelLg2: "Structure 1 EN",
};

const renderForm = (props: Record<string, unknown> = {}) =>
  render(<EditionForm creation={false} initialStructure={structure} {...props} />, {
    wrapper: Wrapper,
  });

const saveButton = () => screen.getByRole("button", { name: /save|sauvegarder/i });

describe("EditionForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("affiche la structure à modifier, notation verrouillée", () => {
    renderForm();

    expect(screen.getByDisplayValue("Structure 1")).toBeInTheDocument();
    expect(screen.getByDisplayValue("DSD1")).toBeDisabled();
  });

  it("laisse saisir la notation à la création", () => {
    renderForm({ creation: true, initialStructure: {} });

    const notation = screen.getByLabelText(/notation/i);
    expect(notation).toBeEnabled();

    fireEvent.change(notation, { target: { value: "DSD2" } });

    expect(screen.getByDisplayValue("DSD2")).toBeInTheDocument();
  });

  it("reporte la saisie des libellés et descriptions", () => {
    renderForm();

    fireEvent.change(screen.getByDisplayValue("Structure 1"), {
      target: { value: "Structure renommée" },
    });

    expect(screen.getByDisplayValue("Structure renommée")).toBeInTheDocument();
  });

  it("enregistre la structure modifiée puis ouvre sa fiche", async () => {
    vi.mocked(StructureApi.putStructure).mockResolvedValue("dsd1");
    renderForm();

    fireEvent.click(saveButton());

    expect(await screen.findByText("Fiche de la structure")).toBeInTheDocument();
    expect(StructureApi.putStructure).toHaveBeenCalledWith(
      expect.objectContaining({ identifiant: "DSD1" }),
    );
  });

  it("crée la structure quand le formulaire est en création", async () => {
    vi.mocked(StructureApi.postStructure).mockResolvedValue("dsd2");
    renderForm({ creation: true, initialStructure: structure });

    fireEvent.click(saveButton());

    await waitFor(() => expect(StructureApi.postStructure).toHaveBeenCalled());
    expect(StructureApi.putStructure).not.toHaveBeenCalled();
  });

  it("affiche les erreurs de saisie et n'appelle pas le serveur", async () => {
    renderForm({ creation: true, initialStructure: { identifiant: "", labelLg1: "" } });

    fireEvent.click(saveButton());

    expect(await screen.findByRole("alert")).toBeInTheDocument();
    expect(StructureApi.postStructure).not.toHaveBeenCalled();
  });

  it("affiche l'erreur renvoyée par le serveur", async () => {
    vi.mocked(StructureApi.putStructure).mockRejectedValue("Erreur serveur");
    renderForm();

    fireEvent.click(saveButton());

    expect(await screen.findByText("Erreur serveur")).toBeInTheDocument();
  });
});
