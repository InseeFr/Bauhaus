import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";

import { OperationsApi } from "@sdk/operations-api";

import { AppContextProvider } from "../../../../../application/app-context";
import i18n from "../../../../../modules-concepts/i18n";
import { OperationsIndicatorEdition } from "./OperationsIndicatorEdition";

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
    createIndicator: vi.fn(),
    updateIndicator: vi.fn(),
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

const completeIndicator = {
  id: "i1",
  prefLabelLg1: "Indicateur 1",
  prefLabelLg2: "Indicator 1",
  creators: ["DG75-L201"],
  wasGeneratedBy: [{ id: "s1", type: "series" }],
};

const defaultProps = {
  frequencies: { codes: [] },
  indicators: [],
  series: [],
  organisations: [],
  goBack: vi.fn(),
};

const renderEdition = (props = {}) =>
  render(
    <OperationsIndicatorEdition {...defaultProps} indicator={completeIndicator} {...props} />,
    {
      wrapper: Providers,
    },
  );

const saveButton = () => screen.getByRole("button", { name: /save|sauvegarder/i });

describe("OperationsIndicatorEdition", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("réinitialise le formulaire quand l'indicateur affiché change", () => {
    const { rerender } = renderEdition();

    expect(screen.getByDisplayValue("Indicateur 1")).toBeInTheDocument();

    rerender(
      <OperationsIndicatorEdition
        {...defaultProps}
        indicator={{ ...completeIndicator, id: "i2", prefLabelLg1: "Indicateur 2" }}
      />,
    );

    expect(screen.getByDisplayValue("Indicateur 2")).toBeInTheDocument();
  });

  it("conserve les saisies en cours quand l'indicateur affiché ne change pas", () => {
    const { rerender } = renderEdition();

    rerender(
      <OperationsIndicatorEdition
        {...defaultProps}
        indicator={{ ...completeIndicator, prefLabelLg1: "Renommé ailleurs" }}
      />,
    );

    expect(screen.getByDisplayValue("Indicateur 1")).toBeInTheDocument();
  });

  it("reporte la saisie de l'utilisateur dans le formulaire", () => {
    renderEdition();

    fireEvent.change(screen.getByDisplayValue("Indicateur 1"), {
      target: { value: "Indicateur renommé" },
    });

    expect(screen.getByDisplayValue("Indicateur renommé")).toBeInTheDocument();
  });

  it("enregistre un indicateur existant puis revient sur sa fiche", async () => {
    OperationsApi.updateIndicator.mockResolvedValue(undefined);
    renderEdition();

    fireEvent.click(saveButton());

    await waitFor(() => expect(OperationsApi.updateIndicator).toHaveBeenCalled());
    expect(defaultProps.goBack).toHaveBeenCalledWith("/operations/indicator/i1", false);
  });

  it("crée un indicateur puis ouvre la fiche renvoyée par le serveur", async () => {
    OperationsApi.createIndicator.mockResolvedValue("i2");
    renderEdition({ indicator: { ...completeIndicator, id: undefined } });

    fireEvent.click(saveButton());

    await waitFor(() => expect(OperationsApi.createIndicator).toHaveBeenCalled());
    expect(defaultProps.goBack).toHaveBeenCalledWith("/operations/indicator/i2", true);
  });

  it("affiche les erreurs de saisie et n'appelle pas le serveur", async () => {
    renderEdition({ indicator: { id: "i1", prefLabelLg1: "", prefLabelLg2: "" } });

    fireEvent.click(saveButton());

    expect(await screen.findByRole("alert")).toBeInTheDocument();
    expect(OperationsApi.updateIndicator).not.toHaveBeenCalled();
  });

  it("affiche l'erreur renvoyée par le serveur", async () => {
    OperationsApi.updateIndicator.mockRejectedValue("Erreur serveur");
    renderEdition();

    fireEvent.click(saveButton());

    expect(await screen.findByText("Erreur serveur")).toBeInTheDocument();
    expect(defaultProps.goBack).not.toHaveBeenCalled();
  });

  it("n'affiche pas le titre de page tant que l'indicateur n'est pas créé", () => {
    renderEdition({ indicator: { ...completeIndicator, id: undefined } });

    expect(screen.queryByRole("heading", { name: /Indicateur 1/ })).toBeNull();
  });
});
