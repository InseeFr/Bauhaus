import { screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { OperationsApi } from "@sdk/operations-api";

import { renderAtRoute } from "../../page.testing";
import { Component } from "./page";

vi.mock("react-i18next", async () => ({
  ...(await vi.importActual("react-i18next")),
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("@sdk/operations-api", () => ({
  OperationsApi: {
    getSerie: vi.fn(),
    getAllFamilies: vi.fn(),
    getAllIndicators: vi.fn(),
    getSeriesList: vi.fn(),
  },
}));

vi.mock("@utils/hooks/codelist", () => ({
  useCodelist: (id: string) => ({ codes: [{ code: id }] }),
}));
vi.mock("@utils/hooks/organizations", () => ({
  useOrganizations: () => ({ data: [{ id: "org-1" }] }),
}));
vi.mock("@utils/hooks/useGoBack", () => ({ useGoBack: () => vi.fn() }));
vi.mock("@utils/hooks/useTitle", () => ({ useTitle: vi.fn() }));

vi.mock("./components/OperationsSerieEdition", () => ({
  OperationsSerieEdition: ({ serie, families, indicators, series, extraMandatoryFields }: any) => (
    <form>
      <span>série:{serie.prefLabelLg1 ?? "(nouvelle)"}</span>
      <span>familles:{families.length}</span>
      <span>indicateurs:{indicators.length}</span>
      <span>séries:{series.length}</span>
      <span>champsObligatoires:{extraMandatoryFields?.join(",") ?? "(aucun)"}</span>
    </form>
  ),
}));

const renderPage = (extraMandatoryFields = ["creator"], url = "/series/s-1/modify") =>
  renderAtRoute(<Component />, ["/series/:id/modify", "/series/create"], url, {
    extraMandatoryFields,
  });

describe("Series edit page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
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
    renderPage(undefined, "/series/create");

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
