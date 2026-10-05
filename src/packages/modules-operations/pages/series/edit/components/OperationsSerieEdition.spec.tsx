import { QueryClient } from "@tanstack/react-query";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";

import { OperationsApi } from "@sdk/operations-api";

import { chooseIn, editionProvidersWith } from "../../../edition-form.testing";
import { OperationsSerieEdition } from "./OperationsSerieEdition";

// Seule la source des organizations est simulée : les listes déroulantes qui s'en
// servent (éditeur, contributeur, collecteur, propriétaire) sont bien celles de
// l'application.
vi.mock("@utils/hooks/organizations", () => ({
  useOrganizations: () => ({
    data: [
      { iri: "http://org/insee", label: "Insee" },
      { iri: "http://org/dares", label: "Dares" },
    ],
  }),
}));

vi.mock("@utils/hooks/themes", () => ({
  useThemes: () => ({
    data: [
      { value: "http://bauhaus/concepts/theme/agr", label: "Agriculture" },
      { value: "http://bauhaus/concepts/theme/eco", label: "Économie" },
    ],
  }),
}));

vi.mock("@sdk/operations-api", () => ({
  OperationsApi: {
    postSeries: vi.fn(),
    putSeries: vi.fn(),
  },
}));

const defaultProps = {
  families: [
    { id: "f1", label: "Famille 1" },
    { id: "f2", label: "Famille 2" },
  ],
  series: [
    { id: "s1", label: "Série 1" },
    { id: "other", label: "Autre série" },
  ],
  indicators: [{ id: "i1", label: "Indicateur 1" }],
  organizations: [],
  categories: { codes: [{ code: "S", labelLg1: "Enquête" }] },
  frequencies: { codes: [{ code: "A", labelLg1: "Annuelle" }] },
  extraMandatoryFields: [],
  goBack: vi.fn(),
} as any;

const completeSerie = {
  id: "s1",
  prefLabelLg1: "Série 1",
  prefLabelLg2: "Series 1",
  family: { id: "f1" },
  creators: ["DG75-L201"],
} as any;

const renderEdition = (props = {}, queryClient?: QueryClient) =>
  render(<OperationsSerieEdition {...defaultProps} serie={completeSerie} {...props} />, {
    wrapper: editionProvidersWith(queryClient),
  });

describe("OperationsSerieEdition", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("reinitialise le formulaire quand la serie affichee change", () => {
    const { rerender } = render(
      <OperationsSerieEdition {...defaultProps} serie={{ id: "1", prefLabelLg1: "Série 1" }} />,
      { wrapper: editionProvidersWith() },
    );

    expect(screen.getByDisplayValue("Série 1")).toBeInTheDocument();

    rerender(
      <OperationsSerieEdition {...defaultProps} serie={{ id: "2", prefLabelLg1: "Série 2" }} />,
    );

    expect(screen.getByDisplayValue("Série 2")).toBeInTheDocument();
    expect(screen.queryByDisplayValue("Série 1")).not.toBeInTheDocument();
  });

  it("conserve les saisies en cours quand la serie affichee ne change pas", () => {
    const { rerender } = render(
      <OperationsSerieEdition {...defaultProps} serie={{ id: "1", prefLabelLg1: "Série 1" }} />,
      { wrapper: editionProvidersWith() },
    );

    rerender(
      <OperationsSerieEdition
        {...defaultProps}
        serie={{ id: "1", prefLabelLg1: "Série 1 renommée ailleurs" }}
      />,
    );

    expect(screen.getByDisplayValue("Série 1")).toBeInTheDocument();
  });
});

describe("OperationsSerieEdition — saisie et enregistrement", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("reporte la saisie de l'utilisateur dans le formulaire", () => {
    renderEdition();

    fireEvent.change(screen.getByDisplayValue("Série 1"), {
      target: { id: "prefLabelLg1", value: "Série renommée" },
    });

    expect(screen.getByDisplayValue("Série renommée")).toBeInTheDocument();
  });

  it("enregistre une série existante puis revient sur sa fiche", async () => {
    OperationsApi.putSeries.mockResolvedValue(undefined);
    renderEdition();

    fireEvent.click(screen.getByRole("button", { name: /save|sauvegarder/i }));

    await waitFor(() =>
      expect(defaultProps.goBack).toHaveBeenCalledWith("/operations/series/s1", false),
    );
  });

  it("périme les indicateurs en cache, qui affichent le libellé de leurs séries", async () => {
    const queryClient = new QueryClient();
    queryClient.setQueryData(["indicators", "i1"], { id: "i1" });
    let invalidatedAtGoBack: boolean | undefined;
    defaultProps.goBack.mockImplementationOnce(() => {
      invalidatedAtGoBack = queryClient.getQueryState(["indicators", "i1"])?.isInvalidated;
    });
    OperationsApi.putSeries.mockResolvedValue(undefined);
    renderEdition({}, queryClient);

    fireEvent.click(screen.getByRole("button", { name: /save|sauvegarder/i }));

    await waitFor(() => expect(defaultProps.goBack).toHaveBeenCalled());
    expect(invalidatedAtGoBack).toBe(true);
  });

  it("périme la série en cache avant de revenir sur sa fiche", async () => {
    const queryClient = new QueryClient();
    queryClient.setQueryData(["series", "s1"], { id: "s1" });
    let invalidatedAtGoBack: boolean | undefined;
    defaultProps.goBack.mockImplementationOnce(() => {
      invalidatedAtGoBack = queryClient.getQueryState(["series", "s1"])?.isInvalidated;
    });
    OperationsApi.putSeries.mockResolvedValue(undefined);
    renderEdition({}, queryClient);

    fireEvent.click(screen.getByRole("button", { name: /save|sauvegarder/i }));

    await waitFor(() => expect(defaultProps.goBack).toHaveBeenCalled());
    expect(invalidatedAtGoBack).toBe(true);
  });

  it("ne réaffiche pas le formulaire pendant le retour sur la fiche après l'enregistrement", async () => {
    // La navigation de goBack est asynchrone (navigate(-1), route chargée à la demande) : tant
    // qu'elle n'a pas abouti, le composant reste monté et ne doit pas repasser sur le formulaire.
    OperationsApi.putSeries.mockResolvedValue(undefined);
    renderEdition();

    fireEvent.click(screen.getByRole("button", { name: /save|sauvegarder/i }));

    await waitFor(() => expect(defaultProps.goBack).toHaveBeenCalled());
    await act(async () => {});
    expect(screen.queryByRole("button", { name: /save|sauvegarder/i })).not.toBeInTheDocument();
  });

  it("crée une série puis ouvre la fiche renvoyée par le serveur", async () => {
    OperationsApi.postSeries.mockResolvedValue("s2");
    renderEdition({ serie: { ...completeSerie, id: undefined } });

    fireEvent.click(screen.getByRole("button", { name: /save|sauvegarder/i }));

    await waitFor(() =>
      expect(defaultProps.goBack).toHaveBeenCalledWith("/operations/series/s2", true),
    );
  });

  it("affiche les erreurs de saisie et n'appelle pas le serveur", async () => {
    renderEdition({ serie: { id: "s1", prefLabelLg1: "", prefLabelLg2: "" } });

    fireEvent.click(screen.getByRole("button", { name: /save|sauvegarder/i }));

    expect(await screen.findByRole("alert")).toBeInTheDocument();
    expect(OperationsApi.putSeries).not.toHaveBeenCalled();
  });

  it("affiche l'erreur renvoyée par le serveur", async () => {
    OperationsApi.putSeries.mockRejectedValue("Erreur serveur");
    renderEdition();

    fireEvent.click(screen.getByRole("button", { name: /save|sauvegarder/i }));

    expect(await screen.findByText("Erreur serveur")).toBeInTheDocument();
    expect(defaultProps.goBack).not.toHaveBeenCalled();
  });

  it("affiche une erreur de validation du serveur sous le champ concerné", async () => {
    OperationsApi.putSeries.mockRejectedValue({
      status: 400,
      errors: [{ field: "prefLabelLg1", message: "prefLabelLg1 is required" }],
    });
    renderEdition();

    fireEvent.click(screen.getByRole("button", { name: /save|sauvegarder/i }));

    const input = await screen.findByDisplayValue("Série 1");
    await waitFor(() => expect(input).toHaveAccessibleDescription("prefLabelLg1 is required"));
    expect(input).toHaveAttribute("aria-invalid", "true");
  });

  it("n'affiche pas d'erreur générique quand toutes les erreurs du serveur sont sous leur champ", async () => {
    OperationsApi.putSeries.mockRejectedValue({
      status: 400,
      errors: [{ field: "prefLabelLg1", message: "prefLabelLg1 is required" }],
    });
    renderEdition();

    fireEvent.click(screen.getByRole("button", { name: /save|sauvegarder/i }));

    const input = await screen.findByDisplayValue("Série 1");
    await waitFor(() => expect(input).toHaveAccessibleDescription("prefLabelLg1 is required"));
    expect(screen.queryByText(/An error has occurred|Une erreur s'est produite/)).toBeNull();
  });

  it("affiche dans le bandeau une erreur du serveur sur un champ absent du formulaire", async () => {
    OperationsApi.putSeries.mockRejectedValue({
      status: 400,
      errors: [{ field: "created", message: "is not a valid LocalDate" }],
    });
    renderEdition();

    fireEvent.click(screen.getByRole("button", { name: /save|sauvegarder/i }));

    expect(await screen.findByText("created : is not a valid LocalDate")).toBeInTheDocument();
  });

  it("revient à la liste des séries quand on annule", () => {
    renderEdition();

    fireEvent.click(screen.getByRole("button", { name: /cancel|annuler/i }));

    expect(defaultProps.goBack).toHaveBeenCalledWith("/operations/series");
  });

  it("affiche les liens de la série sous forme d'identifiants", () => {
    renderEdition({
      serie: {
        ...completeSerie,
        seeAlso: [{ id: "sa1" }],
        contributors: [{ id: "c1" }],
        replaces: [{ id: "r1" }],
        isReplacedBy: [{ id: "rb1" }],
        generate: [{ id: "g1" }],
        dataCollectors: [{ id: "dc1" }],
        publishers: [{ id: "p1" }],
      },
      series: [{ id: "other", prefLabelLg1: "Autre série" }],
      indicators: [],
    });

    expect(screen.getByDisplayValue("Série 1")).toBeInTheDocument();
  });
});

describe("OperationsSerieEdition — champs à choix", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    OperationsApi.putSeries.mockResolvedValue(undefined);
    OperationsApi.postSeries.mockResolvedValue("s9");
  });

  const saveAndRead = async (api: "putSeries" | "postSeries" = "putSeries") => {
    fireEvent.click(screen.getByRole("button", { name: /save|sauvegarder/i }));
    await waitFor(() => expect(OperationsApi[api]).toHaveBeenCalled());
    return OperationsApi[api].mock.calls[0][0];
  };

  it("rattache la série à la famille choisie", async () => {
    renderEdition({ serie: { ...completeSerie, id: undefined, family: undefined } });

    chooseIn("Family", "Famille 2");

    expect(await saveAndRead("postSeries")).toEqual(
      expect.objectContaining({ family: { id: "f2" } }),
    );
  });

  it("enregistre le type d'opération et la fréquence de collecte choisis", async () => {
    renderEdition();

    chooseIn("Type d'opération", "Enquête");
    chooseIn("Fréquence de collecte des données", "Annuelle");

    expect(await saveAndRead()).toEqual(
      expect.objectContaining({ typeCode: "S", accrualPeriodicityCode: "A" }),
    );
  });

  it("enregistre les séries liées sous forme de liens", async () => {
    renderEdition();

    chooseIn("Succède à", "Autre série");
    chooseIn("Est remplacée par", "Autre série");
    chooseIn("Séries ou Indicateurs liés", "indicator - Indicateur 1");

    expect(await saveAndRead()).toEqual(
      expect.objectContaining({
        replaces: [{ id: "other", type: "series" }],
        isReplacedBy: [{ id: "other", type: "series" }],
        seeAlso: [expect.objectContaining({ id: "i1" })],
      }),
    );
  });

  it("enregistre les organizations choisies sous forme de liens", async () => {
    renderEdition();

    chooseIn("Organismes responsables", "Insee");
    chooseIn("Partenaires", "Dares");
    chooseIn("Services collecteurs", "Insee");

    expect(await saveAndRead()).toEqual(
      expect.objectContaining({
        publishers: [{ id: "http://org/insee" }],
        contributors: [{ id: "http://org/dares" }],
        dataCollectors: [{ id: "http://org/insee" }],
      }),
    );
  });

  it("ajoute le thème choisi à ceux déjà enregistrés", async () => {
    renderEdition({
      serie: { ...completeSerie, themes: ["http://bauhaus/concepts/theme/agr"] },
    });

    chooseIn("Thèmes", "Économie");

    expect(await saveAndRead()).toEqual(
      expect.objectContaining({
        themes: ["http://bauhaus/concepts/theme/agr", "http://bauhaus/concepts/theme/eco"],
      }),
    );
  });

  it("ajoute le propriétaire choisi à ceux déjà enregistrés", async () => {
    renderEdition();

    chooseIn(/Owners/, "Dares");

    expect(await saveAndRead()).toEqual(
      expect.objectContaining({
        creators: expect.arrayContaining(["DG75-L201", "http://org/dares"]),
      }),
    );
  });
});

describe("OperationsSerieEdition — textes longs", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    OperationsApi.putSeries.mockResolvedValue(undefined);
  });

  // Chaque éditeur markdown ne remonte sa valeur qu'à la sortie du champ.
  const clearEditorOf = (label: string) => {
    const group = screen.getByText(label).closest(".form-group")!;
    fireEvent.click(group.querySelector('[title="Delete"]')!);
    fireEvent.blur(group.querySelector(".public-DraftEditor-content")!);
  };

  it("enregistre le résumé et l'historique vidés par l'utilisateur", async () => {
    renderEdition({
      serie: {
        ...completeSerie,
        abstractLg1: "Un résumé",
        abstractLg2: "A summary",
        historyNoteLg1: "Un historique",
        historyNoteLg2: "A history",
      },
    });

    clearEditorOf("Résumé");
    clearEditorOf("Summary");
    clearEditorOf("Historique");
    clearEditorOf("History");

    fireEvent.click(screen.getByRole("button", { name: /save|sauvegarder/i }));
    await waitFor(() => expect(OperationsApi.putSeries).toHaveBeenCalled());

    expect(OperationsApi.putSeries.mock.calls[0][0]).toEqual(
      expect.objectContaining({
        abstractLg1: "",
        abstractLg2: "",
        historyNoteLg1: "",
        historyNoteLg2: "",
      }),
    );
  });
});
