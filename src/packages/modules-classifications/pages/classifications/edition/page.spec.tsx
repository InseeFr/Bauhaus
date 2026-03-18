import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Component } from "./page";

vi.mock("../../../hooks", () => ({
  useClassification: vi.fn(),
  useSeries: vi.fn(),
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

vi.mock("@components/loading", () => ({
  Loading: () => <div>Loading</div>,
  Saving: () => <div>Saving</div>,
}));

vi.mock("@components/page-title-block", () => ({
  PageTitleBlock: ({ titleLg1 }: any) => <h1>{titleLg1}</h1>,
}));

vi.mock("@components/errors-bloc", () => ({
  GlobalClientSideErrorBloc: ({ clientSideErrors }: any) => (
    <div data-testid="errors-bloc">{clientSideErrors?.join(", ")}</div>
  ),
}));

vi.mock("@components/layout", () => ({
  Row: ({ children }: any) => <div>{children}</div>,
}));

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

import * as hooks from "../../../hooks";
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

const renderComponent = (id = "coicop2016") => {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[`/classifications/classification/${id}`]}>
        <Routes>
          <Route path="/classifications/classification/:id" element={<Component />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
};

describe("<Component />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (hooks.useSeries as any).mockReturnValue({ series: [] });
    (hooks.useUpdateClassification as any).mockReturnValue({
      save: vi.fn(),
      isSavingSuccess: false,
      isSaving: false,
    });
  });

  it("affiche Loading quand isLoading est true", () => {
    (hooks.useClassification as any).mockReturnValue({
      isLoading: true,
      classification: undefined,
      status: "loading",
    });
    renderComponent();
    expect(screen.getByText("Loading")).toBeInTheDocument();
  });

  it("affiche Saving quand isSaving est true", () => {
    (hooks.useClassification as any).mockReturnValue({
      isLoading: false,
      classification: mockClassification,
      status: "success",
    });
    (hooks.useUpdateClassification as any).mockReturnValue({
      save: vi.fn(),
      isSavingSuccess: false,
      isSaving: true,
    });
    renderComponent();
    expect(screen.getByText("Saving")).toBeInTheDocument();
  });

  it("redirige vers la page de visualisation quand isSavingSuccess est true", () => {
    (hooks.useClassification as any).mockReturnValue({
      isLoading: false,
      classification: mockClassification,
      status: "success",
    });
    (hooks.useUpdateClassification as any).mockReturnValue({
      save: vi.fn(),
      isSavingSuccess: true,
      isSaving: false,
    });
    renderComponent();
    expect(screen.queryByRole("form")).not.toBeInTheDocument();
  });

  it("affiche le formulaire avec les valeurs de la classification", () => {
    (hooks.useClassification as any).mockReturnValue({
      isLoading: false,
      classification: mockClassification,
      status: "success",
    });
    renderComponent();

    expect(screen.getByDisplayValue("Classification COICOP 2016")).toBeInTheDocument();
    expect(screen.getByDisplayValue("COICOP 2016 Classification")).toBeInTheDocument();
  });

  it("affiche le titre de la page", () => {
    (hooks.useClassification as any).mockReturnValue({
      isLoading: false,
      classification: mockClassification,
      status: "success",
    });
    renderComponent();
    expect(screen.getByRole("heading")).toHaveTextContent("Classification COICOP 2016");
  });

  it("affiche les erreurs de validation quand le formulaire est soumis avec des données invalides", () => {
    (hooks.useClassification as any).mockReturnValue({
      isLoading: false,
      classification: mockClassification,
      status: "success",
    });
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
    (hooks.useClassification as any).mockReturnValue({
      isLoading: false,
      classification: mockClassification,
      status: "success",
    });
    (hooks.useUpdateClassification as any).mockReturnValue({
      save,
      isSavingSuccess: false,
      isSaving: false,
    });
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
    (hooks.useClassification as any).mockReturnValue({
      isLoading: false,
      classification: undefined,
      status: "idle",
    });
    const { container } = renderComponent();
    expect(container).toBeEmptyDOMElement();
  });
});
