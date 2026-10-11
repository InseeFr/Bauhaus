import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useCallback } from "react";

import { OperationsApi } from "@sdk/operations-api";

import { expectItemLoadFailed } from "../../../../tests/loading-error.testing";
import { sdkRejection } from "../../../../tests/sdk-rejection.testing";
import { renderWithLoaderData } from "../../page.testing";
import { CREATE, UPDATE } from "../constants";
import { mockMetadataStructure } from "../metadata-structure.testing";
import { Component } from "./page";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string, { lng }: { lng: string }) => `${key}.${lng}:` }),
}));

vi.mock("@sdk/operations-api", () => ({
  OperationsApi: {
    getIndicatorById: vi.fn(),
    getOperation: vi.fn(),
    getSerie: vi.fn(),
  },
}));

const useSims = vi.fn();
const saveSimsMutation = vi.fn();
const goBack = vi.fn();
vi.mock("../../../hooks/useMetadataStructure");
vi.mock("../../../hooks/useCodelists", () => ({
  useCodelists: () => ({ codelists: {} }),
}));
vi.mock("../../../hooks/useSims", () => ({
  useSims: (id?: string) => useSims(id),
  useSaveSims: () => ({ mutateAsync: saveSimsMutation }),
}));
vi.mock("@utils/hooks/organizations", () => ({
  useOrganizations: () => ({ data: [] }),
}));
vi.mock("@utils/hooks/useGoBack", () => ({
  useGoBack: () => goBack,
}));
vi.mock("../hooks/useDocumentsList", () => ({
  useDocumentsList: () => ({ documentStores: [], setDocumentStores: vi.fn() }),
}));

const onSaved = vi.fn();
const onSaveFailed = vi.fn();

// Le formulaire est remplacé par un pilote : il rend ce que la page lui passe et expose
// `onSubmit`, seul chemin par lequel l'erreur serveur remonte dans le reducer.
vi.mock("./components/AdvancedSimsCreation", () => ({
  AdvancedSimsCreation: ({ parent, sims, idParent, mode, parentType, error, onSubmit }: any) => {
    const submit = useCallback(() => onSubmit({ id: "sims-1" }, onSaved, onSaveFailed), [onSubmit]);
    return (
      <div>
        <span>mode:{mode ?? "(aucun)"}</span>
        <span>parent:{parent?.prefLabelLg1 ?? "(aucun)"}</span>
        <span>idParent:{idParent ?? "(aucun)"}</span>
        <span>parentType:{parentType ?? "(aucun)"}</span>
        <span>titre:{sims.labelLg1 ?? "(aucun)"}</span>
        <span>erreur:{(error as { message?: string } | undefined)?.message ?? "(aucune)"}</span>
        <button onClick={submit}>enregistrer</button>
      </div>
    );
  },
}));
vi.mock("../components/MSDLayout", () => ({
  MSDLayout: ({ children }: any) => <div>{children}</div>,
}));

let loaderData: unknown;

const renderPage = () =>
  renderWithLoaderData(<Component />, loaderData, {
    path: "/series/:idParent/sims/:id",
    url: "/series/parent-1/sims/sims-1",
  });

const renderAndSubmitOnceParentLoaded = async () => {
  renderPage();
  await waitFor(() => expect(screen.getByText("parent:Série FR")).toBeInTheDocument());

  await userEvent.click(screen.getByRole("button", { name: "enregistrer" }));
};

describe("Sims create page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    loaderData = {
      baseUrl: "/operations/sims",
      mode: CREATE,
      disableSectionAnchor: false,
      parentType: "series",
    };
    mockMetadataStructure({ loaded: true });
    useSims.mockReturnValue({ isLoading: false, sims: undefined });
    vi.mocked(OperationsApi.getSerie).mockResolvedValue({
      id: "parent-1",
      prefLabelLg1: "Série FR",
      prefLabelLg2: "Series EN",
    });
  });

  it("charge le parent depuis l'API correspondant à son type, puis rend le formulaire", async () => {
    renderPage();

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();

    await waitFor(() => expect(screen.getByText("parent:Série FR")).toBeInTheDocument());
    expect(OperationsApi.getSerie).toHaveBeenCalledWith("parent-1");
    expect(screen.getByText("mode:CREATE")).toBeInTheDocument();
    expect(screen.getByText("idParent:parent-1")).toBeInTheDocument();
  });

  it("compose le titre du rapport à partir du libellé du parent, en création", async () => {
    renderPage();

    await waitFor(() => expect(screen.getByText("titre:sims.simsTitle.fr:Série FR")).toBeVisible());
  });

  it("charge un indicateur quand c'est le type du parent", async () => {
    loaderData = { mode: CREATE, parentType: "indicator" };
    vi.mocked(OperationsApi.getIndicatorById).mockResolvedValue({ prefLabelLg1: "Indicateur" });
    renderPage();

    await waitFor(() => expect(screen.getByText("parent:Indicateur")).toBeInTheDocument());
    expect(OperationsApi.getSerie).not.toHaveBeenCalled();
  });

  it("charge une opération quand c'est le type du parent", async () => {
    loaderData = { mode: CREATE, parentType: "operation" };
    vi.mocked(OperationsApi.getOperation).mockResolvedValue({ prefLabelLg1: "Opération" });
    renderPage();

    await waitFor(() => expect(screen.getByText("parent:Opération")).toBeInTheDocument());
  });

  it("n'appelle aucune API quand le type de parent est inconnu, et sort du chargement", async () => {
    loaderData = { mode: CREATE, parentType: "inconnu" };
    renderPage();

    await waitFor(() => expect(screen.getByText("parent:(aucun)")).toBeInTheDocument());
    expect(OperationsApi.getSerie).not.toHaveBeenCalled();
    expect(OperationsApi.getOperation).not.toHaveBeenCalled();
    expect(OperationsApi.getIndicatorById).not.toHaveBeenCalled();
  });

  it("en modification, lit le parent dans le rapport existant plutôt que dans l'URL", async () => {
    loaderData = { mode: UPDATE };
    useSims.mockReturnValue({
      isLoading: false,
      sims: {
        id: "sims-1",
        labelLg1: "Rapport existant",
        idOperation: "op-9",
      },
    });
    vi.mocked(OperationsApi.getOperation).mockResolvedValue({ prefLabelLg1: "Opération 9" });
    renderPage();

    await waitFor(() => expect(screen.getByText("titre:Rapport existant")).toBeInTheDocument());
    expect(screen.getByText("idParent:op-9")).toBeInTheDocument();
    expect(screen.getByText("parentType:operation")).toBeInTheDocument();
    expect(useSims).toHaveBeenCalledWith("sims-1");
  });

  it("en création, ne demande pas de rapport existant", async () => {
    renderPage();

    await waitFor(() => expect(useSims).toHaveBeenCalledWith(undefined));
  });

  it("affiche le chargement tant que la structure de métadonnées n'est pas là", async () => {
    mockMetadataStructure({ loaded: false });
    renderPage();

    await waitFor(() => expect(OperationsApi.getSerie).toHaveBeenCalled());
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it("affiche le chargement tant que le rapport à modifier n'est pas là", async () => {
    loaderData = { mode: UPDATE };
    useSims.mockReturnValue({ isLoading: true, sims: undefined });
    renderPage();

    await waitFor(() => expect(screen.getByText(/Loading/i)).toBeInTheDocument());
  });

  it("en modification, indique l'échec de lecture du rapport au lieu d'un formulaire vide", async () => {
    loaderData = { mode: UPDATE };
    useSims.mockReturnValue({
      isLoading: false,
      sims: undefined,
      error: sdkRejection.emptyBody(500),
    });
    renderPage();

    await expectItemLoadFailed();
    expect(screen.queryByRole("button", { name: "enregistrer" })).not.toBeInTheDocument();
  });

  it("appelle le rappel de succès quand l'enregistrement passe", async () => {
    saveSimsMutation.mockResolvedValue("sims-1");

    await renderAndSubmitOnceParentLoaded();

    await waitFor(() => expect(onSaved).toHaveBeenCalledWith("sims-1"));
    expect(screen.getByText("erreur:(aucune)")).toBeInTheDocument();
  });

  it("passe l'erreur serveur au formulaire quand l'enregistrement échoue", async () => {
    saveSimsMutation.mockRejectedValue(
      sdkRejection.json(500, {
        message: "The report could not be created.",
        code: "SIMS_CREATION_FAILED",
      }),
    );

    await renderAndSubmitOnceParentLoaded();

    await waitFor(() =>
      expect(screen.getByText("erreur:The report could not be created.")).toBeInTheDocument(),
    );
    expect(onSaveFailed).toHaveBeenCalled();
    expect(onSaved).not.toHaveBeenCalled();
  });

  it("retombe sur des valeurs par défaut quand le loader ne fournit rien", async () => {
    loaderData = undefined;
    renderPage();

    await waitFor(() => expect(screen.getByText("mode:(aucun)")).toBeInTheDocument());
  });
});
