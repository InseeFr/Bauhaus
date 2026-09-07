import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";

import { AppContextProvider } from "../../../../../application/app-context";
import i18n from "../../../../../modules-concepts/i18n";
import { OperationsApi } from "@sdk/operations-api";

import { OperationsSerieEdition } from "./OperationsSerieEdition";

vi.mock("@components/business/stamps-input/stamps-input", () => ({
  OrganisationInput: () => <div />,
}));
vi.mock("@components/business/creators-input", () => ({
  CreatorsInput: () => <div />,
}));
vi.mock("../../../../components/PublishersInput", () => ({
  PublishersInput: () => <div />,
}));

vi.mock("@sdk/operations-api", () => ({
  OperationsApi: {
    postSeries: vi.fn(),
    putSeries: vi.fn(),
  },
}));

const Providers = ({ children }) => (
  <I18nextProvider i18n={i18n}>
    <MemoryRouter>
      <AppContextProvider lg1="fr" lg2="en" version="2.0.0" properties={{}}>
        {children}
      </AppContextProvider>
    </MemoryRouter>
  </I18nextProvider>
);

const defaultProps = {
  families: [],
  series: [],
  indicators: [],
  organisations: [],
  categories: { codes: [] },
  frequencies: { codes: [] },
  extraMandatoryFields: [],
  goBack: vi.fn(),
};

const completeSerie = {
  id: "s1",
  prefLabelLg1: "Série 1",
  prefLabelLg2: "Series 1",
  family: { id: "f1" },
  creators: ["DG75-L201"],
};

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
