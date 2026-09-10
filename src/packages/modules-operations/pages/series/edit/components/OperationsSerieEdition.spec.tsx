import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { PropsWithChildren } from "react";
import { I18nextProvider } from "react-i18next";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";

import { OperationsApi } from "@sdk/operations-api";

import { AppContextProvider } from "../../../../../application/app-context";
import { operationsI18n } from "../../../../i18n";
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

vi.mock("@sdk/operations-api", () => ({
  OperationsApi: {
    postSeries: vi.fn(),
    putSeries: vi.fn(),
  },
}));

const Providers = ({ children }: PropsWithChildren) => (
  <I18nextProvider i18n={operationsI18n}>
    <MemoryRouter>
      <AppContextProvider lg1="fr" lg2="en" version="2.0.0" properties={{} as any}>
        {children}
      </AppContextProvider>
    </MemoryRouter>
  </I18nextProvider>
);

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

const renderEdition = (props = {}) =>
  render(<OperationsSerieEdition {...defaultProps} serie={completeSerie} {...props} />, {
    wrapper: Providers,
  });

describe("OperationsSerieEdition", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("reinitialise le formulaire quand la serie affichee change", () => {
    const { rerender } = render(
      <OperationsSerieEdition {...defaultProps} serie={{ id: "1", prefLabelLg1: "Série 1" }} />,
      { wrapper: Providers },
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
      { wrapper: Providers },
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

    await waitFor(() => expect(OperationsApi.putSeries).toHaveBeenCalled());
    expect(defaultProps.goBack).toHaveBeenCalledWith("/operations/series/s1", false);
  });

  it("crée une série puis ouvre la fiche renvoyée par le serveur", async () => {
    OperationsApi.postSeries.mockResolvedValue("s2");
    renderEdition({ serie: { ...completeSerie, id: undefined } });

    fireEvent.click(screen.getByRole("button", { name: /save|sauvegarder/i }));

    await waitFor(() => expect(OperationsApi.postSeries).toHaveBeenCalled());
    expect(defaultProps.goBack).toHaveBeenCalledWith("/operations/series/s2", true);
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

  // Le libellé est tantôt le parent direct de la liste, tantôt son voisin dans le
  // groupe de champs : on retient celui des deux qui la contient.
  const fieldLabelled = (label: string | RegExp) => {
    const node = screen.getByText(label);
    const holder = [node.closest("label"), node.closest(".form-group")].find((el) =>
      el?.querySelector(".p-dropdown, .p-multiselect"),
    )!;
    return holder.querySelector<HTMLElement>(".p-dropdown, .p-multiselect")!;
  };

  // Une liste PrimeReact s'ouvre au clic sur son champ et pose son panneau en fin
  // de document ; le clic suivant hors du panneau le referme.
  const chooseIn = (label: string | RegExp, option: string) => {
    fireEvent.click(fieldLabelled(label));
    const items = screen.getAllByText(option);
    fireEvent.click(items[items.length - 1]);
    fireEvent.mouseDown(document.body);
  };

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
