import { screen, fireEvent } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { renderOnRoute } from "../../../testing/render.testing";
import { Component } from "./page";

vi.mock("../../../hooks/useClassification", () => ({
  useClassification: vi.fn(),
}));

vi.mock("../../../hooks/useClassificationSeries", () => ({
  useClassificationSeries: vi.fn(),
}));

vi.mock("../../../hooks/useUpdateClassification", () => ({
  useUpdateClassification: vi.fn(),
}));

vi.mock("@utils/hooks/organizations", () => ({
  useOrganizationsOptions: vi.fn(() => []),
}));

vi.mock("@utils/hooks/useTitle", () => ({
  useTitle: vi.fn(),
}));

vi.mock("../../../../utils/transformer", () => ({
  transformModelToSelectOptions: vi.fn(() => []),
}));

vi.mock("./components/ClassificationSelect", () => ({
  ClassificationSelect: () => <select data-testid="classification-select" />,
}));

vi.mock("@components/select-rmes", () => ({
  Select: () => <select data-testid="select" />,
}));

vi.mock("@components/form/input", () => ({
  TextInputBlock: ({ label, value, onChange }: any) => (
    <input aria-label={label} value={value ?? ""} onChange={onChange} />
  ),
  UrlInputBlock: ({ label, value, onChange }: any) => (
    <input aria-label={label} value={value ?? ""} onChange={onChange} />
  ),
}));

vi.mock("@components/rich-editor/react-md-editor", () => ({
  MDEditor: () => <div data-testid="md-editor" />,
}));

vi.mock("@components/loading", () => import("../../../testing/component-mocks.testing"));

vi.mock("@components/page-title-block", () => import("../../../testing/component-mocks.testing"));

vi.mock("@components/errors-bloc", () => ({
  GlobalClientSideErrorBloc: ({ clientSideErrors }: any) => (
    <div data-testid="errors-bloc">{clientSideErrors?.join(", ")}</div>
  ),
}));

vi.mock("@components/layout", () => import("../../../testing/component-mocks.testing"));

vi.mock("@components/label-required", () => ({
  default: ({ children }: any) => <label>{children}</label>,
}));

vi.mock("@components/dissemination-status/disseminationStatus", () => ({
  DisseminationStatusInput: () => <select data-testid="dissemination-select" />,
}));

vi.mock("@components/business/contributors-input/contributors-input", () => ({
  ContributorsInput: () => <div data-testid="contributors-input" />,
}));

vi.mock("@components/business/creators-input", () => ({
  CreatorsInput: () => <div data-testid="creators-input" />,
}));

vi.mock("./menu", () => ({
  Menu: ({ disabled }: any) => (
    <button data-testid="menu" disabled={disabled}>
      Menu
    </button>
  ),
}));

vi.mock("./validation", () => ({
  validate: vi.fn(),
}));

import * as classificationHook from "../../../hooks/useClassification";
import * as classificationSeriesHook from "../../../hooks/useClassificationSeries";
import * as updateClassificationHook from "../../../hooks/useUpdateClassification";
import * as validation from "./validation";

const mockClassification = {
  general: {
    id: "coicop2016",
    prefLabelLg1: "Classification COICOP 2016",
    prefLabelLg2: "COICOP 2016 Classification",
    altLabelLg1: "",
    altLabelLg2: "",
    descriptionLg1: "Description FR",
    descriptionLg2: "Description EN",
    disseminationStatus: "http://bauhaus/codes/base/statutDiffusion/PublicGenerique",
    creator: "DG75-F610",
    contributor: "HIE2000256",
    idSeries: "coicop",
    idAfter: "coicop1998",
    seriesLg1: "COICOP",
    afterLg1: "COICOP 1998",
    issued: "2016-01-01T00:00:00.000+01:00",
    lastRefreshedOn: "2016-01-01T00:00:00.000+01:00",
  },
  levels: [],
};

const renderComponent = (id = "coicop2016") =>
  renderOnRoute(
    <Component />,
    "/classifications/classification/:id",
    `/classifications/classification/${id}`,
  );

const mockUseClassification = (value: Record<string, unknown>) =>
  (classificationHook.useClassification as any).mockReturnValue(value);

const mockLoadedClassification = () =>
  mockUseClassification({
    isLoading: false,
    classification: mockClassification,
    status: "success",
  });

const mockUpdateClassification = (overrides: Record<string, unknown> = {}) =>
  (updateClassificationHook.useUpdateClassification as any).mockReturnValue({
    save: vi.fn(),
    isSavingSuccess: false,
    isSaving: false,
    ...overrides,
  });

describe("<Component />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (classificationSeriesHook.useClassificationSeries as any).mockReturnValue({ series: [] });
    mockUpdateClassification();
  });

  it("affiche Loading quand isLoading est true", () => {
    mockUseClassification({
      isLoading: true,
      classification: undefined,
      status: "loading",
    });
    renderComponent();
    expect(screen.getByText("Loading")).toBeInTheDocument();
  });

  it("affiche Saving quand isSaving est true", () => {
    mockLoadedClassification();
    mockUpdateClassification({ isSaving: true });
    renderComponent();
    expect(screen.getByText("Saving")).toBeInTheDocument();
  });

  it("redirige vers la page de visualisation quand isSavingSuccess est true", () => {
    mockLoadedClassification();
    mockUpdateClassification({ isSavingSuccess: true });
    renderComponent();
    expect(screen.queryByRole("form")).not.toBeInTheDocument();
  });

  it("affiche le formulaire avec les valeurs de la classification", () => {
    mockLoadedClassification();
    renderComponent();

    expect(screen.getByDisplayValue("Classification COICOP 2016")).toBeInTheDocument();
    expect(screen.getByDisplayValue("COICOP 2016 Classification")).toBeInTheDocument();
  });

  it("affiche le titre de la page", () => {
    mockLoadedClassification();
    renderComponent();
    expect(screen.getByRole("heading")).toHaveTextContent("Classification COICOP 2016");
  });

  it("affiche les erreurs de validation quand le formulaire est soumis avec des données invalides", () => {
    mockLoadedClassification();
    (validation.validate as any).mockReturnValue({
      errorMessage: ["Champ requis"],
      fields: { prefLabelLg1: "Champ requis" },
    });

    const { container } = renderComponent();
    fireEvent.submit(container.querySelector("form")!);

    expect(screen.getByTestId("errors-bloc")).toBeInTheDocument();
  });

  it("appelle save quand le formulaire est soumis avec des données valides", () => {
    const save = vi.fn();
    mockLoadedClassification();
    mockUpdateClassification({ save });
    (validation.validate as any).mockReturnValue({ errorMessage: [], fields: {} });

    const { container } = renderComponent();
    fireEvent.submit(container.querySelector("form")!);

    expect(save).toHaveBeenCalledTimes(1);
    expect(save).toHaveBeenCalledWith(
      expect.objectContaining({
        general: expect.objectContaining({ id: "coicop2016" }),
      }),
    );
  });

  it("ne rend rien si value.general est absent", () => {
    mockUseClassification({
      isLoading: false,
      classification: undefined,
      status: "idle",
    });
    const { container } = renderComponent();
    expect(container).toBeEmptyDOMElement();
  });
});
