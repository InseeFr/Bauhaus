import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { OperationsApi } from "@sdk/operations-api";

import { renderWithLoaderData } from "../../page.testing";
import { mockMetadataStructure } from "../metadata-structure.testing";
import { Component } from "./page";

vi.mock("@sdk/operations-api", () => ({
  OperationsApi: { getOwners: vi.fn(), exportSims: vi.fn() },
}));

const useSims = vi.fn();
const publishSimsMutation = vi.fn();
vi.mock("../../../hooks/useMetadataStructure");
vi.mock("../../../hooks/useCodelists", () => import("../msd-hooks.testing"));
vi.mock("../../../hooks/useSims", () => ({
  useSims: () => useSims(),
  usePublishSims: () => ({ mutateAsync: publishSimsMutation }),
}));
vi.mock("@utils/hooks/organizations", () => import("../msd-hooks.testing"));
vi.mock("../hooks/useDocumentsList", () => ({
  useDocumentsList: () => ({ documentStores: [], setDocumentStores: vi.fn() }),
}));

// L'écran est un assembleur : on remplace la vue par un pilote qui expose les deux
// callbacks qu'elle reçoit, seuls chemins par lesquels le reducer de la page est atteint.
vi.mock("./components/SimsVisualization", () => ({
  SimsVisualization: ({ sims, publishSims, exportCallback, missingDocuments, owners }: any) => (
    <div>
      <span>sims:{sims.labelLg1 ?? "(vide)"}</span>
      <span>owners:{owners.length}</span>
      <span>missing:{[...missingDocuments].join(",")}</span>
      <button onClick={() => publishSims({ id: "sims-1" }, onPublishError)}>publier</button>
      <button onClick={() => exportCallback("sims-1", "config", true)}>exporter</button>
    </div>
  ),
}));
vi.mock("../components/MSDLayout", () => ({
  MSDLayout: ({ children, baseUrl }: any) => <div data-testid={`msd-${baseUrl}`}>{children}</div>,
}));

const onPublishError = vi.fn();

let loaderData: unknown;

const renderPage = () =>
  renderWithLoaderData(<Component />, loaderData, { path: "/sims/:id", url: "/sims/sims-1" });

describe("Sims view page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    loaderData = { baseUrl: "/operations/sims", disableSectionAnchor: false };
    mockMetadataStructure({ loaded: true });
    useSims.mockReturnValue({ isLoading: false, sims: { id: "sims-1", labelLg1: "Rapport" } });
    vi.mocked(OperationsApi.getOwners).mockResolvedValue([{ id: "owner-1" }]);
    vi.mocked(OperationsApi.exportSims).mockResolvedValue(new Set(["doc-1"]));
  });

  it("affiche le chargement tant que la structure de métadonnées n'est pas là", () => {
    mockMetadataStructure({ loaded: false });
    renderPage();

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it("affiche le chargement tant que le rapport n'est pas là", () => {
    useSims.mockReturnValue({ isLoading: true, sims: undefined });
    renderPage();

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it("rend le rapport et charge ses propriétaires", async () => {
    renderPage();

    expect(screen.getByText("sims:Rapport")).toBeInTheDocument();
    expect(screen.getByTestId("msd-/operations/sims")).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText("owners:1")).toBeInTheDocument());
    expect(OperationsApi.getOwners).toHaveBeenCalledWith("sims-1");
  });

  it("tolère un rapport absent sans planter", () => {
    useSims.mockReturnValue({ isLoading: false, sims: undefined });
    renderPage();

    expect(screen.getByText("sims:(vide)")).toBeInTheDocument();
  });

  it("publie le rapport", async () => {
    publishSimsMutation.mockResolvedValue({});
    renderPage();

    await userEvent.click(screen.getByRole("button", { name: "publier" }));

    await waitFor(() => expect(publishSimsMutation).toHaveBeenCalledWith({ id: "sims-1" }));
    expect(onPublishError).not.toHaveBeenCalled();
  });

  it("remonte l'échec de publication au rappel d'erreur, sans casser la page", async () => {
    const error = new Error("403");
    publishSimsMutation.mockRejectedValue(error);
    renderPage();

    await userEvent.click(screen.getByRole("button", { name: "publier" }));

    await waitFor(() => expect(onPublishError).toHaveBeenCalledWith(error));
    expect(screen.getByText("sims:Rapport")).toBeInTheDocument();
  });

  it("passe en chargement pendant l'export, puis affiche les documents manquants", async () => {
    let resolveExport: (docs: Set<string>) => void = () => {};
    vi.mocked(OperationsApi.exportSims).mockReturnValue(
      new Promise((resolve) => {
        resolveExport = resolve;
      }) as any,
    );
    renderPage();

    await userEvent.click(screen.getByRole("button", { name: "exporter" }));

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
    expect(OperationsApi.exportSims).toHaveBeenCalledWith("sims-1", "config", true);

    resolveExport(new Set(["doc-1", "doc-2"]));

    await waitFor(() => expect(screen.getByText("missing:doc-1,doc-2")).toBeInTheDocument());
  });

  it("retombe sur des valeurs par défaut quand le loader ne fournit rien", () => {
    loaderData = undefined;
    renderPage();

    expect(screen.getByTestId("msd-")).toBeInTheDocument();
  });
});
