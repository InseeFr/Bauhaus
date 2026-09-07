import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { OperationsApi } from "@sdk/operations-api";

import { AppContextProvider } from "../../../../application/app-context";
import { Component } from "./page";

const params = vi.fn();
vi.mock("react-router-dom", async () => ({
  ...(await vi.importActual("react-router-dom")),
  useParams: () => params(),
}));

vi.mock("react-i18next", async () => ({
  ...(await vi.importActual("react-i18next")),
  useTranslation: () => ({ t: (key) => key }),
}));

vi.mock("@sdk/operations-api", () => ({
  OperationsApi: {
    getSerie: vi.fn(),
    getAllFamilies: vi.fn(),
    getAllIndicators: vi.fn(),
    getSeriesList: vi.fn(),
  },
}));

vi.mock("@utils/hooks/codeslist", () => ({
  useCodesList: (id) => ({ codes: [{ code: id }] }),
}));
vi.mock("@utils/hooks/organizations", () => ({
  useOrganizations: () => ({ data: [{ id: "org-1" }] }),
}));
vi.mock("@utils/hooks/useGoBack", () => ({ useGoBack: () => vi.fn() }));
vi.mock("@utils/hooks/useTitle", () => ({ useTitle: vi.fn() }));

vi.mock("./components/OperationsSerieEdition", () => ({
  OperationsSerieEdition: ({ serie, families, indicators, series, extraMandatoryFields }) => (
    <form>
      <span>série:{serie.prefLabelLg1 ?? "(nouvelle)"}</span>
      <span>familles:{families.length}</span>
      <span>indicateurs:{indicators.length}</span>
      <span>séries:{series.length}</span>
      <span>champsObligatoires:{extraMandatoryFields?.join(",") ?? "(aucun)"}</span>
    </form>
  ),
}));

const renderPage = (extraMandatoryFields = ["creator"]) =>
  render(
    <AppContextProvider lg1="fr" lg2="en" version="2.0.0" properties={{ extraMandatoryFields }}>
      <MemoryRouter>
        <Component />
      </MemoryRouter>
    </AppContextProvider>,
  );

describe("Series edit page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    params.mockReturnValue({ id: "s-1" });
    vi.mocked(OperationsApi.getSerie).mockResolvedValue({ id: "s-1", prefLabelLg1: "Série FR" });
    vi.mocked(OperationsApi.getAllFamilies).mockResolvedValue([{ id: "f-1" }]);
    vi.mocked(OperationsApi.getAllIndicators).mockResolvedValue([{ id: "i-1" }, { id: "i-2" }]);
    vi.mocked(OperationsApi.getSeriesList).mockResolvedValue([{ id: "s-1" }]);
  });

  it("charge la série et ses référentiels avant d'ouvrir le formulaire", async () => {
    renderPage();

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();

    await waitFor(() => expect(screen.getByText("série:Série FR")).toBeInTheDocument());
    expect(screen.getByText("familles:1")).toBeInTheDocument();
    expect(screen.getByText("indicateurs:2")).toBeInTheDocument();
    expect(screen.getByText("séries:1")).toBeInTheDocument();
    expect(OperationsApi.getSerie).toHaveBeenCalledWith("s-1");
  });

  it("ouvre directement un formulaire vide en création", async () => {
    params.mockReturnValue({});
    renderPage();

    await waitFor(() => expect(screen.getByText("série:(nouvelle)")).toBeInTheDocument());
    expect(OperationsApi.getSerie).not.toHaveBeenCalled();
    expect(OperationsApi.getAllFamilies).toHaveBeenCalled();
  });

  it("transmet les champs obligatoires supplémentaires de la configuration", async () => {
    renderPage(["creator", "contributor"]);

    await waitFor(() =>
      expect(screen.getByText("champsObligatoires:creator,contributor")).toBeInTheDocument(),
    );
  });
});
