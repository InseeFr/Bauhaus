import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { PropsWithChildren } from "react";
import { I18nextProvider } from "react-i18next";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";

import { OperationsApi } from "@sdk/operations-api";

import { AppContextProvider } from "../../../../../application/app-context";
import { operationsI18n } from "../../../../i18n";
import { OperationsIndicatorEdition } from "./OperationsIndicatorEdition";

vi.mock("@components/business/stamps-input/stamps-input", () => ({
  OrganizationInput: () => <div />,
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

const Providers = ({ children }: PropsWithChildren) => (
  <I18nextProvider i18n={operationsI18n}>
    <MemoryRouter>
      <AppContextProvider lg1="fr" lg2="en" version="2.0.0" properties={{} as any}>
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
} as any;

const defaultProps = {
  frequencies: { codes: [{ code: "A", labelLg1: "Annuelle" }] },
  indicators: [
    { id: "i1", label: "Indicateur 1" },
    { id: "other", label: "Autre indicateur" },
  ],
  series: [
    { id: "s1", label: "Série 1" },
    { id: "s2", label: "Autre série" },
  ],
  goBack: vi.fn(),
} as any;

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

describe("OperationsIndicatorEdition — champs à choix", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    OperationsApi.updateIndicator.mockResolvedValue(undefined);
  });

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

  const saveAndRead = async () => {
    fireEvent.click(saveButton());
    await waitFor(() => expect(OperationsApi.updateIndicator).toHaveBeenCalled());
    return OperationsApi.updateIndicator.mock.calls[0][0];
  };

  it("enregistre la fréquence de diffusion choisie", async () => {
    renderEdition();

    chooseIn("Fréquence de diffusion", "Annuelle");

    expect(await saveAndRead()).toEqual(expect.objectContaining({ accrualPeriodicityCode: "A" }));
  });

  it("n'offre pas l'indicateur courant parmi les indicateurs liés", () => {
    renderEdition();

    fireEvent.click(fieldLabelled("Succède à"));
    const panel = document.querySelector<HTMLElement>(".p-multiselect-panel")!;

    expect(within(panel).getByText("Autre indicateur")).toBeInTheDocument();
    expect(within(panel).queryByText("Indicateur 1")).not.toBeInTheDocument();
  });

  it("enregistre les indicateurs et séries liés sous forme de liens", async () => {
    renderEdition();

    chooseIn("Succède à", "Autre indicateur");
    chooseIn("Est remplacé par", "Autre indicateur");
    chooseIn("Produit de", "Autre série");
    chooseIn("Séries ou Indicateurs liés", "series - Série 1");

    expect(await saveAndRead()).toEqual(
      expect.objectContaining({
        replaces: [{ id: "other", type: "indicator" }],
        isReplacedBy: [{ id: "other", type: "indicator" }],
        wasGeneratedBy: [
          { id: "s1", type: "series" },
          { id: "s2", type: "series" },
        ],
        seeAlso: [{ id: "s1", type: "series" }],
      }),
    );
  });

  it("réaffiche les liens déjà enregistrés comme de simples identifiants", async () => {
    renderEdition({
      indicator: {
        ...completeIndicator,
        seeAlso: [{ id: "s1", type: "series" }],
        replaces: [{ id: "other", type: "indicator" }],
        isReplacedBy: [{ id: "other", type: "indicator" }],
      },
    });

    expect(screen.getAllByText("Autre indicateur")).not.toHaveLength(0);
    expect(await saveAndRead()).toEqual(
      expect.objectContaining({ replaces: [{ id: "other", type: "indicator" }] }),
    );
  });
});
